import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { FC, createContext, ReactNode, Dispatch, SetStateAction, useEffect, useState, useRef, useContext } from 'react';
import marketplaceAbi from 'src/abi/marketplace.json';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { MarketToken, EMarketContractSteps, IMarketSource } from 'src/types/marketplace';

interface ISaleSettings {
  step: number;
  stepDisabled: boolean;
  saleCompleted: boolean;
}

interface IPurchaseState {
  isOpen: boolean;
  isOwner: boolean;
  isBuyer: boolean;
  canClaim: boolean;
  canBuy: boolean;
  canCancel: boolean;
  allClaimed: boolean;
}

interface IModal {
  showModal: boolean;
  activeModal: 'sale' | 'purchase' | null;
  loading: boolean;
  error: string;
  step: EMarketContractSteps;
  kind: number;
  id: number;
  data?: IMarketSource;
}

interface IMarketplaceContext {
  tab: number;
  updateTab: Dispatch<SetStateAction<number>>;
  saleTab: number;
  updateSaleTab: Dispatch<SetStateAction<number>>;
  sale: MarketToken;
  updateSale: Dispatch<SetStateAction<MarketToken>>;
  saleSettings: ISaleSettings;
  updateSaleSettings: Dispatch<SetStateAction<ISaleSettings>>;
  purchase: IMarketSource;
  updatePurchase: Dispatch<SetStateAction<IMarketSource>>;
  purchaseState: IPurchaseState;
  modal: IModal;
  updateModal: Dispatch<SetStateAction<IModal>>;
  marketContractInstance: any;
  isBalance: boolean;
  updateIsBalance: Dispatch<SetStateAction<boolean>>;
}

export const initialSaleObject = {
  id: '',
  tokenBase: {
    key: '',
    symbol: '',
    address: '',
  },
  tokenQuote: {
    key: '',
    symbol: '',
    address: '',
  },
  amountBase: 0,
  amountQuote: 0,
  lockoutPeriod: 0,
  lockoutPeriodUnits: 0,
  numberPackages: 0,
  tokenBaseId: 0,
  kind: 0,
  closingTime: 0,
  sellerWallet: '',
  buyerWallet: '',
};

export const initialPurchaseObject = {
  base_token_address: '',
  base_token_id: '',
  base_token_name: '',
  base_token_quantity: 0,
  base_token_symbol: '',
  blockchain: '',
  category: '',
  claims: {},
  close_date: 0,
  create_date: 0,
  identifier: '',
  kind: '',
  next_claim: {},
  packages: '',
  period: '',
  purchases: {},
  quote_token_address: '',
  quote_token_name: '',
  quote_token_quantity: 0,
  quote_token_symbol: '',
  ratio: 1,
  seller_wallet: '',
  update_date: 0,
  variationPercentage: undefined,
  whitelisted_wallets: [],
};

export const initialSaleSettings = {
  step: 0,
  stepDisabled: false,
  saleCompleted: false,
};

const initialPurchaseState = {
  isOpen: false,
  isOwner: false,
  isBuyer: false,
  canClaim: false,
  canBuy: false,
  canCancel: false,
  allClaimed: false,
};

export const initialModal = {
  showModal: false,
  activeModal: null,
  loading: true,
  error: null,
  step: EMarketContractSteps.WAITING_APPROVAL,
  kind: 0,
  id: null,
  data: null,
};

export const MarketplaceContext = createContext<IMarketplaceContext>({
  tab: 0,
  updateTab: () => {},
  saleTab: 0,
  updateSaleTab: () => {},
  sale: initialSaleObject,
  updateSale: () => {},
  saleSettings: initialSaleSettings,
  updateSaleSettings: () => {},
  purchase: initialPurchaseObject,
  updatePurchase: () => {},
  purchaseState: initialPurchaseState,
  modal: initialModal,
  updateModal: () => {},
  marketContractInstance: null,
  isBalance: false,
  updateIsBalance: () => {},
});

