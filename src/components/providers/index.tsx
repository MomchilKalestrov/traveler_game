'use client';
import React from 'react';
import { Provider }  from 'react-redux';
import { useParams } from 'next/navigation';

import store from '@logic/redux/store';
import LanguageCTX  from '@logic/contexts/languageCTX';
import { Language } from '@logic/types';
import PageStackProvider from '@logic/pageStackProvider';

type ProvidersProps = {
    children?: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
    const params = useParams<{ lang: string }>();
    const [ language, setLanguage ] = React.useState<Language | undefined>(undefined);

    React.useEffect(() => {
        const language = localStorage.getItem('locale') || params.lang || 'en';
        fetch(`/languages/${ language }.json`)
            .then(res => res.json())
            .then(setLanguage);
    }, [ params ]);
    
    return (
        <LanguageCTX.Provider value={ language }>
            <Provider store={ store }>
                <PageStackProvider>
                    { children }
                 </PageStackProvider>
             </Provider>
         </LanguageCTX.Provider>
    )
};

export default Providers;