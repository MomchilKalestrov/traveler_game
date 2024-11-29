'use client';
import React from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { NextPage }    from 'next';

import Mapcard            from '@components/mapcard';
import Minicard           from '@components/minicard';
import MaterialInput      from '@components/input';
import AccomplishmentTag  from '@components/accomplishment';
import LoadingPlaceholder from '@components/loading';

import getActivities from '@logic/followerActivity';
import LanguageCTX   from '@logic/contexts/languageCTX';
import {
  Location,
  Accomplishment,
  User,
  Language
} from '@logic/types';

import { RootState }   from '@logic/redux/store';
import { preloadFromSessionStorage } from '@logic/redux/sessionStorage';

import style from './home.module.css';

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRadians = (degree: number) => degree * (Math.PI / 180);

  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


const Page: NextPage = () => {
  const language: Language | undefined = React.useContext(LanguageCTX);

  const reference = React.useRef<HTMLDivElement>(null);
 
  const userSlice    = useSelector((state: RootState) => state.user.value);
  const newSlice     = useSelector((state: RootState) => state.new.value);
  const startedSlice = useSelector((state: RootState) => state.started.value);
  
  const [ filtered,   setFiltered   ] = React.useState<Location[]>(newSlice || []);
  const [ filterOpen, setFilterOpen ] = React.useState(true);
  const [ followerActivity, setFollowerActivity ] = React.useState<Accomplishment[]>([]);

  React.useEffect(() => {    
    preloadFromSessionStorage();
  }, []);

  React.useEffect(() => {
    if (!userSlice) return;

    getActivities(userSlice as User).then(setFollowerActivity);
  }, [userSlice]);
  
  React.useEffect(() => {
    if (!newSlice) return;
    setFiltered(newSlice);
  }, [newSlice]);
  
  const changeView = () => {
    if (!reference.current) return;
    const state = !filterOpen;
    reference.current.style.paddingTop = state ? '0' : 'var(--padding)';
    reference.current.style.height  = state ? '0' : 'calc(3rem + 1px)';
    setFilterOpen(state);
  };

  if (!userSlice || !newSlice || !language) return (<LoadingPlaceholder />);

  const findCloseLocations = (event: React.FormEvent<HTMLInputElement>) => {
    if(!newSlice || !event.currentTarget) return;

    const inputValue = parseInt(event.currentTarget.value);

    if(isNaN(inputValue) || inputValue <= 0) return setFiltered(newSlice);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if(!newSlice) return alert('An unknown exception has occured.');
        setFiltered(
          newSlice.filter((location: Location) =>
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
  };

  return (
    <main className={ style.Home }>
      <h2>{ language.home.titles.started }</h2>
      { 
        !startedSlice || startedSlice.length === 0
        ? <p>{ language.home.alts.started }</p>
        : <div className={ style.HorizontalCarousel }><div>
          {
            startedSlice.map((location: Location, key: number) =>
              <Minicard key={ key } location={ location } />
            )
          }
          </div></div>
      }
      <div className={ style.TitleWithSort }>
        <h2>{ language.home.titles.new }</h2>
        <button aria-label='toggle filter menu' onClick={ changeView }>
          <Image alt='filter' src='/icons/filter.svg' width={ 32 } height={ 32 } />
        </button>
        <div ref={ reference }>
          <MaterialInput type='number' name='km' onChange={ findCloseLocations } />
        </div>
      </div>
      { 
        filtered.length === 0
        ? <p>{ language.home.alts.new }</p>
        : filtered.map((
            location: Location,
            index: number
          ) => <Mapcard key={ index } location={ location } />)
      }
      {
        followerActivity.length > 0 && [
          <h2>{ language.home.titles.activity }</h2>,
          followerActivity.map((accomplishment: Accomplishment, key: number) => 
            <AccomplishmentTag key={ key } accomplishment={ accomplishment } />
          )
        ]
      }
    </main>
  );
};

export default Page;