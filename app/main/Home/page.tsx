'use client'
import styles from 'home.module.css';
import Mapcard from '@/components/mapcard';
import Minicard from '@/components/minicard';
import { useEffect, useState }from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router                  = useRouter();
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

        setNewLocs(locationsData.filter((data: any) =>
          !startedData.includes(data.name) &&
          !finishedData.includes(data.name)
        ));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, [router]);

  return (
    <>
      <h2>Selected locations:</h2>
      { 
        started.map((data: string, index: number) =>
          data.length > 0
          ? <Minicard key={index} name={ data } />
          : ''
        )
      }
      <h2>New locations:</h2>
      { 
        newLocs.map((data: any, index: number) =>
          data.length > 0
          ? <Mapcard key={index} name={ data } />
          : ''
        )
      }
    </>
  );
}