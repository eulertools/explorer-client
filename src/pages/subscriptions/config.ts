import { UserSubscriptionType } from 'src/slices/user/account';

interface IsubscriptionConfigItem {
  price: {
    holder: number;
    notHolder: number;
  };
  eulerLimit: string;
}
interface IsubscriptionConfig {
  [key: string]: IsubscriptionConfigItem;
}

export const subscriptionConfig: IsubscriptionConfig = {
  [UserSubscriptionType.free]: {
    price: {
      holder: 0,
      notHolder: 0,
    },
    eulerLimit: '4.000',
  },
  [UserSubscriptionType.advanced]: {
    price: {
      holder: 99.99,
      notHolder: 149.99,
    },
    eulerLimit: '4.000',
  },
};
