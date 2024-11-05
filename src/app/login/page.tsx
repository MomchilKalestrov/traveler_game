'use client';
import React       from 'react';
import { NextPage } from 'next';

import LogIn  from './login';
import SignUp from './signup';

import './bg.css';

const Page: NextPage<void> = () => {
  const [authType, setAuthType] = React.useState<boolean>(true);

  return (
    authType
    ? <LogIn  setter={ setAuthType } />
    : <SignUp setter={ setAuthType } />
  );
};

export default Page;