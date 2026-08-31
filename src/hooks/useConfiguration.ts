import { useContext } from 'react';
import ConfigurationContext from '../contexts/ConfigurationContext';
import type { IConfigurationContextValue } from '../contexts/ConfigurationContext';

export const useConfiguration = (): IConfigurationContextValue => useContext(ConfigurationContext);
