import { QuoteData, QuotesCallback } from '../../../charting_library/datafeed-api';
import { getErrorMessage, logMessage } from './helpers';
import { IQuotesProvider } from './iquotes-provider';

interface QuoteSubscriber {
  symbols: string[];
  fastSymbols: string[];
  listener: QuotesCallback;
}

interface QuoteSubscribers {
  [listenerId: string]: QuoteSubscriber;
}

const SymbolsType = {
  General: 0,
  Fast: 1,
};

const UpdateTimeouts = {
  Fast: 10 * 1000,
  General: 60 * 1000,
};

export class QuotesPulseProvider {
  private readonly _quotesProvider: IQuotesProvider;

  private readonly _subscribers: QuoteSubscribers = {};

  private _requestsPending: number = 0;

  public constructor(quotesProvider: IQuotesProvider) {
    this._quotesProvider = quotesProvider;

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    setInterval(this._updateQuotes.bind(this, SymbolsType.Fast), UpdateTimeouts.Fast);
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    setInterval(this._updateQuotes.bind(this, SymbolsType.General), UpdateTimeouts.General);
  }

  public subscribeQuotes(
    symbols: string[],
    fastSymbols: string[],
    onRealtimeCallback: QuotesCallback,
    listenerGuid: string,
  ): void {
    this._subscribers[listenerGuid] = {
      symbols,
      fastSymbols,
      listener: onRealtimeCallback,
    };

    logMessage(`QuotesPulseProvider: subscribed quotes with #${listenerGuid}`);
  }

  public unsubscribeQuotes(listenerGuid: string): void {
    delete this._subscribers[listenerGuid];
    logMessage(`QuotesPulseProvider: unsubscribed quotes with #${listenerGuid}`);
  }

  private _updateQuotes(updateType: number): void {
    if (this._requestsPending > 0) {
      return;
    }

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const listenerGuid in this._subscribers) {
      // tslint:disable-line:forin
      this._requestsPending += 1;

      const subscriptionRecord = this._subscribers[listenerGuid];
      this._quotesProvider
        .getQuotes(updateType === SymbolsType.Fast ? subscriptionRecord.fastSymbols : subscriptionRecord.symbols)
        .then((data: QuoteData[]) => {
          this._requestsPending -= 1;
          // eslint-disable-next-line no-prototype-builtins
          if (!this._subscribers.hasOwnProperty(listenerGuid)) {
            return;
          }

          subscriptionRecord.listener(data);
          logMessage(
            `QuotesPulseProvider: data for #${listenerGuid} (${updateType}) updated successfully, pending=${this._requestsPending}`,
          );
        })
        .catch((reason?: string | Error) => {
          // eslint-disable-next-line no-plusplus
          this._requestsPending--;
          logMessage(
            `QuotesPulseProvider: data for #${listenerGuid} (${updateType}) updated with error=${getErrorMessage(
              reason,
            )}, pending=${this._requestsPending}`,
          );
        });
    }
  }
}
