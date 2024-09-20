import ImageAndFallback from '@app/components/imageAndFallback/imageAndFallback';
import style from './usersearch.module.css';
import userStyle from '@pages/profile/profile.module.css';
import Image from 'next/image';
import React from 'react';
import { getCookie } from '@app/cookies';
import { loading } from '@app/components/loading/loading';

/*
    Like the crack of the whip, I Snap! attack
    Front to back, in this thing called rap
    Dig it like a shovel, rhyme devil on a heavenly level
    Bang the bass, turn up the treble
    Radical mind, day and night all the time
    7:14, wise, divine
    Maniac brainiac, winnin' the game
    I'm the lyrical Jesse James
*/

type user = {
    username: string,
    finished: string[],
    started: string[],
    followers: string[],
    following: string[]
}

enum status {
    loading,
    nouser,
    founduser,
    error
}

const Page = (
    props: {
        loading: status,
        user?: user | null | undefined,
        reset: (resetting?: boolean) => void
    }
) => {
    const reference = React.useRef<HTMLImageElement>(null);

    if (!props.user)
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
        fetch(`/api/auth/follow?username=${ props.user?.username }`, { method: 'POST' })
            .then(response => {
                if (!response.ok)
                    alert('An error occurred while trying to follow the user.');
                props.reset(true);
            });
    }
    if (props.user.followers.includes(currentUser)) {
        type = 'Unfollow';
        action = () => {
            loading();
            fetch(`/api/auth/unfollow?username=${ props.user?.username }`, { method: 'POST' })
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
                <p>No user with the name { `"${ props.user.username }"` } found.</p>
            </div>
        );
        case status.error: return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <Image src='/icons/error.svg' alt='error' width={ 48 } height={ 48 } />
                <p>An error occurred while looking up the user.</p>
            </div>
        );
        case status.founduser: return (
            <div className={ style.UserSearch }>
                <div className={ userStyle.ProfileContainer }>
                    <div className={ `${ userStyle.ProfileCard } ${ userStyle.ProfileInfo }` }>
                        <div className={ userStyle.ProfilePhoto }>
                            <ImageAndFallback
                                src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/user/${ props.user.username }.png` }
                                fallback='/default_assets/user.svg'
                                ref={ reference } alt='profile picture'
                                width={ 64 } height={ 64 }
                            />
                        </div>
                        <h2>{ props.user.username }</h2>
                        <button onClick={ action }>{ type }</button>
                        <div>
                            <p><b>{ props.user.followers.length }</b> followers</p>
                            <p><b>{ props.user.following.length }</b> following</p>
                        </div>
                    </div>
                    {
                        props.user.finished.length > 0 &&
                        <div className={ `${ userStyle.ProfileCard }` }>
                            <h2>Badges</h2>
                            <div className={ userStyle.ProfileDivider } />
                            <div className={ userStyle.ProfileBadges }>
                                {
                                    props.user.finished.map((data: string, key: number) =>
                                        <ImageAndFallback
                                            src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ data }.svg` }
                                            fallback='/default_assets/badge.svg'
                                            alt={ data } key={ key }
                                            width={ 48 } height={ 48 }
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
export type { user };