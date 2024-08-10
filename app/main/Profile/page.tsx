'use client';
import { useState } from 'react';
import LogIn from './login';
import SignUp from './signup';

export default function Profile() {
  // true  = login
  // false = register
  const [authType, setAuthType] = useState<boolean>(false);
  let cookies;

  if (cookies)
    return (
      <></>
    );
  else if (authType) return (<LogIn  setter={ setAuthType } />);
  else               return (<SignUp setter={ setAuthType } />);
}
