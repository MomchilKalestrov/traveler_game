'use client'
import style from './home.module.css';
import Mapcard from '@/components/mapcard';
import Minicard from '@/components/minicard';
import { useEffect, useState }from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home(props: { refs: React.Ref<HTMLElement> }) {
  const router                  = useRouter();
  const [finished, setFinished] = useState<boolean>(true);
  const [started,  setStarted ] = useState<Array<string>>([]);
  const [newLocs,  setNewLocs ] = useState<Array<string>>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const authResponse = await fetch('/api/auth/get');
        const authData = await authResponse.json();
        if (!authData.username || !authData.password) {
          router.replace('/login');
          return;
        }

        const startedResponse = await fetch('/api/started');
        const startedData = await startedResponse.json();
        setStarted(startedData);

        const finishedResponse = await fetch('/api/finished');
        const finishedData = await finishedResponse.json();

        const locationsResponse = await fetch('/api/locations');
        const locationsData = await locationsResponse.json();
        let locArr: Array<string> = [];

        for(let i: number = 0; i < locationsData.length; i++) 
          if(!startedData.includes(locationsData[i].name) && !finishedData.includes(locationsData[i].name))
            locArr.push(locationsData[i].name);
        setNewLocs(locArr);
          
        setFinished(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, [router]);

  if (finished)
    return (
      <main ref={ props.refs }>
        <div className={ `${ style.LoadingSegment } ${ style.LoadingTitle }` } />
        <div className={ `${ style.LoadingSegment } ${ style.LoadingMini  }` } />
        <div className={ `${ style.LoadingSegment } ${ style.LoadingMini  }` } />
        <div className={ `${ style.LoadingSegment } ${ style.LoadingMini  }` } />
        <div className={ `${ style.LoadingSegment } ${ style.LoadingTitle }` } />
        <div className={ `${ style.LoadingSegment } ${ style.LoadingBig   }` } />
        <div className={ `${ style.LoadingSegment } ${ style.LoadingBig   }` } />
      </main>
    );

  return (
    <main ref={ props.refs }>
      <h2>Started adventures:</h2>
      <div className={ style.HorizontalCarousel }>
        { 
          started.length === 0 || (started.length === 1 && started[0] === '')
          ? <p>No adventures started.</p>
          : started.map((data: string, index: number) => <Minicard key={ index } name={ data } />)
        }
      </div>

      <h2>New adventures:</h2>
      { 
        newLocs.length === 0 || (newLocs.length === 1 && newLocs[0] === '')
        ? <p>No new adventures to start. Check again later.</p>
        : newLocs.map((data: string, index: number) => <Mapcard key={ index } name={ data } />)
      }
    </main>
  );
}