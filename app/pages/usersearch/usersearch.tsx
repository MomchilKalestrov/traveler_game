import style from './usersearch.module.css';
import userStyle from '@pages/profile/profile.module.css';
import Image from 'next/image';
import React from 'react';
import { getCookie } from '@app/cookies';
import { loading } from '@app/components/loading/loading';
import type { user } from '@app/types';

/*
    Like the crack of the whip, I Snap! attack
    Front to back, in this thing called rap
    Dig it like a shovel, rhyme devil on a heavenly level
    Bang the bass, turn up the treble
    Radical mind, day and night all the time
    7:14, wise, divine
    Maniac brainiac, winnin' the game
    I'm the lyrical Jesse James
    
    - Snap! - The Power
*/

enum status {
    loading,
    nouser,
    founduser,
    error
}

const Page = (
    props: {
        loading: status,
        userData?: user | null | undefined,
        reset: (resetting?: boolean) => void
    }
) => {
    if (!props.userData)
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
        fetch(`/api/auth/follow?username=${ props.userData?.username }`, { method: 'POST' })
            .then(response => {
                if (!response.ok)
                    alert('An error occurred while trying to follow the user.');
                props.reset(true);
            });
    }
    if (props.userData.followers.includes(currentUser)) {
        type = 'Unfollow';
        action = () => {
            loading();
            fetch(`/api/auth/unfollow?username=${ props.userData?.username }`, { method: 'POST' })
                .then(response => {
                    if (!response.ok)
                        alert('An error occurred while trying to unfollow the user.');
                    props.reset(true);
                });
        }
    }




    switch (props.loading) {
        case status.loading: return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image style={ { filter: 'none' } } src='/icons/loading.svg' alt='Loading' width={ 64 } height={ 64 } />
            </div>
        );
        case status.nouser: return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image src='/icons/nouser.svg' alt='no user' width={ 48 } height={ 48 } />
                <p>No user with the name { `"${ props.userData.username }"` } found.</p>
            </div>
        );
        case status.error: return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image src='/icons/error.svg' alt='error' width={ 48 } height={ 48 } />
                <p>An error occurred while looking up the user.</p>
            </div>
        );
        case status.founduser:
            const bytes = new TextEncoder().encode(props.userData.username);
            
            const red = bytes[0].toString(16).padStart(2, '0');
            const green = bytes[1].toString(16).padStart(2, '0');
            const blue = bytes[2].toString(16).padStart(2, '0');
            const color = `#${ red }${ green }${ blue }`;

            const r_red = (256 - bytes[0]).toString(16).padStart(2, '0');
            const r_green = (256 - bytes[1]).toString(16).padStart(2, '0');
            const r_blue = (256 - bytes[2]).toString(16).padStart(2, '0');
            const r_color = `#${ r_red }${ r_green }${ r_blue }`;
            
            return (
                <div className={ style.UserSearch }>
                    <div className={ userStyle.ProfileContainer }>
                        <div className={ `${ userStyle.ProfileCard } ${ userStyle.ProfileInfo }` }>
                            <p
                            className={ userStyle.ProfilePhoto }
                            style={ { backgroundColor: color, color: r_color } }
                            >{ props.userData.username[0] }</p>
                            <h2>{ props.userData.username }</h2>
                            <button onClick={ action }>{ type }</button>
                            <div>
                                <p><b>{ props.userData.followers.length }</b> followers</p>
                                <p><b>{ props.userData.following.length }</b> following</p>
                            </div>
                        </div>
                        {
                            props.userData.finished.length > 0 &&
                            <div className={ `${ userStyle.ProfileCard }` }>
                                <h2>Badges</h2>
                                <div className={ userStyle.ProfileDivider } />
                                <div className={ userStyle.ProfileBadges }>
                                    {
                                        props.userData.finished.map((data: { location: string, time: number }, key: number) =>
                                        <Image
                                            src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ data.location }.svg` }
                                            alt={ data.location } key={ key } width={ 48 } height={ 48 }
                                        />
                                        )
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            );
    }
}

export default Page;
export { status };