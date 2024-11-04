'use client'
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Mapcard            from '@components/mapcard';
import Minicard           from '@components/minicard';
import MaterialInput      from '@components/input';
import Accomplishment     from '@components/accomplishment';
import LoadingPlaceholder from '@components/loading';

import { getCookie }                           from '@logic/cookies';
import getActivities                           from '@logic/followerActivity';
import { filterNew, saveData }                 from '@logic/fetches';
import type { location, accomplishment, user } from '@logic/types';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@logic/redux/store';
import { update } from '@logic/redux/userSlice';

import style from './home.module.css';

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

const Page = () => {

  const userSlice = useSelector((state: RootState) => state.user.value);
  const dispatch  = useDispatch();

  const reference = React.useRef<HTMLDivElement>(null);
  const router    = useRouter();

  const [ user,     setUser     ] = React.useState<user | boolean>(false);
  const [ started,  setStarted  ] = React.useState<location[] | undefined>(undefined);
  const [ new_,     setNew      ] = React.useState<location[] | undefined>(undefined);
  const [ filtered, setFiltered ] = React.useState<location[]>(new_ || []);

  const [ filterOpen, setFilterOpen ] = React.useState(true);

  const [ followerActivity, setFollowerActivity ] = React.useState<accomplishment[]>([]);

  React.useEffect(() => {
    if (!getCookie('username')?.value || !getCookie('password')?.value)
      return router.replace('/login');
    
    (async () => {
      const [ s, f, a, u ] = await saveData();
      setStarted(s);
      setNew(filterNew(s, f, a));
      setUser(u);
      dispatch(update(u));
    }).call(null);
  }, []);

  React.useEffect(() => {
    if (!user) return;

    getActivities(user as user)
      .then((activities) =>
        setFollowerActivity(activities)
      );
  }, [user]);
  
  React.useEffect(() => {
    if (!new_) return;
    setFiltered(new_);
  }, [new_]);
  
  const changeView = () => {
    if (!reference.current) return;
    const state = !filterOpen;
    reference.current.style.paddingTop = state ? '0' : 'var(--padding)';
    reference.current.style.height  = state ? '0' : 'calc(3rem + 1px)';
    setFilterOpen(state);
  }

  if (!user || !new_)
    return (<LoadingPlaceholder />);

  const findCloseLocations = (event: React.FormEvent<HTMLInputElement>) => {
    if(!new_ || !event.currentTarget) return;

    const inputValue = parseInt(event.currentTarget.value);

    if(isNaN(inputValue) || inputValue <= 0) return setFiltered(new_);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if(!new_) return alert('An unknown exception has occured.');
        setFiltered(
          new_.filter((location: location) =>
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
    <main className={ style.Home }>
      <h2>Started adventures:</h2>
      { 
        !started || started.length === 0
        ? <p>No adventures started.</p>
        : <div className={ style.HorizontalCarousel }><div>
          {
            started.map((location: location, key: number) =>
              <Minicard key={ key } location={ location } />
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
        filtered.length === 0
        ? <p>No new adventures to start. Check again later.</p>
        : filtered.map((
            location: location,
            index: number
          ) => <Mapcard key={ index } location={ location } />)
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