'use client';
import React from 'react';
import LogIn from './login';
import SignUp from './signup';
import './bg.css';

const Page = () => {
  // true  = login
  // false = register
  const [authType, setAuthType] = React.useState<boolean>(true);

  return (
    authType
    ? <LogIn  setter={ setAuthType } />
    : <SignUp setter={ setAuthType } />
  );
}

export default Page;