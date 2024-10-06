'use client'
import style from './home.module.css';
import Mapcard from '@components/mapcard';
import Minicard from '@components/minicard';
import React from 'react';
import Image from 'next/image';
import MaterialInput from '@components/input';
import Accomplishment from '@components/accomplishment';
import type { location, user, accomplishment } from '@logic/types';
import getActivities from '@logic/followerActivity';

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
  userData: user | undefined,
  newLocations?: Array<location>,
  reset: () => void
}) => {
  const reference = React.useRef<HTMLDivElement>(null);
  const [filteredLocations, setFilteredLocations] = React.useState<Array<location>>(props.newLocations || []);
  const [filterOpen,        setFilterOpen       ] = React.useState(true);
  const [followerActivity,  setFollowerActivity ] = React.useState<Array<accomplishment>>([]);  

  React.useEffect(() => {
    if (!props.userData) return;

    getActivities(props.userData)
      .then((activities) =>
        setFollowerActivity(activities)
      );
  }, [props.userData]);
  
  React.useEffect(() => {
    if (!props.newLocations) return;
    setFilteredLocations(props.newLocations);
  }, [props.newLocations]);
  
  const changeView = () => {
    if (!reference.current) return;
    const state = !filterOpen;
    reference.current.style.paddingTop = state ? '0' : 'var(--padding)';
    reference.current.style.height  = state ? '0' : 'calc(3rem + 1px)';
    setFilterOpen(state);
  }

  if (!props.userData || !props.newLocations)
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

    const inputValue = parseInt(event.currentTarget.value);

    if(isNaN(inputValue) || inputValue <= 0) return setFilteredLocations(props.newLocations);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if(!props.newLocations) return alert('An unknown exception has occured.');
        setFilteredLocations(
          props.newLocations.filter((location: location) =>
            haversineDistance(
              location.location.lat,
              location.location.lng,
              position.coords.latitude,
              position.coords.longitude
            ) <= inputValue
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
        props.userData.started.length === 0
        ? <p>No adventures started.</p>
        : <div className={ style.HorizontalCarousel }><div>
          {
            props.userData.started.map((name: string, index: number) =>
              <Minicard key={ index } name={ name } reset={ props.reset } />
            )
          }
          </div></div>
      }
      <div className={ style.TitleWithSort }>
        <h2>New adventures:</h2>
        <button aria-label='toggle filter menu' onClick={ changeView }>
          <Image alt='filter' src='/icons/filter.svg' width={ 32 } height={ 32 } />
        </button>
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
      
      {
        followerActivity.length > 0 && [
          <h2>Followers&apos; activity:</h2>,
          followerActivity.map((accomplishment: accomplishment, key: number) => 
            <Accomplishment key={ key } accomplishment={ accomplishment } />
          )
        ]
      }
    </main>
  );
}

export default Page;