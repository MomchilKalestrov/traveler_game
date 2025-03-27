import React from 'react';
import Image from 'next/image';

import { User } from '@logic/types';

import PlayerInfo from '@components/playerInfo';

import style from './playerpage.module.css';

type PlayerPageProps = {
    user: User;
    close: () => void;
};

const PlayerPage: React.FC<PlayerPageProps> = ({ user, close }) => {
    const reference = React.useRef<HTMLDivElement>(null);

    return (
        <div className={ style.PlayerPage } ref={ reference }>
            <button
                className={ style.CloseButton }
                onClick={ () => {
                    if (reference.current)
                        reference.current.style.animation = `${ style.SlideOut } 0.5s forwards`;
                    setTimeout(close, 500);
                } }>
                    <Image src='/icons/back.svg' alt='go back' width={ 24 } height={ 24 } />
                </button>
            <PlayerInfo user={ user } />
        </div>
    )
};

export default PlayerPage;