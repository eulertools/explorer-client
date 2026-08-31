import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import AuthGuard from './components/AuthGuard';
import AuthWalletGuard from './components/AuthWalletGuard';
import EagerConnectGuard from './components/EagerConnectGuard';
import MainLayout from './components/MainLayout';
import DashboardLayout from './components/dashboard/DashboardLayout';
import NetworkDashboardLayout from './pages/NetworkDashboardLayout';
import NetworkRedirect from './pages/NetworkRedirect';
import { Loadable } from './ui/Loadable';

const DashboardHome = Loadable(lazy(() => import('./pages/dashboard/Home')));
// USER-----------------------------------------------------------------------------------------------
const Profile = Loadable(lazy(() => import('./pages/user/Profile')));
const SocialProfile = Loadable(lazy(() => import('./pages/profiles/SocialProfile')));
const LogoutPage = Loadable(lazy(() => import('./pages/user/LogoutPage')));
// AUTHENTICATION-------------------------------------------------------------------------------------
const DelayedRegistering = Loadable(lazy(() => import('./pages/authentication/DelayedRegistering')));
const LoginPage = Loadable(lazy(() => import('./pages/authentication/Login')));
const RegisterPage = Loadable(lazy(() => import('./pages/authentication/Register')));
const PasswordRecovery = Loadable(lazy(() => import('./pages/authentication/PasswordRecovery')));
const PasswordReset = Loadable(lazy(() => import('./pages/authentication/PasswordReset')));
const VerifyCode = Loadable(lazy(() => import('./pages/authentication/VerifyCode')));
const VerifyEmail = Loadable(lazy(() => import('./pages/authentication/VerifyEmail')));
// ERRORS---------------------------------------------------------------------------------------------
const AuthorizationRequired = Loadable(lazy(() => import('./pages/AuthorizationRequired')));
const NotFound = Loadable(lazy(() => import('./pages/NotFound')));
const ServerError = Loadable(lazy(() => import('./pages/ServerError')));
// WALLETS--------------------------------------------------------------------------------------------
const Wallets = Loadable(lazy(() => import('./pages/wallet/Wallets')));
// MARKETS----------------------------------------------------------------------------------------------
const Markets = Loadable(lazy(() => import('./pages/markets/Markets')));
const MarketDetail = Loadable(lazy(() => import('./pages/markets/MarketDetail')));
const MyTrades = Loadable(lazy(() => import('./pages/myTrades/MyTrades')));
// TOKEN----------------------------------------------------------------------------------------------
const Tokens = Loadable(lazy(() => import('./pages/tokens/Tokens')));
const TokenDetail = Loadable(lazy(() => import('./pages/tokens/TokenDetail')));
const EulerTokenDetail = Loadable(lazy(() => import('./pages/tokens/EulerTokenDetail')));
// STAKING--------------------------------------------------------------------------------------------
const Staking = Loadable(lazy(() => import('./pages/staking')));
// INFORMATION----------------------------------------------------------------------------------------
const TermsAndConditionsPage = Loadable(lazy(() => import('./pages/legal/TermsAndConditions')));
const PrivacyPolicyPage = Loadable(lazy(() => import('./pages/legal/PrivacyPolicy')));
const Projects = Loadable(lazy(() => import('./pages/projects/Projects')));
// BLOCKCHAIN-----------------------------------------------------------------------------------------
const AddressDetail = Loadable(lazy(() => import('./pages/address/AddressDetail')));
const TransactionDetail = Loadable(lazy(() => import('./pages/transactionDetail/TransactionDetail')));
const BlockDetail = Loadable(lazy(() => import('./pages/block/BlockDetail')));
// TELEGRAM-------------------------------------------------------------------------------------------
const ConfigureTelegram = Loadable(lazy(() => import('./pages/telegram/Configure')));
// FARMS----------------------------------------------------------------------------------------------
// const Farms = Loadable(lazy(() => import('./pages/farms')));
// SWAPPER--------------------------------------------------------------------------------------------
const Swapper = Loadable(lazy(() => import('./pages/swapper')));
// MARKETPLACE----------------------------------------------------------------------------------------
const Marketplace = Loadable(lazy(() => import('./pages/marketplace/Marketplace')));
// NFT------------------------------------------------------------------------------------------------
// const Collections = Loadable(lazy(() => import('./pages/nft/Collections')));
// const CollectionDetails = Loadable(lazy(() => import('./pages/nft/CollectionDetails')));
const NFTDetails = Loadable(lazy(() => import('./pages/nft/NFTDetail')));
const NFTCreate = Loadable(lazy(() => import('./pages/nftcreate/NFTCreate')));
const NFTPost = Loadable(lazy(() => import('./pages/nftpost/NFTPost')));
const NFTBuy = Loadable(lazy(() => import('./pages/nftbuy/NFTBuy')));
// ASSETS---------------------------------------------------------------------------------------------
const Assets = Loadable(lazy(() => import('./pages/assets/Assets')));
const Portfolios = Loadable(lazy(() => import('./pages/portfolios/Portfolios')));
// MIGRATION------------------------------------------------------------------------------------------
const Migration = Loadable(lazy(() => import('./pages/migration/Migration')));

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <EagerConnectGuard>
        <AuthWalletGuard>
          <NetworkRedirect />
        </AuthWalletGuard>
      </EagerConnectGuard>
    ),
  },
  {
    path: '/:network',
    element: <NetworkDashboardLayout />,
    children: [
      {
        path: '/:network/',
        element: <DashboardHome />,
      },
      // ASSETS-----------------------------------------------------------------------
      {
        path: '/:network/assets',
        element: <Assets />,
      },
      // TOKEN------------------------------------------------------------------------
      {
        path: '/:network/token',
        element: <Tokens />,
      },
      {
        path: '/:network/token/:address',
        element: <TokenDetail />,
      },
      // MARKETPLACE------------------------------------------------------------------
      {
        path: '/:network/marketplace',
        element: <Marketplace />,
      },
      {
        path: '/:network/marketplace/:identifier',
        element: <Marketplace />,
      },
      // WALLET-----------------------------------------------------------------------
      /**
       * Hidden route, useful for tests regarding new Assets Section
       * Best way to create-delete-rename Wallets for tests.
       */
      {
        path: '/:network/wallets/:address', // we use this :address as key for redirect
        element: <Wallets />,
      },
      {
        path: '/:network/wallets',
        element: <Wallets />,
      },
      /**
       * Hidden route used for testing in Assets Section regarding
       * Tracked wallets table.
       */
      {
        path: '/:network/portfolios',
        element: <Portfolios />,
      },
      {
        path: '/:network/projects',
        element: <Projects />,
      },
      {
        path: '/:network/tx/:hashId',
        element: <TransactionDetail />,
      },
      {
        path: '/:network/block/:blockId',
        element: <BlockDetail />,
      },
      {
        path: '/:network/address/:addressId',
        element: <AddressDetail />,
      },
      {
        path: '/:network/staking',
        element: <Staking />,
      },
      {
        path: '/:network/mytrades',
        element: <MyTrades />,
      },
      // {
      //   path: '/farms',
      //   children: [
      //     {
      //       path: '/:farmId',
      //       element: <Farms />,
      //     },
      //     {
      //       path: '',
      //       element: <Farms />,
      //     },
      //   ],
      // },
      {
        path: '/:network/swap',
        element: <Swapper />,
      },
      {
        path: '/:network/nft/:address/:tokenId',
        element: <NFTDetails />,
      },
      {
        path: '/:network/migration',
        element: <Migration />,
      },
    ],
  },
  // Routes without network
  {
    path: '',
    element: <DashboardLayout />,
    children: [
      // PROFILES------------------------------------------------------------------------
      {
        path: '/profile/me',
        element: (
          <AuthGuard>
            <EagerConnectGuard>
              <SocialProfile />
            </EagerConnectGuard>
          </AuthGuard>
        ),
      },
      {
        path: '/profile/:profileId',
        element: <SocialProfile />,
      },
      // TOKEN------------------------------------------------------------------------
      {
        path: '/tokens',
        element: <Markets />,
      },
      {
        path: '/tokens/:address',
        element: <MarketDetail />,
      },
      // USER------------------------------------------------------------------------
      {
        path: '/user',
        children: [
          {
            path: '/user/logout',
            element: (
              <AuthGuard>
                <LogoutPage />
              </AuthGuard>
            ),
          },
          {
            path: '/user/account-settings',
            element: (
              <AuthGuard>
                <EagerConnectGuard>
                  <Profile />
                </EagerConnectGuard>
              </AuthGuard>
            ),
          },
        ],
      },
      {
        path: '/token/euler',
        element: <EulerTokenDetail />,
      },
      {
        path: '/nft/new',
        element: <NFTCreate />,
      },
      {
        path: '/nft/post',
        element: <NFTPost />,
      },
      {
        path: '/:network/nft/ad/:address/:tokenId/:identifier',
        element: (
          <CoinDataProvider>
            <NFTBuy />
          </CoinDataProvider>
        ),
      },
    ],
  },
  {
    path: '/authentication',
    children: [
      {
        path: '/authentication/verify-code',
        element: <VerifyCode />,
      },
      {
        path: '/authentication/verify-email',
        element: <VerifyEmail />,
      },
      {
        path: '/authentication/password-reset',
        element: <PasswordReset />,
      },
      {
        path: '/authentication/password-recovery',
        element: <PasswordRecovery />,
      },
      {
        path: '/authentication/registration-delayed',
        element: <DelayedRegistering />,
      },
      {
        path: '/authentication/login',
        element: <LoginPage />,
      },
      {
        path: '/authentication/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/legal',
    children: [
      {
        path: '/legal/terms-and-conditions',
        element: <TermsAndConditionsPage />,
      },
      {
        path: '/legal/privacy-policy',
        element: <PrivacyPolicyPage />,
      },
    ],
  },
  {
    path: '/configure',
    children: [
      {
        path: '/configure/telegram',
        element: <ConfigureTelegram />,
      },
    ],
  },
  {
    path: '*',
    element: <MainLayout />,
    children: [
      {
        path: '401',
        element: <AuthorizationRequired />,
      },
      {
        path: '404',
        element: <NotFound />,
      },
      {
        path: '500',
        element: <ServerError />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
