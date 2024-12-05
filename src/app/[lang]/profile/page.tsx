'use client';
import React from 'react';
import Image from 'next/image';
import { NextPage }    from 'next';
import { useSelector } from 'react-redux';

import LoadingPlaceholder from '@components/loading';

import getColors     from '@logic/profileColor';
import LanguageCTX   from '@logic/contexts/languageCTX';
import { RootState } from '@logic/redux/store';
import { Language, User } from '@logic/types';
import { preloadFromSessionStorage } from '@logic/redux/sessionStorage';

import style from './profile.module.css';

const Page: NextPage = () => {
  const language: Language | undefined = React.useContext(LanguageCTX);

  const user: User | undefined = useSelector((state: RootState) => state.user.value);
  const [ profilePicture, setProfilePicture ] = React.useState<any | undefined>(undefined);

  React.useEffect(() => { preloadFromSessionStorage(); }, []);

  React.useEffect(() => {
    if (!user) return;
    fetch(process.env.NEXT_PUBLIC_BLOB_STORAGE_URL + '/profile/' + user.username + '.png')
      .then(response => response.blob())
      .then(blob => setProfilePicture(URL.createObjectURL(blob)));
  }, [ user ]);

  const loadProfilePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      if(!reader.result) return;
      
      const blob = new Blob([ reader.result ], { type: file.type });
      
      fetch('/api/auth/changepfp', {
        method: 'POST',
        body: blob,
        headers: {
          'Content-Type': file.type,
          'Content-Disposition': `attachment; filename="${ file.name }"`
        }
      }).then(res => {
        if(!res.ok) return console.error('Couldn\'t upload the image.');
        setProfilePicture(URL.createObjectURL(blob));
      })
    };

    reader.readAsArrayBuffer(file);
  };

  if (!user || !language) return (<LoadingPlaceholder />);

  const [ color, r_color ] = getColors(user.username.slice(0, 3));
  const percentage = user.xp - 100 * Math.floor(user.xp / 100);

  return (
    <main>
      <div className={ style.ProfileContainer }>
        <div className={ `${ style.ProfileCard } ${ style.ProfileInfo }` }>
            <div className={ style.ProfilePhoto }>
              <input type='file' onChange={ loadProfilePicture } accept='.png' />
            {
              profilePicture
              ? <Image alt={ user.username } src={ profilePicture } width={ 64 } height={ 64 } />
              : <div style={ { backgroundColor: color, color: r_color } }>{ user.username[0] }</div>
            }
              <div style={ { '--percentage': percentage + '%' } as React.CSSProperties } />
              <p>{ Math.floor(user.xp / 100) }</p>
            </div>
            <h2>{ user.username }</h2>
            <div>
              <p><b>{ user.followers.length }</b> { language.profile.followers }</p>
              <p><b>{ user.following.length }</b> { language.profile.following }</p>
            </div>
        </div>
        {
          user.finished.length > 0 &&
          <div className={ style.ProfileCard }>
            <h2>{ language.profile.badges }</h2>
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
};

export default Page;