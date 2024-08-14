'use client'
import style from './home.module.css';
import Mapcard from '@/app/components/mapcard';
import Minicard from '@/app/components/minicard';
import React from 'react';

type location = {
  name: string,
  location: {
    lat: number,
    lng: number
  }
};

const Page = (props: {
  refs: React.Ref<HTMLElement>,
  startedLocations?: Array<location>,
  newLocations?: Array<location>,
  reset: () => void
}) => {
  if (!props.startedLocations || !props.newLocations)
    return (<main ref={ props.refs }>Loading...</main>);

  return (
    <main ref={ props.refs }>
      <h2>Started adventures:</h2>
      <div className={ style.HorizontalCarousel }>
        { 
          props.startedLocations.length === 0
          ? <p>No adventures started.</p>
          : props.startedLocations.map((
              location: location,
              index: number
            ) => <Minicard key={ index } name={ location.name } reset={ props.reset } />)
        }
      </div>

      <h2>New adventures:</h2>
      { 
        props.newLocations.length === 0
        ? <p>No new adventures to start. Check again later.</p>
        : props.newLocations.map((
            location: location,
            index: number
          ) => <Mapcard key={ index } name={ location.name } reset={ props.reset } />)
      }
    </main>
  );
}

export default Page;