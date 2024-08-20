'use client'
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import React, { useRef } from 'react';
import { useEffect } from 'react';
import InfoCard, { cardType } from '@components/infocard/infocard';

type location = {
  name: string,
  location: {
    lat: number,
    lng: number
  }
};

const Page = (
  props: {
    refs: React.Ref<HTMLElement>,
    startedLocations?: Array<location>,
    reset: () => void
  }
) => {
  const [name,         setName        ] = React.useState<string>();
  const [visible,      setVisible     ] = React.useState<boolean>(false);
  const [userLocation, setUserLocation] = React.useState<google.maps.LatLngLiteral | null>(null);
  const directionsSet = useRef(false);

  useEffect(() => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
          },
          (error) => console.error('Error getting user location: \n', error),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );


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
    return (<main ref={ props.refs } style={ { display: 'none' } }>Loading...</main>);

 // AIzaSyBPYpCcdRsOe4Mci-EkrfBKwNAwwLQzTQ0
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
      <APIProvider apiKey={ '' } onLoad={ () => console.log('Maps API has loaded.') }>
        <Map
          id='map'
          defaultZoom={ 11 }
          mapId={ 'e62456ff6a25971e' }
          defaultCenter={ { lat: 42.143002, lng: 24.749651 } }
        >
          {
            userLocation &&
            <AdvancedMarker position={ userLocation }>
              <img
                src='/userpin.svg'
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
                <img
                  src='/poipin.svg'
                  alt='location'
                  width={ 48 }
                  height={ 48 }
                />
              </AdvancedMarker>
            )
          }
        </Map>
      </APIProvider>
    </main>
  );
};

export default Page;