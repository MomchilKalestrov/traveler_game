import React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';

import { loading, stopLoading } from '@components/loading';
import AccomplishmentTag from '@components/accomplishment';
import Button from '@components/button';

import LanguageCTX   from '@logic/contexts/languageCTX';
import getCSSColors  from '@logic/profileColor';
import { RootState } from '@logic/redux/store';
import { Language, Landmark, User } from '@logic/types';
import { getBadgeSVG, getAlignment, getPercentage } from '@logic/utils';

import userStyle from '@app/profile/profile.module.css';
import style     from './usersearch.module.css';

type status = 'loading' | 'nouser' | 'founduser' | 'error';

type UserSearchProps = {
    currentStatus: status,
    user: User
};

const UserSearch: React.FC<UserSearchProps> = ({ currentStatus, user }) => {
    const currentUser = useSelector((state: RootState) => state.user.value);
    const allLandmarks = useSelector((state: RootState) => state.allLandmarks.value);
    const dispatch = useDispatch();

    const language: Language | undefined = React.useContext(LanguageCTX);

    const [ landmarkMap,    setLandmarkMap    ] = React.useState<Map<string, string>>(new Map());
    const [ profilePicture, setProfilePicture ] = React.useState<any | undefined>(undefined);

    React.useEffect(() => {
        if (!allLandmarks) return;

        const map = new Map<string, string>();
        allLandmarks.forEach((landmark: Landmark) => map.set(landmark.dbname, landmark.name));
        setLandmarkMap(map);
    }, [ currentStatus, allLandmarks?.length ]);

    React.useEffect(() => {
        if (!user) return;
        fetch(process.env.NEXT_PUBLIC_BLOB_STORAGE_URL + '/profile/' + user.username + '.png')
            .then(response => response.blob())
            .then(blob => setProfilePicture(URL.createObjectURL(blob)));
    }, [ user.username ]);

    let actionType: string = !currentUser?.following.includes(user.username)
        ? 'follow'
        : 'unfollow';
        
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

    switch (currentStatus) {
        case 'loading': return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image style={ { filter: 'none' } } src='/icons/loading.svg' alt='Loading' width={ 64 } height={ 64 } />
            </div>
        );
        case 'nouser': return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image src='/icons/nouser.svg' alt='no user' width={ 48 } height={ 48 } />
                <p>{ language.misc.lookup.nouser }</p>
            </div>
        );
        case 'error': return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image src='/icons/error.svg' alt='error' width={ 48 } height={ 48 } />
                <p>{ language.misc.lookup.error }</p>
            </div>
        );
        case 'founduser':            
            return (
                <div className={ style.UserSearch }>
                    <div className={ userStyle.ProfileContainer }>
                        <div className={ `${ userStyle.ProfileCard } ${ userStyle.ProfileInfo }` }>
                            <div className={ userStyle.ProfilePhoto }>
                            {
                                profilePicture
                                ?   <Image
                                        alt={ user.username }
                                        src={ profilePicture }
                                        width={ 64 } height={ 64 }
                                    />
                                :   <div style={ getCSSColors(user.username) }>
                                        { user.username[0] }
                                    </div>
                            }
                                <div style={ getPercentage(user.xp) } />
                                <p>{ Math.floor(user.xp / 100) }</p>
                            </div>
                            <h2>{ user.username }</h2>
                            <Button onClick={ action } border={ true }>{ language.profile[ actionType ] }</Button>
                            <div>
                                <p><b>{ user.followers.length }</b> { language.profile.followers }</p>
                                <p><b>{ user.following.length }</b> { language.profile.following }</p>
                            </div>
                        </div>
                        {
                            user.visited.length > 0 &&
                            <>
                                <div className={ userStyle.ProfileCard }>
                                    <h2>{ language.profile.badges }</h2>
                                    <div className={ userStyle.ProfileDivider } />
                                    <div className={ userStyle.ProfileBadges } style={ getAlignment(user.visited.length) }>
                                    {
                                        user.visited.map(({ dbname}) =>
                                            <Image
                                                src={ getBadgeSVG(dbname) }
                                                alt={ dbname } key={ dbname } width={ 48 } height={ 48 }
                                            />
                                        )
                                    }
                                    </div>
                                </div>
                                <div className={ userStyle.ProfileCard + ' ' + style.UserSearchHistory }>
                                    <h2>{ language.profile.activity }</h2>
                                    <div className={ userStyle.ProfileDivider } />
                                    {
                                        user
                                            .visited
                                            .slice(0, 6)
                                            .map(({ dbname, time }) =>
                                                <AccomplishmentTag
                                                    accomplishment={ {
                                                        landmarkname: landmarkMap.get(dbname) || dbname,
                                                        time,
                                                        dbname,
                                                        username: user.username
                                                    } }
                                                    key={ dbname }
                                                />
                                        )
                                    }
                                </div>
                            </>
                        }
                    </div>
                </div>
            );
    };
};

export default UserSearch;
export type { status };