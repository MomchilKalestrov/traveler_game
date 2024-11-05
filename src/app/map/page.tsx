'use client'
import React   from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { NextPage }  from 'next';

import { useDispatch, useSelector }  from 'react-redux';
import { preloadFromSessionStorage } from '@logic/redux/sessionStorage';
import { RootState }                 from '@logic/redux/store';
import { getCookie }                 from '@logic/cookies';

import LoadingPlaceholder from '@components/loading';

const Page: NextPage = () => {
  const router   = useRouter();
  const started  = useSelector((state: RootState) => state.started.value);

  const Map = React.useMemo(() => dynamic(
    () => import('./map'), {
      loading: () => <LoadingPlaceholder />,
      ssr: false
    }
  ), [])

  React.useEffect(() => {
    if (!getCookie('username')?.value || !getCookie('password')?.value)
      return router.replace('/login');
    preloadFromSessionStorage();
  }, []);

  return (
    <main
      style={ {
        padding: '0px',
        height: 'calc(100vh - 5rem)',
      } }
    ><Map locations={ started } /></main>
  );
};

export default Page;
