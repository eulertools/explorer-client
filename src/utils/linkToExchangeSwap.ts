export const linkToExchangeSwap = (owner: string, base_token_address: string, quote_token_address: string) => {
  switch (owner) {
    case 'wswap':
      return `https://swap.wault.finance/bsc/index.html#/swap?inputCurrency=${base_token_address}&outputCurrency=${quote_token_address}`;

    case 'pancake1':
      return `https://v1exchange.pancakeswap.finance/swap?inputCurrency=${base_token_address}&outputCurrency=${quote_token_address}`;

    case 'pancake2':
      return `https://pancakeswap.finance/swap?inputCurrency=${base_token_address}&outputCurrency=${quote_token_address}`;

    default:
      return '#';
  }
};
