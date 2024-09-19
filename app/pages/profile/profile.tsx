'use client';
import React from 'react';
import style from './profile.module.css';
import { loading, stopLoading } from '@components/loading/loading';
import Image from 'next/image';
import ImageAndFallback from '@app/components/imageAndFallback/imageAndFallback';

const Page = (
  props: {
    refs: React.Ref<HTMLElement>
    userData?: any
  }
) => {
  const reference = React.useRef<HTMLImageElement>(null);

  const changeProfilePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    loading();
    const file = event.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) return;

      fetch('/api/auth/profileimage', {
        method: 'POST',
        body: JSON.stringify({ image: event.target?.result })
      }).then((response) => {
        if (!response.ok) return alert('Failed to upload image');
        if (reference.current) reference.current.src = event.target?.result as string;
        stopLoading();
      });
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
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
              <ImageAndFallback
                src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/user/${ props.userData.username }.png` }
                fallback='/default_assets/user.svg'
                ref={ reference } alt='profile picture'
                width={ 64 } height={ 64 }
              />
              <input type="file" accept="image/png" onChange={ changeProfilePhoto } />
            </div>
            <h2>{ props.userData.username }</h2>
            <div>
              <p><b>{ props.userData.followers.length }</b> followers</p>
              <p><b>{ props.userData.following.length }</b> following</p>
            </div>
        </div>
        {
          props.userData.finished.length > 0 &&
          <div className={ `${ style.ProfileCard }` }>
            <h2>Badges</h2>
            <div className={ style.ProfileDivider } />
            <div className={ style.ProfileBadges }>
              {
                props.userData.finished.map((data: string, key: number) =>
                  <ImageAndFallback
                    src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ data }.svg` }
                    fallback='/default_assets/badge.svg'
                    alt={ data } key={ key }
                    width={ 48 } height={ 48 }
                  />
                )
              }
            </div>
          </div>
        }
      </div>
    </main>
  );
}

export default Page;