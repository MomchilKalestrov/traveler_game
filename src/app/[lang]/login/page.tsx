'use client';
import React        from 'react';
import { NextPage } from 'next';

import LogIn  from './login';
import SignUp from './signup';

const Page: NextPage = () => {
    const [ authType, setAuthType ] = React.useState<boolean>(true);

    return (
        authType
        ?   <LogIn  setter={ setAuthType } />
        :   <SignUp setter={ setAuthType } />
    );
};

export default Page;