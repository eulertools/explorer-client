import { ESupportedExchanges } from 'src/types/pair';
import { getPlatformSrc, getTokenSrc } from './avatar';

export function getExchangeInfoFromOwner(
  owner: ESupportedExchanges,
  baseAddress: string,
  quoteAddress: string,
  externalLinks: Record<string, string>,
): { label: string; link: string; avatarSrc: string } {
  switch (owner) {
    case ESupportedExchanges.pancake1: {
      return {
        label: 'Pancake V1',
        link: `${externalLinks.pancakeSwapv1}inputCurrency=${quoteAddress}&outputCurrency=${baseAddress}`,
        avatarSrc: getTokenSrc('cake'),
      };
    }
    case ESupportedExchanges.pancake2: {
      return {
        label: 'Pancake V2',
        link: `${externalLinks.pancakeswap}inputCurrency=${quoteAddress}&outputCurrency=${baseAddress}`,
        avatarSrc: getTokenSrc('cake'),
      };
    }
    case ESupportedExchanges.wswap: {
      return {
        label: 'Wault Swap',
        link: `${externalLinks.waultSwap}inputCurrency=${quoteAddress}&outputCurrency=${baseAddress}`,
        avatarSrc: '/static/wault.png',
      };
    }
    case ESupportedExchanges.mdex: {
      return {
        label: 'MDEX',
        link: `${externalLinks.mdex}inputCurrency=${quoteAddress}&outputCurrency=${baseAddress}`,
        avatarSrc: getPlatformSrc('mdex'),
      };
    }
    case ESupportedExchanges.unisave: {
      return {
        label: 'Unisave',
        link: `${externalLinks.unisave}inputCurrency=${quoteAddress}&outputCurrency=${baseAddress}`,
        avatarSrc: getPlatformSrc('unisave'),
      };
    }
    case ESupportedExchanges.biswap: {
      return {
        label: 'Biswap',
        link: `${externalLinks.biswap}inputCurrency=${quoteAddress}&outputCurrency=${baseAddress}`,
        avatarSrc: getPlatformSrc('biswap'),
      };
    }
    case ESupportedExchanges.apeswap: {
      return {
        label: 'ApeSwap',
        link: `${externalLinks.apeswap}inputCurrency=${quoteAddress}&outputCurrency=${baseAddress}`,
        avatarSrc: getPlatformSrc('apeswap'),
      };
    }
    case ESupportedExchanges.alitaswap: {
      return {
        label: 'AlitaSwap',
        link: `${externalLinks.alitaswap}inputCurrency=${quoteAddress}&outputCurrency=${baseAddress}`,
        avatarSrc: getPlatformSrc('alitaswap'),
      };
    }
    case ESupportedExchanges.wardenswap: {
      return {
        label: 'WardenSwap',
        link: `${externalLinks.wardenswap}inputCurrency=${quoteAddress}&outputCurrency=${baseAddress}`,
        avatarSrc: getPlatformSrc('warden'),
      };
    }
    case ESupportedExchanges.babyswap: {
      return {
        label: 'BabySwap',
        link: `${externalLinks.babyswap}inputCurrency=${quoteAddress}&outputCurrency=${baseAddress}`,
        avatarSrc: getPlatformSrc('babyswap'),
      };
    }
    case ESupportedExchanges.bscswap: {
      return {
        label: 'BSCswap',
        link: `${externalLinks.bscswap}inputCurrency=${quoteAddress}&outputCurrency=${baseAddress}`,
        avatarSrc: getPlatformSrc('bscswap'),
      };
    }
    case ESupportedExchanges.bakeryswap: {
      return {
        label: 'BakerySwap',
        link: `${externalLinks.bakeryswap}inputCurrency=${quoteAddress}&outputCurrency=${baseAddress}`,
        avatarSrc: getPlatformSrc('bakeryswap'),
      };
    }
    default:
      return { label: 'Unknown', link: '#', avatarSrc: '' };
  }
}
