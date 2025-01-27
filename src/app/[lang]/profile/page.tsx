'use client';
import React from 'react';
import Image from 'next/image';
import { NextPage }    from 'next';
import { useSelector } from 'react-redux';

import LoadingPlaceholder from '@components/loading';

import LanguageCTX   from '@logic/contexts/languageCTX';
import getCSSColors  from '@logic/profileColor';
import { RootState } from '@logic/redux/store';
import { Language, User, Location } from '@logic/types';
import { getBadgeSVG, getAlignment, getPercentage } from '@logic/utils';

import InfoCard from '@src/components/infocard';

import style from './profile.module.css';

const Badge: React.FC<{ location: Location | undefined }> = ({ location }) => {
    const [ visible, setVisibility ] = React.useState<boolean>(false);

    if (!location) return (<></>);

    return [
        visible && 'share' in navigator
        ?   <InfoCard
                key='shareCard'
                type='share'
                location={ location }
                setter={ setVisibility }
            />
        :   <></>,
        <Image
            key='badgeImage'
            src={ getBadgeSVG(location.dbname) }
            alt={ location.name } width={ 48 } height={ 48 }
            onClick={ () => setVisibility(true) }
        />
    ];
};

const Page: NextPage = () => {
    const language: Language | undefined = React.useContext(LanguageCTX);

    const user: User | undefined = useSelector((state: RootState) => state.user.value);
    const finished: Location[] = useSelector((state: RootState) => state.finished.value) || [];

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
                            key='properImage'
                            alt={ user.username }
                            src={ profilePicture }
                            width={ 64 } height={ 64 }
                        />
                    :   <div style={ getCSSColors(user.username) } key='placeholderImage'>
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
                    { user.finished.map(({ location }) =>
                        <Badge key={ location } location={ finished.find((l) => l.dbname === location) } />
                    ) }
                    </div>
                </div>
            }
        </div>
    </main>
  );
};

export default Page;