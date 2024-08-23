'use client';
import React, { useEffect, useState } from 'react';
import style from './profile.module.css';
import { loading, stopLoading } from '@components/loading/loading';
import Image from 'next/image';

const Page = (
  props: {
    refs: React.Ref<HTMLElement>
    userData?: any
  }
) => {
  const reference = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!reference.current || !props.userData) return;

    fetch(`https://gsplsf3le8pssi3n.public.blob.vercel-storage.com/${ props.userData.username }`)
      .then((res) => res.blob())
      .then((blob) => console.log(blob));

  }, [props.userData]);

  const changeProfilePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    loading();
    const file = event.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;

      fetch('/api/auth/profileimage', {
        method: 'POST',
        body: JSON.stringify({ image: e.target?.result })
      }).then(() => {
        if (reference.current) reference.current.src = e.target?.result as string;
        stopLoading();
      });
    };
    reader.onerror = (e) => {
      console.error('Error reading file:', e);
      stopLoading();
    };
    reader.readAsDataURL(file);
  }

  if (!props.userData)
    return (
      <main ref={ props.refs } style={ { display: 'none' } }>
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
      </main>);

  return (
    <main ref={ props.refs } style={ { display: 'none' } }>
      <div className={ style.ProfileContainer }>
        <div className={ `${ style.ProfileCard } ${ style.ProfileInfo }` }>
            <div className={ style.ProfilePhoto }>
              <Image
                ref={ reference }
                src={ `/user/noprofile.svg` }
                alt='profile'
                width={ 64 }
                height={ 64 }
              />
              <input type="file" accept="image/png" onChange={ changeProfilePhoto } />
            </div>
            <h2>{ props.userData.username }</h2>
        </div>
        {
          props.userData.finished.length > 0
          ? <div className={ `${ style.ProfileCard }` }>
              <h2>Badges</h2>
              <div className={ style.ProfileDivider } />
              <div className={ style.ProfileBadges }>
                {
                  props.userData.finished.map((data: string, key: number) =>
                    <Image src={ `/badges/${ data }.svg` } alt={ data } key={ key } width={ 48 } height={ 48 } />
                  )
                }
              </div>
            </div>
          : <></>
        }
      </div>
    </main>
  );
}

export default Page;