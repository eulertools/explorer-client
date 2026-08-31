import { loggerWarn } from 'src/utils/logger';
import { Bar, HistoryMetadata, LibrarySymbolInfo, PeriodParams } from '../../../charting_library/datafeed-api';
import { getErrorMessage, RequestParams, UdfErrorResponse, UdfOkResponse, UdfResponse } from './helpers';
import { Requester } from './requester';

// tslint:disable: no-any
interface HistoryPartialDataResponse extends UdfOkResponse {
  t: any;
  c: any;
  o?: never;
  h?: never;
  l?: never;
  v?: never;
}

interface HistoryFullDataResponse extends UdfOkResponse {
  t: any;
  c: any;
  o: any;
  h: any;
  l: any;
  v: any;
}

// tslint:enable: no-any
interface HistoryNoDataResponse extends UdfResponse {
  s: 'no_data';
  nextTime?: number;
}

type HistoryResponse = HistoryFullDataResponse | HistoryPartialDataResponse | HistoryNoDataResponse;

export type PeriodParamsWithOptionalCountback = Omit<PeriodParams, 'countBack'> & { countBack?: number };

export interface GetBarsResult {
  bars: Bar[];
  meta: HistoryMetadata;
}

export class HistoryProvider {
  private _datafeedUrl: string;

  private readonly _requester: Requester;

  public constructor(datafeedUrl: string, requester: Requester) {
    this._datafeedUrl = datafeedUrl;
    this._requester = requester;
  }

  public getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: string,
    periodParams: PeriodParamsWithOptionalCountback,
  ): Promise<GetBarsResult> {
    const requestParams: RequestParams = {
      token_address: symbolInfo.address,
      since: new Date(new Date(periodParams.from * 1000 - 86400000)).toISOString(),
      till: new Date(new Date(periodParams.to * 1000)).toISOString(),
      window: resolution,
    };

    if (periodParams.countBack !== undefined) {
      requestParams.countback = periodParams.countBack;
    }

    if (symbolInfo.currency_code !== undefined) {
      requestParams.currencyCode = symbolInfo.currency_code;
    }

    return new Promise((resolve: (result: GetBarsResult) => void, reject: (reason: string) => void) => {
      // eslint-disable-next-line no-console
      this._requester
        .sendRequest<HistoryResponse>(this._datafeedUrl, 'datatables', requestParams)
        .then((response: any | HistoryResponse | UdfErrorResponse) => {
          /*          if (response.s !== 'ok' && response.s !== 'no_data') {
            reject(response.errmsg);
            return;
          } */

          const bars: Bar[] = [];

          if (response.length) {
            response.map((bar) => {
              let newBar = bar;
              if (bar.close > bar.open) {
                if (bar.high > bar.close * 1.1) {
                  newBar = { ...newBar, high: bar.close * 1.1 };
                }
                if (bar.low < bar.open * 0.9) {
                  newBar = { ...newBar, low: bar.open * 0.9 };
                }
              } else {
                if (bar.high > bar.open * 1.1) {
                  newBar = { ...newBar, high: bar.open * 1.1 };
                }
                if (bar.low < bar.close * 0.9) {
                  newBar = { ...newBar, low: bar.close * 0.9 };
                }
              }
              bars.push(newBar);
              return newBar;
            });
          }

          const meta: HistoryMetadata = {
            noData: false,
          };

          if (!response.length) {
            meta.noData = true;
          }

          resolve({
            bars,
            meta,
          });
        })
        .catch((reason?: string | Error) => {
          const reasonString = getErrorMessage(reason);

          loggerWarn(`HistoryProvider: getBars() failed, error=${reasonString}`);
          reject(reasonString);
        });
    });
  }
}
