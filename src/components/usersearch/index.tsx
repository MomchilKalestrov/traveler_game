import React from 'react';
import Image from 'next/image';

import { loading }    from '@components/loading';
import Accomplishment from '@components/accomplishment';

import getColors                     from '@logic/profileColor';
import { getCookie }                 from '@logic/cookies';
import type { accomplishment, user } from '@logic/types';

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
    user?: user | undefined,
    reset: (resetting?: boolean) => void
};

const UserSearch: React.FC<UserSearchProps> = ({ state, user, reset }) => {
    if (!user)
        return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image src='/icons/nouser.svg' alt='no user' width={ 48 } height={ 48 } />
                <p>No user has found.</p>
            </div>
        );

    const currentUser: string = getCookie('username')?.value || '';
    // we assume that the user is not followed
    let type: string = 'Follow';
    let action: () => void = () => {
        loading();
        fetch(`/api/auth/follow?username=${ user?.username }`, { method: 'POST' })
            .then(response => {
                if (!response.ok)
                    alert('An error occurred while trying to follow the user.');
                reset(true);
            });
    };

    if (user.followers.includes(currentUser)) {
        type = 'Unfollow';
        action = () => {
            loading();
            fetch(`/api/auth/unfollow?username=${ user?.username }`, { method: 'POST' })
                .then(response => {
                    if (!response.ok)
                        alert('An error occurred while trying to unfollow the user.');
                    reset(true);
                });
        };
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
                                        <Accomplishment
                                            accomplishment={ {
                                                ... data,
                                                user: (user as user).username
                                            } as accomplishment }
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