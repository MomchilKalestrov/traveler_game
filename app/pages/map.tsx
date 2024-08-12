'use client'
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import React from 'react';
import { useEffect } from 'react';

type Poi = {
  name: string,
  location: google.maps.LatLngLiteral
};


const Page = (props: { refs: React.Ref<HTMLElement> }) => {
  const [finish, setFinish] = React.useState<boolean>(false);
  const [locations, setLocations] = React.useState<Array<Poi>>([]);
  const [userLocation, setUserLocation] = React.useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    const getLocs = async () => {
      const userPOIs = await (await fetch('/api/started')).json();
      const response = await fetch('/api/locations');
      let allPOIs = (await response.json()).map((place: any) => ({
        name: place.name,
        location: {
          lat: Number(place.location.lat['$numberDecimal']),
          lng: Number(place.location.lng['$numberDecimal'])
        }
      }));
      setLocations(allPOIs.filter((poi: Poi) => userPOIs.includes(poi.name)));
      setFinish(true);
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
          }),
          (error) => console.error('Error getting user location:', error),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
      } else console.error('Geolocation is not supported by this browser.');
    };

    getLocs();
    getUserLocation();
  }, []);

  if(!finish) return (<main ref={ props.refs } style={ { display: 'none' } }>Loading...</main>);

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('User location:', position.coords);
    });
  }

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
      <APIProvider apiKey={ '' } onLoad={ () => console.log('Maps API has loaded.') }>
        <Map
          defaultZoom={ 11 }
          mapId={ 'e62456ff6a25971e' }
          defaultCenter={ { lat: 42.143002, lng: 24.749651 } }
        >
          {
            userLocation &&
            <AdvancedMarker position={ userLocation }>
              <img src='/userpin.svg' alt='user' width={ 32 } height={ 32 } />
            </AdvancedMarker>
            }
          {
            locations.map((loc: Poi) =>
              <AdvancedMarker
                key={ loc.name }
                position={ loc.location }
              >
                <img src='/poipin.svg' alt='location' width={ 48 } height={ 48 } />
              </AdvancedMarker>
            )
          }
        </Map>
      </APIProvider>
    </main>
  );
};

export default Page;