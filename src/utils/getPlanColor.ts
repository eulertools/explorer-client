import { UserSubscriptionType } from 'src/slices/user/account';

export const getPlanColor = (name) => {
  switch (name) {
    case UserSubscriptionType.free:
      return 'linear-gradient(46.19deg, #EA52F8 5.66%, #0066FF 94.35%)';
    case UserSubscriptionType.advanced:
      return '#77dbf3';
    case UserSubscriptionType.enterprise:
      return 'linear-gradient(90deg, #FFCE75 0%, #FFB224 100%)';
    default:
      return 'linear-gradient(46.19deg, #EA52F8 5.66%, #0066FF 94.35%)';
  }
};
