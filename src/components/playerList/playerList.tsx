import React from 'react';
import Image from 'next/image';

import { User } from '@logic/types';
import { usePageStack } from '@logic/pageStackProvider';

import PlayerPage from '@components/playerPage';

import style from './playerlist.module.css';

type PlayerListProps = {
    usernames: string[];
    close: () => void;
};

const PlayerCard: React.FC<{ username: string }> = ({ username }) => {
    const { addPage, removePage } = usePageStack();

    const showPlayerPage = React.useCallback(() => {
        fetch(`/api/auth/get?username=${ username }`)
            .then((res) => res.json())
            .then((user: User) => {
                const name = `${ user.username }-${ Date.now() }`;
                const page = (<PlayerPage key={ name } user={ user } close={ () => removePage(name) } />);
                addPage({ name, page });
            });
    }, [ username ]);

    return (
        <div className={ style.PlayerCard } onClick={ showPlayerPage }>
            { username }
        </div>
    )
};

const PlayerList: React.FC<PlayerListProps> = ({ usernames, close }) => {
    const reference = React.useRef<HTMLDivElement>(null);

    return (
        <div className={ style.ListPage } ref={ reference }>
            <button
                className={ style.CloseButton }
                onClick={ () => {
                    if (reference.current)
                        reference.current.style.animation = `${ style.SlideOut } 0.5s forwards`;
                    setTimeout(close, 500);
                } }>
                    <Image src='/icons/back.svg' alt='go back' width={ 24 } height={ 24 } />
                </button>
                <div>
                    { usernames.map((username) => (
                        <PlayerCard key={ username } username={ username } />
                    )) }
                </div>
        </div>
    )
};

export default PlayerList;