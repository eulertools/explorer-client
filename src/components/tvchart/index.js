import { capitalize } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import { widget as Widget } from '../../charting_library';
import useAuth from '../../hooks/useAuth';
import { selectFilterState } from '../../selectors/filters';
import { ESupportedNetworks } from '../../types/blockchain';
import { UDFCompatibleDatafeed } from './data/udf-compatible-datafeed';
import './index.css';

export const networkToBaseCurrencyMap = {
  [ESupportedNetworks.BNB]: 'BNB',
  [ESupportedNetworks.ETHEREUM]: 'ETH',
};

export default function TVChartContainer(props) {
  // eslint-disable-next-line react/prop-types
  const { pair, customHeight = 'calc(100vh - 300px)', uiTableId = undefined, network } = props;

  const [TvWidget, setTvWidget] = useState(null);

  const auth = useAuth();
  const theme = useTheme();

  // Comparison to avoid crashing when going to /token/euler (no {network} param)
  const pairNetworkLabel = network ? network.toUpperCase() : 'BSC';
  const mode = capitalize(theme.palette.mode);

  const [defaultProps] = useState({
    interval: '60', // Initial interval
    containerId: 'tv_chart_container',
    libraryPath: '/static/charting_library/',
    chartsStorageUrl: `${process.env.REACT_APP_API_URL}/charts`,
    chartsStorageApiVersion: '1.1',
    clientId: 'euler.tools',
    userId: auth.user?.id,
    fullscreen: false,
    autosize: true,
    allow_symbol_change: false,
    studiesOverrides: {},
    theme: mode,
    overrides: { volumePaneSize: 'tiny' },
    randomUser: Math.floor(Math.random() * 10000),
  });

  const filters = useSelector(selectFilterState(uiTableId));

  const getOwner = React.useCallback(() => {
    if (!uiTableId) {
      return pair.owner;
    }

    return filters?.filter?.owner || pair.owner || '';
  }, [pair.owner, uiTableId, filters]);

  useEffect(() => {
    if (TvWidget) {
      // Set just in case useEffect that listens to symbol changes fires before widget
      // gets actually removed
      TvWidget.removing = true;
      TvWidget.remove();
      setTvWidget(null);
    }

    const symbol = `${pairNetworkLabel}|${pair.token0.symbol}|${pair.token0.id}|${pair.token1.symbol}|${
      pair.token1.id
    }|${pair.currency || networkToBaseCurrencyMap[network]}|${getOwner()}`;

    // Set User favorite Interval as default to persist after logouts and app refresh.
    const favInterval = JSON.parse(localStorage.getItem('tradingview.IntervalWidget.quicks'));
    const widgetInterval = favInterval?.filter(String)?.length > 0 ? favInterval[0] : defaultProps.interval;

    const widgetOptions = {
      symbol,
      auto_save_delay: 5,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new UDFCompatibleDatafeed(`${process.env.REACT_APP_API_URL}/${network}`, 5000),
      interval: widgetInterval,
      container: defaultProps.containerId,
      library_path: defaultProps.libraryPath,
      locale: 'en',
      enabled_features: ['study_templates'],
      charts_storage_url: defaultProps.chartsStorageUrl,
      charts_storage_api_version: defaultProps.chartsStorageApiVersion,
      client_id: auth.user?.id,
      user_id: auth.user?.id || defaultProps.randomUser,
      fullscreen: defaultProps.fullscreen,
      load_last_chart: true,
      autosize: defaultProps.autosize,
      theme: mode.toLocaleLowerCase(),
      studies_overrides: defaultProps.studiesOverrides,
    };

    const tvWidget = new Widget(widgetOptions);

    tvWidget.onChartReady(() => {
      tvWidget.subscribe('onAutoSaveNeeded', () => {
        tvWidget.saveChartToServer();
      });

      tvWidget.saveChartToServer(undefined, undefined, {
        defaultChartName: 'Default',
      });
    });

    setTvWidget(tvWidget);
    // Regenerate the widget only if users logs out (we need to clear the drawings for example)
  }, [auth.user?.id, network]);

  useEffect(() => {
    if (TvWidget?._ready && !TvWidget.removing) {
      const symbol = `${pairNetworkLabel}|${pair.token0.symbol}|${pair.token0.id}|${pair.token1.symbol}|${
        pair.token1.id
      }|${pair.currency || networkToBaseCurrencyMap[network]}|${getOwner()}`;

      // Maintain user selected interval between changes of Favorites.
      TvWidget.setSymbol(symbol, TvWidget.symbolInterval().interval.toString());
    }
  }, [pair, filters?.filter?.owner]);

  // Cleanup needed to avoid running into crashes when login in and out
  useEffect(
    () => () => {
      setTvWidget(null);
    },
    [],
  );

  useEffect(() => {
    if (TvWidget?._ready && !TvWidget.removing) {
      TvWidget.changeTheme(mode);
    }
  }, [mode]);

  return <div id={defaultProps.containerId} style={{ height: customHeight }} />;
}
