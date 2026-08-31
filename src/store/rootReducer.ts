import { combineReducers } from '@reduxjs/toolkit';
import { reducer as calendarReducer } from 'src/slices/calendar';
import { reducer as chatReducer } from 'src/slices/chat';
import { reducer as coindataReducer } from 'src/slices/coindata';
import { reducer as addressReducer } from 'src/slices/entities/address';
import { reducer as pairDetailReducer } from 'src/slices/entities/pairDetail';
import { reducer as poolReducer } from 'src/slices/entities/poolDetail';
import { reducer as tokenExchange } from 'src/slices/entities/token-exchange';
import { reducer as yieldReducer } from 'src/slices/entities/yield';
import { reducer as kanbanReducer } from 'src/slices/kanban';
import { reducer as mailReducer } from 'src/slices/mail';
import { reducer as settingsReducer } from 'src/slices/settings';
import { reducer as exchangesReducer } from 'src/slices/tables/exchanges';
import { reducer as marketplaceReducer } from 'src/slices/tables/marketplace';
import { reducer as marketsReducer } from 'src/slices/tables/markets';
import { reducer as mediumReducer } from 'src/slices/tables/medium';
import { reducer as ntfReducer } from 'src/slices/tables/nft';
import { reducer as pairTransactionsReducer } from 'src/slices/tables/pairTransactions';
import { reducer as pairsReducer } from 'src/slices/tables/pairs';
import { reducer as tokenTransactionReducer } from 'src/slices/tables/tokenTransactions';
import { reducer as tokensReducer } from 'src/slices/tables/tokens';
import { reducer as transactionReducer } from 'src/slices/tables/transactions';
import { reducer as twitterReducer } from 'src/slices/tables/twitter';
import { reducer as txnsReducer } from 'src/slices/tables/txns';
import { reducer as globalFilters } from 'src/slices/ui/filters';
import { reducer as globalModalReducer } from 'src/slices/ui/globalModal';
import { reducer as userProfileReducer } from 'src/slices/user/account';
import { reducer as channelsReducer } from 'src/slices/user/channels';
import { reducer as favoritesReducer } from 'src/slices/user/favorites';
import { reducer as notificationsReducer } from 'src/slices/user/notifications';
import { reducer as portfoliosReducer } from 'src/slices/user/portfolios';
import { reducer as projectsReducer } from 'src/slices/user/projects';
import { reducer as subscriptionReducer } from 'src/slices/user/subscriptionModal';
import { reducer as walletReducer } from 'src/slices/user/wallet';

const rootReducer = combineReducers({
  // ENTITIES -------------------------------
  address: addressReducer,
  coindata: coindataReducer,
  pairDetail: pairDetailReducer,
  poolDetail: poolReducer,
  tokenExchanges: tokenExchange,
  yield: yieldReducer,
  // TABLES ---------------------------------
  exchanges: exchangesReducer,
  marketplace: marketplaceReducer,
  nft: ntfReducer,
  pairs: pairsReducer,
  pairTransactions: pairTransactionsReducer,
  tokens: tokensReducer,
  markets: marketsReducer,
  tokenTransactions: tokenTransactionReducer,
  transactions: transactionReducer,
  txns: txnsReducer,
  // USER -----------------------------------
  channels: channelsReducer,
  favorites: favoritesReducer,
  medium: mediumReducer,
  notifications: notificationsReducer,
  portfolios: portfoliosReducer,
  projects: projectsReducer,
  subscriptionModal: subscriptionReducer,
  twitter: twitterReducer,
  account: userProfileReducer,
  wallet: walletReducer,
  // UI -------------------------------------
  globalFilters,
  uimodal: globalModalReducer,
  // OTHER ----------------------------------
  calendar: calendarReducer,
  chat: chatReducer,
  kanban: kanbanReducer,
  mail: mailReducer,
  // SYSTEM
  settings: settingsReducer,
});

export type RootStoreType = ReturnType<typeof rootReducer>;

export default rootReducer;
