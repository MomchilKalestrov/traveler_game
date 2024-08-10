'use client';

import { Dispatch, SetStateAction } from 'react';
import style from './profile.module.css';

const LogIn = (
    props: {
        setter: Dispatch<SetStateAction<boolean>>;
    }
) => {

    return (
        <form className={ style.ProfileForm }>
            <img /><h1>Log in</h1>
            <div className={ style.FormInput }>
                <input name='username' placeholder=' ' />
                <label>Username</label>
            </div>
            <div className={ style.FormInput }>
                <input name='password' placeholder=' ' />
                <label>Password</label>
            </div>
            <button className={ style.FormInput }>
                <img src='/login.svg' />
                <p>Log in</p>
            </button>
            <button
                type='button'
                onClick={ () => props.setter(false) }
                className={ style.FormInput + ' ' + style.StyleOutline }
            >Create profile</button>
        </form>
    )
}

export default LogIn;