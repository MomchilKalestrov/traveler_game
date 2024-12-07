import React from 'react';
import { Language } from '@logic/types';

const LanguageCTX = React.createContext<Language | undefined>(undefined);

export default LanguageCTX;