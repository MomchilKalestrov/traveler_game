'use client'
import style from './home.module.css';
import Mapcard from '@components/mapcard/mapcard';
import Minicard from '@components/minicard/minicard';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import MaterialInput from '@components/input/input';

type location = {
  name: string,
  location: {
    lat: number,
    lng: number
  }
};

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRadians = (degree: number) => degree * (Math.PI / 180);
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Page = (props: {
  refs: React.Ref<HTMLElement>,
  startedLocations?: Array<location>,
  newLocations?: Array<location>,
  reset: () => void
}) => {
  const reference = React.useRef<HTMLDivElement>(null);
  const [filteredLocations, setFilteredLocations] = React.useState<Array<location>>(props.newLocations || []);
  const [filterOpen,        setFilterOpen       ] = React.useState(false);
  
  useEffect(() => {
    if (!props.newLocations) return;
    setFilteredLocations(props.newLocations);
  }, [props.newLocations]);
  
  const changeView = () => {
    if (!reference.current) return;
    const state = !filterOpen;
    reference.current.style.padding = state ? '0 var(--padding)' : 'var(--padding)';
    reference.current.style.height  = state ? '0' : 'calc(3rem + 1px)';
    setFilterOpen(state);
  }

  if (!props.startedLocations || !props.newLocations)
    return (
      <main ref={ props.refs }>
        <Image src='/icons/loading.svg' alt='Loading' width={ 64 } height={ 64 }
          style={ {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          } }
        />
      </main>
    );

  const findCloseLocations = (event: React.FormEvent<HTMLInputElement>) => {
    if(!props.newLocations || !event.currentTarget) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('aaa',position);
        if(!props.newLocations || !event.currentTarget) return;
        alert(haversineDistance(
          props.newLocations[0].location.lat,
          props.newLocations[0].location.lng,
          position.coords.latitude,
          position.coords.longitude
        ));
      },
      (error) => alert('Error getting user location: \n' + error.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  }

  return (
    <main ref={ props.refs } className={ style.Home }>
      <h2>Started adventures:</h2>
      { 
        props.startedLocations.length === 0
        ? <p>No adventures started.</p>
        : <div className={ style.HorizontalCarousel }>
          {
            props.startedLocations.map((
              location: location,
              index: number
            ) => <Minicard key={ index } name={ location.name } reset={ props.reset } />)
          }
          </div>
      }

      <div className={ style.TitleWithSort }>
        <h2>New adventures:</h2>
        <button aria-label='open filter menu' onClick={ changeView }><Image alt='filter' src='/icons/filter.svg' width={ 32 } height={ 32 } /></button>
        <div ref={ reference }>
          <MaterialInput type='number' name='Distance (km)' onChange={ findCloseLocations } />
        </div>
      </div>
      { 
        filteredLocations.length === 0
        ? <p>No new adventures to start. Check again later.</p>
        : filteredLocations.map((
            location: location,
            index: number
          ) => <Mapcard key={ index } name={ location.name } reset={ props.reset } />)
      }
    </main>
  );
}

export default Page;