import React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';

import { loading, stopLoading } from '@components/loading';
import AccomplishmentTag        from '@components/accomplishment';
import Button from '@components/button';

import getColors     from '@logic/profileColor';
import LanguageCTX   from '@logic/contexts/languageCTX';
import { RootState } from '@logic/redux/store';
import { Language, Location, User } from '@logic/types';

import userStyle from '@app/profile/profile.module.css';
import style     from './usersearch.module.css';

enum status {
    loading,
    nouser,
    founduser,
    error
};

type UserSearchProps = {
    state: status,
    user: User
};

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

const UserSearch: React.FC<UserSearchProps> = ({ state, user }) => {
    const currentUser = useSelector((state: RootState) => state.user.value);
    const all         = useSelector((state: RootState) => state.all.value);
    const dispatch    = useDispatch();

    const language: Language | undefined = React.useContext(LanguageCTX);

    const [ locationMap,    setLocationMap    ] = React.useState<Map<string, string>>(new Map());
    const [ profilePicture, setProfilePicture ] = React.useState<any | undefined>(undefined);

    React.useEffect(() => {
        if (!all) return;

        const map = new Map<string, string>();
        all.forEach((data: Location) => map.set(data.dbname, data.name));
        setLocationMap(map);
    }, [ state, all ]);

    React.useEffect(() => {
        if (!user) return;
        fetch(process.env.NEXT_PUBLIC_BLOB_STORAGE_URL + '/profile/' + user.username + '.png')
            .then(response => response.blob())
            .then(blob => setProfilePicture(URL.createObjectURL(blob)));
    }, [ user ]);

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

    switch (state) {
        case status.loading: return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image style={ { filter: 'none' } } src='/icons/loading.svg' alt='Loading' width={ 64 } height={ 64 } />
            </div>
        );
        case status.nouser: return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image src='/icons/nouser.svg' alt='no user' width={ 48 } height={ 48 } />
                <p>{ language.misc.lookup.nouser }</p>
            </div>
        );
        case status.error: return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image src='/icons/error.svg' alt='error' width={ 48 } height={ 48 } />
                <p>{ language.misc.lookup.error }</p>
            </div>
        );
        case status.founduser:            
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
                                :   <div style={ getPhotoColors(user.username) }>
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
                            user.finished.length > 0 &&
                            <>
                                <div className={ userStyle.ProfileCard }>
                                    <h2>{ language.profile.badges }</h2>
                                    <div className={ userStyle.ProfileDivider } />
                                    <div className={ userStyle.ProfileBadges } style={ getAlignment(user.finished.length) }>
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
                                <div className={ userStyle.ProfileCard + ' ' + style.UserSearchHistory }>
                                    <h2>{ language.profile.activity }</h2>
                                    <div className={ userStyle.ProfileDivider } />
                                    {
                                        user
                                            .finished
                                            .slice(0, 6)
                                            .map((data, key: number) =>
                                                <AccomplishmentTag
                                                    accomplishment={ {
                                                        location: locationMap.get(data.location) || data.location,
                                                        time: data.time,
                                                        dbname: data.location,
                                                        user: user.username
                                                    } }
                                                    key={ key }
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
export { status };