import Web3 from 'web3';

export const shortAddress = (address: string) => {
  if (address) {
    if (address.length > 7) {
      return `${address.substr(0, 6)}...${address.substr(address.length - 4, 4)}`;
    }
    return address;
  }

  return '';
};

export const shortString = (value: string, length: number) => {
  if (value.length > length) {
    return `${value.slice(0, length - 1)}...`;
  }
  return value;
};

export const checksumAddress = (address: string) => Web3.utils.toChecksumAddress(address);

export const extractPairAddress = (hash: string) => (hash && hash.replace(/^.*~([^-~]+)/gi, '$1')) || hash;

export const isAddress = (query: string) => /^0x[a-fA-F0-9]{40}$/.test(query);

export const isBlock = (query: string) => /^\d+$/.test(query);

export const isTransaction = (query: string) => /^0x([A-Fa-f0-9]{64})$/.test(query);

export const pathJoin = (strings: string[], separator?: string): string => {
  const sep = separator || '/';
  const replace = new RegExp(`${sep}{1,}`, 'g');
  return strings.join(sep).replace(replace, sep);
};

export function hexToRGB(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}
