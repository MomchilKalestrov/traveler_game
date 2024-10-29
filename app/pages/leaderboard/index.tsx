import React from 'react';
import Image from 'next/image';
import { user } from '@logic/types';
import getColors from '@logic/profileColor';
import userStyle from '@pages/profile/profile.module.css';
import style from './leaderboard.module.css';

const Player = (props: { user: user, position: number }) => {
  const [ color, r_color ] = getColors(props.user.username.slice(0, 3));
  const percentage = props.user.xp - 100 * Math.floor (props.user.xp / 100);

  return (
    <div className={ `${ userStyle.ProfileCard } ${ userStyle.ProfileInfo }` }>
        <div className={ userStyle.ProfilePhoto }>
          <p
            style={ { backgroundColor: color, color: r_color } }
          >{ props.user.username[0] }</p>
          <div style={ { '--percentage': percentage + '%' } as React.CSSProperties } />
          <p>{ Math.floor(props.user.xp / 100) }</p>
        </div>
        <h2>{ props.user.username }</h2>
        {
          props.position < 3
          ? <Image
              src={ `/icons/crowns/crown${ props.position }.svg` }
              alt='Crown' width={ 48 } height={ 48 }
              className={ style.Top100Position }
            />
          : <h3 className={ style.Top100Position }># { props.position + 1 }</h3>
        }
        <div>
          <p><b>{ props.user.followers.length }</b> followers</p>
          <p><b>{ props.user.following.length }</b> following</p>
        </div>
    </div>
  );
}

const LeaderBoard = (
    props: {
        refs: React.RefObject<HTMLElement>
    }
) => {
  const [ players, setPlayers ] = React.useState<Array<user> | undefined>(undefined);

  React.useEffect(() => {
    fetch('/api/top100')
      .then(res => res.ok ? res.json() : undefined)
      .then(data => {
        if(data) setPlayers(data);
        else console.error('An error has occured.');
      });
  }, []);

  if (!players)
    return (
      <main ref={ props.refs } style={ { display: 'none' } }>
        <Image src='/icons/loading.svg' alt='Loading' width={ 64 } height={ 64 }
          style={ {
            position: 'absolute',
            top: '50%',
            left: '50%',
             transform: 'translate(-50%, -50%)'
          } }
        />
      </main>
    );

  return (
    <main ref={ props.refs } style={ { display: 'none' } }>
      <div className={ style.Top100Container }>
        <h1>Top { players.length }</h1>
        {
          players.map((player, index) =>
            <Player user={ player } key={ index } position={ index } />
          )
        }
      </div>
    </main>
  )
}

export default LeaderBoard;
