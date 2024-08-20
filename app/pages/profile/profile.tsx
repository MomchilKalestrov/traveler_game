'use client';
import React from 'react';
import style from './profile.module.css';
import { loading, stopLoading } from '@components/loading/loading';

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
    reader.onload = (e) => {
      if (!e.target?.result) return;

      fetch('/api/auth/setimage', {
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
    return (<main ref={ props.refs } style={ { display: 'none' } }>Loading...</main>);

  return (
    <main ref={ props.refs } style={ { display: 'none' } }>
      <div className={ style.ProfileContainer }>
        <div className={ `${ style.ProfileCard } ${ style.ProfileInfo }` }>
            <div className={ style.ProfilePhoto }>
              <img ref={ reference } src={ `/user/${ props.userData.username }.png` } />
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
                    <img src={ `/badges/${ data }.svg` } alt={ data } key={ key } />
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