interface IMarketplaceProviderProps {
  children: ReactNode;
}

export const MarketplaceContextProvider: FC<IMarketplaceProviderProps> = ({ children }) => {
  const { active, library, account } = useWeb3React();
  const isMountedRef = useIsMountedRef();
  const { chain } = useContext(ConfigurationContext);

  const [tab, setTab] = useState<number>(0);
  const [saleTab, setSaleTab] = useState<number>(0);
  const [sale, setSale] = useState<MarketToken>(initialSaleObject);
  const [saleSettings, setSaleSettings] = useState<ISaleSettings>(initialSaleSettings);
  const [purchase, setPurchase] = useState<IMarketSource>(initialPurchaseObject);
  const [purchaseState, setPurchaseState] = useState<IPurchaseState>(initialPurchaseState);
  const [modal, setModal] = useState<IModal>(initialModal);
  const [marketContractInstance, setMarketContractInstance] = useState<any>(null);
  const [isBalance, setIsBalance] = useState<boolean>(false);
  const web3 = useRef(null);

  useEffect(() => {
    web3.current = new Web3(library?.provider);

    const marketContract = new web3.current.eth.Contract(marketplaceAbi.abi, chain.bsc.products.marketplace);

    if (isMountedRef) {
      setMarketContractInstance(marketContract);
    }
  }, [active, library]);

  /**
   * Handles all the possible states in a sale
   */
  useEffect(() => {
    if (!account) {
      return;
    }

    if (purchase !== initialPurchaseObject) {
      const isOpen = purchase.close_date === 0;
      const isOwner = purchase.seller_wallet.toLowerCase() === account.toLowerCase();
      /**
       * Can only be a buyer if the user's wallet
       * is whitelisted, they have claimed the sale or
       * they have a purchase.
       */
      const whitelisted = purchase.whitelisted_wallets?.includes(account.toLowerCase());
      const claimed = !!purchase.claims[account.toLowerCase()];
      const purchased = !!purchase.purchases[account.toLowerCase()];
      const isBuyer = whitelisted || claimed || purchased;
      /**
       * The use can only claim if they are considered
       * a buyer first, and if the date for the
       * next claim has already passed.
       */
      const nextClaimTime = purchase.next_claim[account.toLowerCase()]?.timestamp;
      const currentTime = new Date().getTime();
      const allClaimed = purchase.claims[account.toLowerCase()]?.length === +purchase.packages;
      const couldClaimNow = isBuyer && nextClaimTime < currentTime && !allClaimed;
      const canClaim = couldClaimNow;
      /**
       * The only kind of sales currently available for purchase/trade are
       * PUBLIC : 0
       * PRIVATE : 1
       * LOCKED PUBLIC : 2
       * LOCKED PRIVATE : 3
       */
      const isPublicKind = [0, 2].some((i) => i === +purchase.kind);
      const isPrivateKind = [1, 3].some((i) => i === +purchase.kind);
      const publicSales = !isOwner && isOpen && isPublicKind;
      const privateSales = !isOwner && isOpen && isPrivateKind;
      const canBuy = publicSales || privateSales;
      /**
       * Checks whether the user owns the sale
       * and is an open sale.
       */
      const ownOpenSale = isOwner && isOpen;
      const canCancel = ownOpenSale;
      setPurchaseState({
        isOpen,
        isOwner,
        isBuyer,
        canClaim,
        canBuy,
        canCancel,
        allClaimed,
      });
    }
  }, [account, purchase]);

  return (
    <MarketplaceContext.Provider
      value={{
        tab,
        updateTab: setTab,
        saleTab,
        updateSaleTab: setSaleTab,
        sale,
        updateSale: setSale,
        saleSettings,
        updateSaleSettings: setSaleSettings,
        purchase,
        updatePurchase: setPurchase,
        purchaseState,
        modal,
        updateModal: setModal,
        marketContractInstance,
        isBalance,
        updateIsBalance: setIsBalance,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
