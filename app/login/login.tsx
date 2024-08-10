'use client';

import { Dispatch, FormEvent, SetStateAction } from 'react';
import style from './profile.module.css';
import { useRouter } from 'next/navigation';

const LogIn = (
    props: {
        setter: Dispatch<SetStateAction<boolean>>;
    }
) => {
    const router = useRouter();

    const logIn = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data: FormData = new FormData(event.currentTarget);

        fetch(`/api/auth/login?username=${data.get('username')}&password=${data.get('password')}`, {
            method: 'POST'
        }).then(async (res) => {
            res.json().then((data) => {
                if(data.error)
                    return alert(data.error);
                router.push('/main/Home');
            });
        });
    }

    return (
        <form className={ style.ProfileForm } onSubmit={ logIn }>
            <img /><h1>Log in</h1>
            <div className={ style.FormInput }>
                <input name='username' placeholder=' ' />
                <label>Username</label>
            </div>
            <div className={ style.FormInput }>
                <input name='password' placeholder=' ' type='password' />
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