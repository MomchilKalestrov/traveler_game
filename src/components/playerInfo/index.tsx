import React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';

import { loading, stopLoading } from '@components/loading';
import AccomplishmentTag from '@components/accomplishment';
import Button from '@components/button';

import LanguageCTX   from '@logic/contexts/languageCTX';
import getCSSColors  from '@logic/profileColor';
import { RootState } from '@logic/redux/store';
import { Language, Landmark, User, Accomplishment } from '@logic/types';
import { getBadgeSVG, getAlignment, getPercentage } from '@logic/utils';

import style from './playerinfo.module.css';
import { usePageStack } from '@src/logic/pageStackProvider';
import PlayerList from '../playerList/playerList';

type PlayerInfoProps = {
    user: User;
};

const Badges: React.FC<{ visited: { dbname: string, time: number }[], title: string }> = ({ visited, title }) => (
    <div className={ style.ProfileCard }>
        <h2>{ title }</h2>
        <div className={ style.ProfileDivider } />
        <div className={ style.ProfileBadges } style={ getAlignment(visited.length) }>
        {
            visited.map(({ dbname }) =>
                <Image
                    src={ getBadgeSVG(dbname) }
                    alt={ dbname } key={ dbname } width={ 48 } height={ 48 }
                />
            )
        }
        </div>
    </div>
);

const Activity: React.FC<{ accomplishments: Accomplishment[], title: string }> = ({ accomplishments, title }) => (
    <div className={ style.ProfileCard + ' ' + style.PlayerInfoHistory }>
        <h2>{ title }</h2>
        <div className={ style.ProfileDivider } />
        { accomplishments.map((accomplishment) =>
            <AccomplishmentTag accomplishment={ accomplishment } key={ accomplishment.dbname } />
        ) }
    </div>
);

const PlayerInfo: React.FC<PlayerInfoProps> = ({ user }) => {
    const currentUser = useSelector((state: RootState) => state.user.value);
    const allLandmarks = useSelector((state: RootState) => state.allLandmarks.value);
    const dispatch = useDispatch();

    const language: Language | undefined = React.useContext(LanguageCTX);

    const [ landmarkMap,    setLandmarkMap    ] = React.useState<Map<string, string>>(new Map());
    const [ profilePicture, setProfilePicture ] = React.useState<any | undefined>(undefined);

    const { addPage, removePage } = usePageStack();

    React.useEffect(() => {
        if (!allLandmarks) return;

        const map = new Map<string, string>();
        allLandmarks.forEach((landmark: Landmark) => map.set(landmark.dbname, landmark.name));
        setLandmarkMap(map);
    }, [ allLandmarks?.length ]);

    React.useEffect(() => {
        if (!user) return;

        fetch(process.env.NEXT_PUBLIC_BLOB_STORAGE_URL + '/profile/' + user.username + '.png')
            .then(response => response.ok ? response.blob() : undefined)
            .then(blob => blob ? setProfilePicture(URL.createObjectURL(blob)) : undefined);
    }, [ user.username ]);

    let actionType: string = !currentUser?.following.includes(user.username)
    ?   'follow'
    :   'unfollow';
        
    let action = () => {
        loading();
        fetch(`/api/auth/${ actionType }?username=${ user.username }`, { method: 'POST' })
            .then(response => {
                if (!response.ok) {
                    alert(`An error occurred while trying to ${ actionType } the user.`);
                    stopLoading();
                    return;
                }
                dispatch({
                    type: `user/${ actionType }`,
                    payload: user.username
                });
                stopLoading();
            });
    };
    
    if (!language) return (<></>);

    const isCurrentUser = currentUser?.username === user.username;

    const viewOtherPlayers = React.useCallback((usernames: string[]) => {
        if (usernames.length === 0) return;
        const name = `playerlist-${ usernames.join('-') }-${ Date.now() }`;
        const page = (<PlayerList usernames={ usernames } close={ () => removePage(name) } />);
        addPage({ name, page });
    }, [ user.username ]);

    return (
        <div className={ style.PlayerInfo }>
            <div className={ style.ProfileContainer }>
                <div className={ `${ style.ProfileCard } ${ style.ProfileInfo }` }>
                    <div className={ style.ProfilePhoto }>
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
                    !isCurrentUser &&
                    <Button onClick={ action } border={ true }>{ language.profile[ actionType ] }</Button>
                }
                    <div>
                        <p onClick={ () => viewOtherPlayers(user.followers) }><b>{ user.followers.length }</b> { language.profile.followers }</p>
                        <p onClick={ () => viewOtherPlayers(user.following) }><b>{ user.following.length }</b> { language.profile.following }</p>
                    </div>
                </div>
                {
                    user.visited.length > 0 &&
                    <> { /* GOTTA CLONE THE FUCKING ARRAY BECAUSE THE FUCKING LENGTH IS 0 EVEN WHEN THERE ARE ELEMENTS INSIDE FUCK */ }
                        <Badges visited={ [ ...user.visited ] } title={ language.profile.badges } />
                        <Activity
                            title={ language.profile.activity }
                            accomplishments={
                                [ ...user.visited ]
                                    .splice(0, 6)
                                    .map(l => ({
                                        ...l,
                                        landmarkname: landmarkMap.get(l.dbname) || l.dbname,
                                        username: isCurrentUser ? "You" : user.username
                                    }))
                            }
                        />
                    </>
                }
            </div>
        </div>
    )
};

export default PlayerInfo;