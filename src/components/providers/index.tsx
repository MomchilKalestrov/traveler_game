'use client';
import React from 'react';
import { Provider }  from 'react-redux';
import store from '@logic/redux/store';
import { useParams } from 'next/navigation';
import LanguageCTX from '@logic/contexts/languageCTX';
import { Language } from '@logic/types';

type ProvidersProps = {
    children?: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
    const params = useParams();
    const [ language, setLanguage ] = React.useState<Language | undefined>(undefined);

    React.useEffect(() => {
        fetch(`/languages/${ params.lang }.json`)
            .then(res => res.json())
            .then(setLanguage);
    }, [ params ]);
    
    return (
        <LanguageCTX.Provider value={ language }>
            <Provider store={ store }>
                { children }
            </Provider>
        </LanguageCTX.Provider>
    )
};

export default Providers;