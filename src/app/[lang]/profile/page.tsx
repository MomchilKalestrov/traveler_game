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

const getAlignment = (count: number): React.CSSProperties => ({
    justifyContent: count > 3
        ?   'space-between'
        :   count === 2
            ?   'space-around'
            :   'center'
});

const getPercentage = (xp: number): React.CSSProperties => ({
    '--percentage': `${ xp - 100 * Math.floor(xp / 100) }%`
} as React.CSSProperties);

const getPhotoColors = (username: string): React.CSSProperties => {
    const [ foreground, background ] = getColors(username.slice(0, 3));
    return {
        backgroundColor: background,
        color: foreground
    };
};

const getBadgeSVG = (name: string): string =>
    `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ name }.svg`;

const Page: NextPage = () => {
    const language: Language | undefined = React.useContext(LanguageCTX);

    const user: User | undefined = useSelector((state: RootState) => state.user.value);

    const [ profilePicture, setProfilePicture ] = React.useState<any | undefined>(undefined);

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
                caches.open('offlineCacheV10').then(cache => {
                    cache.delete(`/profile/${ user?.username }.png`)
                    cache.keys().then(keys => {
                        keys.forEach(request => {
                            if(request.url.includes(`/profile/${ user?.username }.png`))
                                cache.delete(request);
                        });
                    });
                });
            })
        };

        reader.readAsArrayBuffer(file);
    };

  if (!user || !language) return (<LoadingPlaceholder />);

  return (
    <main>
        <div className={ style.ProfileContainer }>
            <div className={ `${ style.ProfileCard } ${ style.ProfileInfo }` }>
                <div className={ style.ProfilePhoto }>
                    <input type='file' onChange={ loadProfilePicture } accept='.png' />
                {
                    profilePicture
                    ?   <Image
                            alt={ user.username }
                            src={ profilePicture }
                            width={ 64 } height={ 64 }
                        />
                    :   <div style={ getPhotoColors(user.username) }>
                            { user.username[0] }
                        </div>
                }
                    <div style={ getPercentage(user.xp) } />
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
                    <div
                        className={ style.ProfileBadges }
                        style={ getAlignment(user.finished.length) }
                    >
                    {
                        user.finished.map((data: { location: string, time: number }, key: number) =>
                            <Image
                                src={ getBadgeSVG(data.location) }
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