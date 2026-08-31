import { useContext } from 'react';
import CoinDataContext from 'src/contexts/CoinDataContext';

const useCoinData = () => useContext(CoinDataContext);

export default useCoinData;
