import BigNumber from 'bignumber.js';
import { TokenDTO } from 'src/types/token';
import { EulerAddressTypes } from 'src/ui/EulerAddress';

export const getUnitPriceToken = (t: TokenDTO) => {
  if (t?.token?._source?.category === EulerAddressTypes.lptoken) {
    return new BigNumber(t?.token?._source?.quote_token_balance)
      .dividedBy(t?.token?._source?.base_token_balance)
      .toFixed(4);
  }
  return parseFloat(t?.token?._source?.price_usd);
};

export const getAmountPriceToken = (t: TokenDTO) => +getUnitPriceToken(t) * t?.quantity;
