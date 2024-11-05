'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter }   from 'next/navigation';
import { useSelector } from 'react-redux';

import getColors     from '@logic/profileColor';
import { getCookie } from '@logic/cookies';
import { RootState } from '@logic/redux/store';
import { preloadFromSessionStorage } from '@logic/redux/sessionStorage';

import LoadingPlaceholder from '@components/loading';

import style from './profile.module.css';

const Page = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.value);

  React.useEffect(() => {
    if (!getCookie('username')?.value || !getCookie('password')?.value)
      return router.replace('/login');
    preloadFromSessionStorage();
  }, []);

  if (!user) return (<LoadingPlaceholder />);

  const [ color, r_color ] = getColors(user.username.slice(0, 3));
  const percentage = user.xp - 100 * Math.floor(user.xp / 100);

  return (
    <main>
      <div className={ style.ProfileContainer }>
        <div className={ `${ style.ProfileCard } ${ style.ProfileInfo }` }>
            <div className={ style.ProfilePhoto }>
              <p
                style={ { backgroundColor: color, color: r_color } }
              >{ user.username[0] }</p>
              <div style={ { '--percentage': percentage + '%' } as React.CSSProperties } />
              <p>{ Math.floor(user.xp / 100) }</p>
            </div>
            <h2>{ user.username }</h2>
            <div>
              <p><b>{ user.followers.length }</b> followers</p>
              <p><b>{ user.following.length }</b> following</p>
            </div>
        </div>
        {
          user.finished.length > 0 &&
          <div className={ style.ProfileCard }>
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