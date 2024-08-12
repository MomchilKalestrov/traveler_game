'use client'
import { AdvancedMarker, APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import React from 'react';
import { useEffect } from 'react';

type Poi = {
  name: string,
  location: google.maps.LatLngLiteral
};


const Page = (props: { refs: React.Ref<HTMLElement> }) => {
  const [finish, setFinish] = React.useState<boolean>(false);
  const [locations, setLocations] = React.useState<Array<Poi>>([]);


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
    }
    getLocs();
  }, []);

  if(!finish) return (<main>Loading...</main>);

  return (
    <main
      ref={ props.refs }
      style={ {
        padding: '0px',
        height: 'calc(100vh - 5rem)',
      } }
    >
      <APIProvider apiKey={ 'AIzaSyBPYpCcdRsOe4Mci-EkrfBKwNAwwLQzTQ0' } onLoad={ () => console.log('Maps API has loaded.') }>
        <Map
          defaultZoom={ 11 }
          mapId={ 'e62456ff6a25971e' }
          defaultCenter={ { lat: 42.143002, lng: 24.749651 } }
        >
          {
            locations.map((loc: Poi) =>
                <AdvancedMarker
                  key={ loc.name }
                  position={ loc.location }
                ></AdvancedMarker>
            )
          }
        </Map>
      </APIProvider>
    </main>
  );
}

export default Page;