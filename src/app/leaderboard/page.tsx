'use client';
import React from 'react';
import Image from 'next/image';
import { NextPage }  from 'next';
import { useRouter } from 'next/navigation';

import LoadingPlaceholder from '@components/loading';

import { getCookie } from '@logic/cookies';
import { User }      from '@logic/types';
import getColors     from '@logic/profileColor';
import { preloadFromSessionStorage } from '@logic/redux/sessionStorage';

import userStyle from '@app/profile/profile.module.css';
import style     from './leaderboard.module.css';

type PlayerProps = {
  user: User;
  position: number;
};

const Player: React.FC<PlayerProps> = ({ user, position }) => {
  const router = useRouter();
  const [ color, r_color ] = getColors(user.username.slice(0, 3));
  const percentage = user.xp - 100 * Math.floor (user.xp / 100);

  React.useEffect(() => {
    if (!getCookie('username')?.value || !getCookie('password')?.value)
      router.replace('/login');
  }, []);

  return (
    <div className={ `${ userStyle.ProfileCard } ${ userStyle.ProfileInfo }` }>
        <div className={ userStyle.ProfilePhoto }>
          <p
            style={ { backgroundColor: color, color: r_color } }
          >{ user.username[0] }</p>
          <div style={ { '--percentage': percentage + '%' } as React.CSSProperties } />
          <p>{ Math.floor(user.xp / 100) }</p>
        </div>
        <h2>{ user.username }</h2>
        {
          position < 3
          ? <Image
              src={ `/icons/crowns/crown${ position }.svg` }
              alt='Crown' width={ 48 } height={ 48 }
              className={ style.Top100Position }
            />
          : <h3 className={ style.Top100Position }># { position + 1 }</h3>
        }
        <div>
          <p><b>{ user.followers.length }</b> followers</p>
          <p><b>{ user.following.length }</b> following</p>
        </div>
    </div>
  );
};

const Page: NextPage = () => {
  const router = useRouter();
  const [ players, setPlayers ] = React.useState<User[] | undefined>(undefined);

  // top 100 players are used only here, so it's not necessary to store them in the redux store
  React.useEffect(() => {
    if (!getCookie('username')?.value || !getCookie('password')?.value)
      return router.replace('/login');
    
    if (sessionStorage.getItem('top100'))
      return setPlayers(JSON.parse(sessionStorage.getItem('top100') as string));
    
    
    fetch('/api/top100')
    .then(res => res.ok ? res.json() : undefined)
    .then(data => {
      if(data) {
        sessionStorage.setItem('top100', JSON.stringify(data));
        setPlayers(data);
      }
      else console.error('An error has occured.');
    });

    preloadFromSessionStorage();
  }, []);

  if (!players) return (<LoadingPlaceholder />);

  return (
    <main>
      <div className={ style.Top100Container }>
        <h1>Top { players.length }</h1>
        {
          players.map((player, index) =>
            <Player user={ player } key={ index } position={ index } />
          )
        }
      </div>
    </main>
  );
};

export default Page;
