'use client'
import styles from 'home.module.css';
import Mapcard from '@/components/mapcard';
import Minicard from '@/components/minicard';
import { useEffect, useState }from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [unfinished, setUnfinished] = useState<Array<string>>([]);
  const [newLocs,    setNewLocs   ] = useState<Array<string>>([]);

  useEffect(() => {
    fetch('/api/unfinished')
      .then((response) => response.json()    )
      .then((data)     => setUnfinished(data));

    fetch('/api/locations' )
      .then((response) => response.json()  )
      .then((data)     => setNewLocs(data) );

    fetch('/api/auth/get').then((response) => {
      response.json().then((data: any) => {
        if(!data.username || !data.password)
          router.replace('/login');
      });
    });
  }, []);

  return (
    <>
      <h2>Selected locations:</h2>
      { unfinished.map((data: any, index: number) => <Minicard key={index} name={ data.name } />) }
      <h2>New locations:</h2>
      { newLocs.map((data: any, index: number) => <Mapcard key={index} name={ data.name } />) }
    </>
  );
}