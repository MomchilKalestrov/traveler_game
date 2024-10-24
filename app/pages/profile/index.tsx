'use client';
import React from 'react';
import style from './profile.module.css';
import Image from 'next/image';
import getColors from '@logic/profileColor';
import { user } from '@logic/types';
import { CurrentUserCTX } from '@logic/context';

const Page = (props: { refs: React.Ref<HTMLElement> }) => {
  const user: user | undefined = React.useContext(CurrentUserCTX);

  if (!user)
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

  const [ color, r_color ] = getColors(user.username.slice(0, 3));
  const percentage = user.xp - 100 * Math.round(user.xp / 100);

  return (
    <main ref={ props.refs } style={ { display: 'none' } }>
      <div className={ style.ProfileContainer }>
        <div className={ `${ style.ProfileCard } ${ style.ProfileInfo }` }>
            <div className={ style.ProfilePhoto }>
              <p
                style={ { backgroundColor: color, color: r_color } }
              >{ user.username[0] }</p>
              <div style={ { '--percentage': percentage + '%' } as React.CSSProperties } />
              <p>{ Math.round(user.xp / 100) + 1 }</p>
            </div>
            <h2>{ user.username }</h2>
            <div>
              <p><b>{ user.followers.length }</b> followers</p>
              <p><b>{ user.following.length }</b> following</p>
            </div>
        </div>
        {
          user.finished.length > 0 &&
          <div className={ `${ style.ProfileCard }` }>
            <h2>Badges</h2>
            <div className={ style.ProfileDivider } />
            <div className={ style.ProfileBadges }>
              {
                user.finished.map((data: { location: string, time: number }, key: number) =>
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