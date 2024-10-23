'use client';
import React from 'react';
import style from './profile.module.css';
import Image from 'next/image';
import getColors from '@logic/profileColor';
import { user } from '@logic/types';

const Page = (
  props: {
    refs: React.Ref<HTMLElement>
    user?: user | undefined
  }
) => {
  if (!props.user)
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
      </main>
    );

  const [ color, r_color ] = getColors(props.user.username.slice(0, 3));
  const percentage = props.user.xp - 100 * Math.round(props.user.xp / 100);

  return (
    <main ref={ props.refs } style={ { display: 'none' } }>
      <div className={ style.ProfileContainer }>
        <div className={ `${ style.ProfileCard } ${ style.ProfileInfo }` }>
            <div className={ style.ProfilePhoto }>
              <p
                style={ { backgroundColor: color, color: r_color } }
              >{ props.user.username[0] }</p>
              <div style={ { '--percentage': percentage + '%' } as React.CSSProperties } />
              <p>{ Math.round(props.user.xp / 100) + 1 }</p>
            </div>
            <h2>{ props.user.username }</h2>
            <div>
              <p><b>{ props.user.followers.length }</b> followers</p>
              <p><b>{ props.user.following.length }</b> following</p>
            </div>
        </div>
        {
          props.user.finished.length > 0 &&
          <div className={ `${ style.ProfileCard }` }>
            <h2>Badges</h2>
            <div className={ style.ProfileDivider } />
            <div className={ style.ProfileBadges }>
              {
                props.user.finished.map((data: { location: string, time: number }, key: number) =>
                  <Image
                    src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ data.location }.svg` }
                    alt={ data.location } key={ key } width={ 48 } height={ 48 }
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