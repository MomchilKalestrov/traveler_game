'use client';
import React from 'react';
import { Provider }  from 'react-redux';
import store from '@logic/redux/store';


type ProvidersProps = {
    children: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => (
    <Provider store={ store }>
        { children }
    </Provider>
);

export default Providers;