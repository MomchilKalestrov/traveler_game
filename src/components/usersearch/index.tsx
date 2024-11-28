import React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';

import { loading, stopLoading } from '@components/loading';
import AccomplishmentTag        from '@components/accomplishment';

import getColors     from '@logic/profileColor';
import { RootState } from '@logic/redux/store';
import { Accomplishment, User } from '@logic/types';

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

const UserSearch: React.FC<UserSearchProps> = ({ state, user }) => {
    const currentUser = useSelector((state: RootState) => state.user.value);
    const dispatch    = useDispatch();

    let type: string = !currentUser?.following.includes(user.username) ? 'Follow' : 'Unfollow';
    let action = () => {
        loading();
        fetch(`/api/auth/${ type.toLowerCase() }?username=${ user.username }`, { method: 'POST' })
            .then(response => {
                if (!response.ok) {
                    alert(`An error occurred while trying to ${ type.toLowerCase() } the user.`);
                    stopLoading();
                    return;
                }
                dispatch({
                    type: `user/${ type.toLowerCase() }`,
                    payload: user.username
                });
                stopLoading();
            });
    };
    
    switch (state) {
        case status.loading: return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image style={ { filter: 'none' } } src='/icons/loading.svg' alt='Loading' width={ 64 } height={ 64 } />
            </div>
        );
        case status.nouser: return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image src='/icons/nouser.svg' alt='no user' width={ 48 } height={ 48 } />
                <p>No user with the name { `"${ user.username }"` } found.</p>
            </div>
        );
        case status.error: return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image src='/icons/error.svg' alt='error' width={ 48 } height={ 48 } />
                <p>An error occurred while looking up the user.</p>
            </div>
        );
        case status.founduser:
            const [ color, r_color ] = getColors(user.username.slice(0, 3));
            const percentage = user.xp - 100 * Math.floor(user.xp / 100);
            
            return (
                <div className={ style.UserSearch }>
                    <div className={ userStyle.ProfileContainer }>
                        <div className={ `${ userStyle.ProfileCard } ${ userStyle.ProfileInfo }` }>
                            <div className={ userStyle.ProfilePhoto }>
                                <p
                                    style={ { backgroundColor: color, color: r_color } }
                                >{ user.username[0] }</p>
                                <div style={ { '--percentage': percentage + '%' } as React.CSSProperties } />
                                <p>{ Math.floor(user.xp / 100) }</p>
                            </div>
                            <h2>{ user.username }</h2>
                            <button onClick={ action }>{ type }</button>
                            <div>
                                <p><b>{ user.followers.length }</b> followers</p>
                                <p><b>{ user.following.length }</b> following</p>
                            </div>
                        </div>
                        {
                            user.finished.length > 0 &&
                            <div className={ userStyle.ProfileCard }>
                                <h2>Badges</h2>
                                <div className={ userStyle.ProfileDivider } />
                                <div className={ userStyle.ProfileBadges }>
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
                        <div className={ userStyle.ProfileCard + ' ' + style.UserSearchHistory }>
                            <h2>History</h2>
                            <div className={ userStyle.ProfileDivider } />
                            {
                                user
                                    .finished
                                    .slice(0, 6)
                                    .map((data: { location: string, time: number }, key: number) =>
                                        <AccomplishmentTag
                                            accomplishment={ {
                                                ... data,
                                                user: (user as User).username
                                            } as Accomplishment }
                                            key={ key }
                                        />
                                )
                            }
                        </div>
                    </div>
                </div>
            );
    };
};

export default UserSearch;
export { status };