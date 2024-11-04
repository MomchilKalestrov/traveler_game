'use client'
import React from 'react';
import dynamic from 'next/dynamic';

import { useDispatch, useSelector }  from 'react-redux';
import { RootState }                 from '@logic/redux/store';
import { preloadFromSessionStorage } from '@logic/redux/sessionStorage';

import LoadingPlaceholder from '@components/loading';

const Page = () => {
  const dispatch = useDispatch();
  const [ watcherID,    setWatcherID    ] = React.useState<number>();
  const [ userLocation, setUserLocation ] = React.useState<{ lat: number, lng: number } | undefined>(undefined);
  const started = useSelector((state: RootState) => state.started.value);

  const Map = React.useMemo(() => dynamic(
    () => import('./map'), {
      loading: () => <LoadingPlaceholder />,
      ssr: false
    }
  ), [])

  React.useEffect(() => {
    try {
      if (navigator.geolocation) {
        const id = navigator.geolocation.watchPosition((position) =>
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }),
          (error) => console.log('Error getting user location: \n', error),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
        setWatcherID(id);
      } else alert('Geolocation is not supported by this browser.');
    } catch {
      alert('Geolocation is not supported by this browser.')
    };

    preloadFromSessionStorage(dispatch);
  }, []);

  return (
    <main
      style={ {
        padding: '0px',
        height: 'calc(100vh - 5rem)',
      } }
    ><Map userLocation={ userLocation } locations={ started } /></main>
  );
};

export default Page;
