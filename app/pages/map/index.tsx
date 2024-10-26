'use client'
import React from 'react';
import Image from 'next/image';
import type { location } from '@logic/types';
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { StartedLocationsCTX } from '@logic/context';

const Page = (props: { refs: React.Ref<HTMLElement> }) => {
  const [watcherID,    setWatcherID   ] = React.useState<number>();
  const [userLocation, setUserLocation] = React.useState<{ lat: number, lng: number } | undefined>(undefined);
  const startedLocationsCTX = React.useContext(StartedLocationsCTX);
  const started = startedLocationsCTX?.locations;

  const Map = useMemo(() => dynamic(
    () => import('./map'), {
      loading: () => <p>A map is loading</p>,
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
  }, []);

  if (!started)
    return (
      <main ref={ props.refs } style={ { display: 'none' } }>
        <Image
          src='/icons/loading.svg'
          alt='Loading'
          width={ 64 }
          height={ 64 }
          style={ {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          } }
        />
      </main>
    );

  return (
    <main
      ref={ props.refs }
      style={ {
        padding: '0px',
        height: 'calc(100vh - 5rem)',
        display: 'none'
      } }
    ><Map userLocation={ userLocation } locations={ started } /></main>
  );
};

export default Page;
