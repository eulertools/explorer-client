import Web3 from 'web3';
import nftAbi from 'src/abi/nft.json';
import nftAbiBuy from 'src/abi/nftbuy.json';
import { IRequestNFTData, ISignature, INFTAdParameters, INFTAdNote } from 'src/types/nft';
import SnackbarService from 'src/utils/snackbar';
import { BNBToken } from './marketplace';

/**
 * Claims an NFT for your wallet
 *
 * @param nftContractAddress Contract for the collection of NFT.
 * @param account Connected web3 user account.
 * @param event Data for the NFT event.
 * @param signature Information for the NFT signature.
 * @param position The position for the Request.
 *
 */
export const onMint = async (
  nftContractAddress: string,
  account: string,
  event: IRequestNFTData,
  signature: ISignature,
  position: string,
): Promise<boolean> => {
  try {
    const web3 = new Web3(Web3.givenProvider);
    const nftContract = new web3.eth.Contract(nftAbi.abi as any, nftContractAddress);

    const message = '';

    await nftContract.methods.mint(event, signature, position, message).send({ from: account });

    return true;
  } catch (error) {
    SnackbarService.error(error?.message || error, {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 5000,
    });
    return false;
  }
};

/**
 * Buy an NFT ad
 *
 * @param nftContractAddress Contract for the collection of NFT.
 * @param account Connected web3 user account.
 * @param parameters NFT ad data.
 * @param note NFT ad transaction data.
 * @param signatureCreate Information for the NFT signature create.
 * @param signature Information for the NFT signature.
 * @param to Buyer address.
 *
 */

export const onBuy = async (
  nftContractAddress: string,
  account: string,
  parameters: INFTAdParameters,
  note: INFTAdNote,
  signatureCreate: ISignature,
  signature: ISignature,
  to: string,
): Promise<boolean> => {
  try {
    const web3 = new Web3(Web3.givenProvider);
    const nftContract = new web3.eth.Contract(nftAbiBuy.abi as any, nftContractAddress);
    let value = '0';
    if (note.buyToken === BNBToken) {
      value = note.price;
    }

    await nftContract.methods.buy(parameters, note, signatureCreate, signature, to).send({ from: account, value });

    return true;
  } catch (error) {
    SnackbarService.error(error?.message || error, {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 5000,
    });
    return false;
  }
};

/**
 * Gets the info for the NFT
 *
 * @param nftContractAddress Contract for the collection of NFT.
 * @param account Connected web3 user account.
 * @param tokenId ID of the NFT.
 */
export const onInfo = async (nftContractAddress: string, tokenId: string) => {
  try {
    const web3 = new Web3(Web3.givenProvider);
    const nftContract = new web3.eth.Contract(nftAbi.abi as any, nftContractAddress);

    await nftContract.methods.metadata(tokenId).call();
  } catch (error) {
    SnackbarService.error(error?.message || error, {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 5000,
    });
  }
};

/**
 * Determines whether user is owner of an NFT in ERC1155
 *
 * @param nftContractAddress Contract for the collection of NFT.
 * @param account Connected web3 user account.
 * @param tokenId ID of the NFT.
 */
export const isOwner = async (nftContractAddress: string, account: string, tokenId: string): Promise<boolean> => {
  try {
    const web3 = new Web3(Web3.givenProvider);
    const nftContract = new web3.eth.Contract(nftAbi.abi as any, nftContractAddress);

    const balance = await nftContract.methods.balanceOf(account, tokenId).call();

    return balance > 0;
  } catch (error) {
    SnackbarService.error(error?.message || error, {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 5000,
    });
    return false;
  }
};
