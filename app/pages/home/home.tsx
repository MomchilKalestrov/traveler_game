'use client'
import style from './home.module.css';
import Mapcard from '@components/mapcard/mapcard';
import Minicard from '@components/minicard/minicard';
import React from 'react';
import Image from 'next/image';

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
    return (
      <main ref={ props.refs }>
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
    <main ref={ props.refs }>
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