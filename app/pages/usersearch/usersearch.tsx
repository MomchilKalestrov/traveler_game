import style from './usersearch.module.css';
import userStyle from '@pages/profile/profile.module.css';
import loadingStyle from '@components/loading/loading.module.css';

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
    finished: string[]
    started: string[]
}

export enum status {
    loading,
    nouser,
    founduser,
    error
}

const Page = (
    props: {
        loading: status,
        user: user
    }
) => {

    switch (props.loading) {
        case status.loading: return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <p>Looking up user</p>
                <div className={ loadingStyle.LoadingWheel }></div>
            </div>
        );
        case status.nouser: return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <img src='/icons/nouser.svg' />
                <p>No user with the name { `"${ props.user.username }"` } found.</p>
            </div>
        );
        case status.error: return (
            <div className={ `${ style.UserSearch } ${ style.UserSearchCentered }` }>
                <img src='/icons/error.svg' />
                <p>An error occurred while looking up the user.</p>
            </div>
        );
        case status.founduser: return (
            <div className={ style.UserSearch }>
                <div className={ userStyle.ProfileContainer }>
                    <div className={ `${ userStyle.ProfileCard } ${ userStyle.ProfileInfo }` }>
                        <div className={ userStyle.ProfilePhoto }>
                            <img src={ `/user/${ props.user.username }.png` } />
                        </div>
                        <h2>{ props.user.username }</h2>
                    </div>
                    {
                        props.user.finished.length > 0 &&
                        <div className={ `${ userStyle.ProfileCard }` }>
                            <h2>Badges</h2>
                            <div className={ userStyle.ProfileDivider } />
                            <div className={ userStyle.ProfileBadges }>
                                {
                                    props.user.finished.map((data: string, key: number) =>
                                        <img src={ `/badges/${ data }.svg` } alt={ data } key={ key } />
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