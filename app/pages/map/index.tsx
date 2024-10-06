'use client'
import React from 'react';
import InfoCard, { cardType } from '@components/infocard';
import Image from 'next/image';
import type { location } from '@logic/types';
import dynamic from "next/dynamic";
import { useMemo } from "react";

const Page = (
  props: {
    refs: React.Ref<HTMLElement>,
    startedLocations?: Array<location>,
    reset: () => void
  }
) => {
  const [watcherID,    setWatcherID   ] = React.useState<number>();
  const [name,         setName        ] = React.useState<string>();
  const [visible,      setVisible     ] = React.useState<boolean>(false);
  const [userLocation, setUserLocation] = React.useState<google.maps.LatLngLiteral | null>(null);

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
          (error) => console.error('Error getting user location: \n', error),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
        setWatcherID(id);
      } else alert('Geolocation is not supported by this browser.');
    } catch {
      alert('Geolocation is not supported by this browser.')
    };
  }, []);

  const view = (name: string) => {
    setName(name);
    setVisible(true);
  };

  if (!props.startedLocations)
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
    ><Map posix={[4.79029, -75.69003]} reset={ props.reset } locations={ props.startedLocations } /></main>
  );
};

export default Page;
