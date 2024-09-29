'use client'
import { AdvancedMarker, APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import React from 'react';
import InfoCard, { cardType } from '@components/infocard/infocard';
import Image from 'next/image';
import type { location } from '@logic/types';

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
  // someday I'll use this hook, but not today...
  //const map = useMap('google-api-map');

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
    >
      {
        visible &&
        <InfoCard
          setter={ setVisible }
          name={ name || '' }
          type={ cardType.Finish }
          reset={ props.reset }
        />
      }
      <APIProvider apiKey={ process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '' } onLoad={ () => console.log('Maps API has loaded.') }>
        <Map
          id='google-api-map'
          defaultZoom={ 11 }
          mapId={ 'e62456ff6a25971e' }
          defaultCenter={ { lat: 42.143002, lng: 24.749651 } }
          zoomControl={ false }
          mapTypeControl={ false }
          scaleControl={ false }
          streetViewControl={ false }
          rotateControl={ false }
          fullscreenControl={ false }
          keyboardShortcuts={ false }
        >
          {
            userLocation &&
            <AdvancedMarker position={ userLocation }>
              <Image
                src='/icons/userpin.svg'
                alt='user'
                width={ 32 }
                height={ 32 }
              />
            </AdvancedMarker>
          }
          {
            props.startedLocations.map((loc: location) =>
              <AdvancedMarker
                key={ loc.name }
                position={ loc.location }
                onClick={ () => view(loc.name) }
              >
                <Image
                  src='/icons/poipin.svg'
                  alt='location'
                  width={ 48 }
                  height={ 48 }
                />
              </AdvancedMarker>
            )
          }
        </Map>
      </APIProvider>
      <style jsx global>{`
        .gmnoprint, .gm-style-cc {
          display: none;
        }
      `}</style>
    </main>
  );
};

export default Page;
