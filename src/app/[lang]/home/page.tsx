'use client';
import React from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { NextPage }    from 'next';

import Mapcard            from '@components/mapcard';
import Minicard           from '@components/minicard';
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

const MAX_PAGES = Number(process.env.NEXT_PUBLIC_MAX_LOCATIONS || 6);

const Page: NextPage = () => {
  const language: Language | undefined = React.useContext(LanguageCTX);
 
  const userSlice    = useSelector((state: RootState) => state.user.value);
  const newSlice     = useSelector((state: RootState) => state.new.value);
  const startedSlice = useSelector((state: RootState) => state.started.value);
  
  const [ followerActivity, setFollowerActivity ] = React.useState<Accomplishment[]>([]);

  React.useEffect(() => {    
    preloadFromSessionStorage();
  }, []);

  React.useEffect(() => {
    if (!userSlice) return;
    getActivities(userSlice as User).then(setFollowerActivity);
  }, [userSlice]);

  if (!userSlice || !newSlice || !startedSlice || !language) return (<LoadingPlaceholder />);

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
      <h2>{ language.home.titles.new }</h2>
      { 
        newSlice.length === 0
        ? <p>{ language.home.alts.new }</p>
        : (newSlice.slice(0, MAX_PAGES - startedSlice.length)).map((
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