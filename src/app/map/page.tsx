'use client'
import React from 'react';
import { useMemo } from "react";
import dynamic from "next/dynamic";

import { saveData } from '@logic/fetches';
import { location } from '@logic/types';

import LoadingPlaceholder from '@components/loading';

const Page = () => {
  const [ watcherID,    setWatcherID    ] = React.useState<number>();
  const [ userLocation, setUserLocation ] = React.useState<{ lat: number, lng: number } | undefined>(undefined);
  const [ started,      setStarted      ] = React.useState<location[] | undefined>(undefined);

  const Map = useMemo(() => dynamic(
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

    saveData()
      .then((data) => {
        const [ s, f,  ] = data;
        setStarted(s);
      });
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
