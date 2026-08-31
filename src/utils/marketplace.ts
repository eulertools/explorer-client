import BigNumber from 'bignumber.js';
import { EMarketSaleType, MarketSalePeriod, marketSalePeriodOptions } from 'src/types/marketplace';

export const MAX_APPROVE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const BNBToken = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

/**
 * We need a way to represent the Network Token in
 * the marketplace contract, this is the address.
 */
export const BNBTokenObj = {
  name: 'BNB',
  symbol: 'BNB',
  address: BNBToken,
  price_usd: 0,
  identifier: 'bsc~token~bnb',
};

export const isBNBToken = (address: string): boolean => address.toLowerCase() === BNBToken;

export const isPrivateSale = (kind: number): boolean =>
  kind === EMarketSaleType.PRIVATE || kind === EMarketSaleType.LOCKED_PRIVATE;
export const isLockedSale = (kind: number): boolean =>
  kind === EMarketSaleType.LOCKED_PUBLIC || kind === EMarketSaleType.LOCKED_PRIVATE;

export const isFinished = (isOpen: boolean, allClaimed: boolean): boolean => !isOpen && allClaimed;

/**
 * Refactor after next tests.
 */
export const getPeriodAndUnit = (period: string): string[] => {
  const periodBN = new BigNumber(period);
  if (periodBN.isGreaterThanOrEqualTo(MarketSalePeriod.MONTH)) {
    if (periodBN.dividedBy(MarketSalePeriod.MONTH).isInteger()) {
      return [
        marketSalePeriodOptions.find((i) => i.key === MarketSalePeriod.MONTH).label,
        periodBN.dividedBy(MarketSalePeriod.MONTH).toString(),
      ];
    }
    if (periodBN.dividedBy(MarketSalePeriod.WEEK).isInteger()) {
      return [
        marketSalePeriodOptions.find((i) => i.key === MarketSalePeriod.WEEK).label,
        periodBN.dividedBy(MarketSalePeriod.WEEK).toString(),
      ];
    }
    if (periodBN.dividedBy(MarketSalePeriod.DAY).isInteger()) {
      return [
        marketSalePeriodOptions.find((i) => i.key === MarketSalePeriod.DAY).label,
        periodBN.dividedBy(MarketSalePeriod.DAY).toString(),
      ];
    }
    if (periodBN.dividedBy(MarketSalePeriod.HOUR).isInteger()) {
      return [
        marketSalePeriodOptions.find((i) => i.key === MarketSalePeriod.HOUR).label,
        periodBN.dividedBy(MarketSalePeriod.HOUR).toString(),
      ];
    }
  }
  return [
    marketSalePeriodOptions.find((i) => i.key === MarketSalePeriod.MINUTE).label,
    periodBN.dividedBy(MarketSalePeriod.MINUTE).toString(),
  ];
};
