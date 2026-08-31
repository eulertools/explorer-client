export const getEnv = () => {
  const hostname = window.location.href;
  return hostname.substring(8, hostname.indexOf('/', 8));
};
