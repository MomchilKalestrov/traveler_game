'use client';
import React from 'react';
import Image from 'next/image';
import { NextPage }  from 'next';

import LoadingPlaceholder from '@components/loading';

import LanguageCTX  from '@logic/contexts/languageCTX';
import getCSSColors from '@logic/profileColor';
import { getPercentage }  from '@logic/utils';
import { Language, User } from '@logic/types';

import userStyle from '@app/profile/profile.module.css';
import style     from './leaderboard.module.css';

type PlayerProps = {
    user: User;
    position: number;
};

const Player: React.FC<PlayerProps> = ({ user, position }) => {
    const [ profilePicture, setProfilePicture ] = React.useState<any | undefined>(undefined);

    React.useEffect(() => {
        if (!user) return;

        fetch(process.env.NEXT_PUBLIC_BLOB_STORAGE_URL + '/profile/' + user.username + '.png')
            .then(response => response.blob())
            .then(blob => setProfilePicture(URL.createObjectURL(blob)));
    }, [ user ]);

    return (
        <div className={ `${ userStyle.ProfileCard } ${ userStyle.ProfileInfo }` }>
            <div className={ userStyle.ProfilePhoto }>
            {
                profilePicture
                ?   <Image alt={ user.username } src={ profilePicture } width={ 64 } height={ 64 } />
                :   <div style={ getCSSColors(user.username) }>{ user.username[0] }</div>
            }
                <div style={ getPercentage(user.xp) } />
                <p>{ Math.floor(user.xp / 100) }</p>
            </div>
            <h2>{ user.username }</h2>
        {
            position < 3
            ?   <Image
                    src={ `/icons/crowns/crown${ position }.svg` }
                    alt='Crown' width={ 48 } height={ 48 }
                    className={ style.Top100Position }
                />
            :   <h3 className={ style.Top100Position }>{ position + 1 }</h3>
        }
        </div>
    );
};

const Page: NextPage = () => {
    const language: Language | undefined = React.useContext(LanguageCTX);

    const [ players, setPlayers ] = React.useState<User[] | undefined>(undefined);
    
    React.useEffect(() => {
        if (sessionStorage.getItem('top'))
            return setPlayers(JSON.parse(sessionStorage.getItem('top') as string));
        
        fetch('/api/top')
            .then(res => res.ok ? res.json() : undefined)
            .then(data => {
                if(!data) return console.error('An error has occured.');
        
                sessionStorage.setItem('top', JSON.stringify(data));
                setPlayers(data);
            });
    }, []);

    if (!players || !language) return (<LoadingPlaceholder />);

    return (
        <main>
            <div className={ style.Top100Container }>
                <h1>{ language.leaderboard.top.replace('{COUNT}', players.length.toString()) }</h1>
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
