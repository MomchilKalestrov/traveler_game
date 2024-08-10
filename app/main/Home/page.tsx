'use client'
import styles from 'home.module.css';
import Mapcard from '@/components/mapcard';
import { useEffect, useState }from 'react';
import React from 'react';

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<string>>([]);

  useEffect(() => {
    fetch(
      '/api/locations'
    ).then((response) => {
      setLoading(true);
      response.json().then((data) => {
        setData(data);
        setLoading(false);
      });
    });
  }, []);

  return (
    <>
      { data.map((data: any, index: number) => <Mapcard key={index} name={ data.name } />) }
      {loading && <p style={ { margin: '0px', textAlign: 'center' } }>Loading.</p>}
    </>
  );
}