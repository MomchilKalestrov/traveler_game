'use client'
import React   from 'react';
import dynamic from 'next/dynamic';
import { NextPage }    from 'next';
import { useSelector } from 'react-redux';

import { preloadFromSessionStorage } from '@logic/redux/sessionStorage';
import { RootState } from '@logic/redux/store';

import LoadingPlaceholder from '@components/loading';
import LocationRequest    from '@components/locationRequest';

const Page: NextPage = () => {
  const started  = useSelector((state: RootState) => state.started.value);
  const [ allowGPS, setPermission ] = React.useState<boolean>(true);
  const [ request,  setRequest    ] = React.useState<boolean>(false);

  const Map = React.useMemo(() => dynamic(
    () => import('./map'), {
      loading: () => (<LoadingPlaceholder />),
      ssr: false
    }
  ), [])

  React.useEffect(() => {
    preloadFromSessionStorage()

    navigator.permissions.query({ name: 'geolocation' })
      .then((permission) =>
        setRequest(permission.state !== 'granted')
      );
  }, []);

  const setRequestPermission = (hasGPSAccess: boolean): void => {
    setRequest(false);
    setPermission(hasGPSAccess);
  }

  return (
    <main style={ { padding: '0px', height: 'calc(100vh - 5rem)' } }>
      { request && <LocationRequest setPermission={ setRequestPermission } /> }
      <Map locations={ started } hasGPSAccess={ allowGPS } />
      </main>
  );
};

export default Page;
