import { createContext } from 'react';
import { Language } from '@logic/types';

const LanguageCTX = createContext<Language | undefined>(undefined);

export default LanguageCTX;