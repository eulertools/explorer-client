import { capitalize } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { widget as Widget } from '../../charting_library';
import useAuth from '../../hooks/useAuth';
import { UDFCompatibleDatafeed } from './data/udf-compatible-datafeed';
import './index.css';

export default function MarketChartTV(props) {
  // eslint-disable-next-line react/prop-types
  const { identifier, customHeight = 'calc(100vh - 300px)', network } = props;

  const [TvWidget, setTvWidget] = useState(null);

  const auth = useAuth();
  const theme = useTheme();

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

  useEffect(() => {
    if (TvWidget) {
      // Set just in case useEffect that listens to symbol changes fires before widget
      // gets actually removed
      TvWidget.removing = true;
      TvWidget.remove();
      setTvWidget(null);
    }

    // Set User favorite Interval as default to persist after logouts and app refresh.
    const favInterval = JSON.parse(localStorage.getItem('tradingview.IntervalWidget.quicks'));
    const widgetInterval = favInterval?.filter(String)?.length > 0 ? favInterval[0] : defaultProps.interval;

    const pairNetworkLabel = network || 'bsc';

    const widgetOptions = {
      debug: true,
      symbol: identifier,
      auto_save_delay: 5,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new UDFCompatibleDatafeed(`${process.env.REACT_APP_API_URL}/${pairNetworkLabel}`, 50000),
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
  }, [auth.user?.id]);

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
