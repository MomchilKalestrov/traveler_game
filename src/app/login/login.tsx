'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { loading, stopLoading } from '@components/loading';

import style from './profile.module.css';

type LogInProps = {
    setter: React.Dispatch<React.SetStateAction<boolean>>;
};

const LogIn: React.FC<LogInProps> = ({ setter }) => {
    const router = useRouter();

    const logIn = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data: FormData = new FormData(event.currentTarget);
        
        loading();
        fetch(`/api/auth/login?username=${ data.get('username') }&password=${ data.get('password') }`, {
            method: 'POST'
        }).then((res) => {
            stopLoading();
            if (!res.ok)
                return alert('Failed to log in.');
            router.replace('/home');
        });
    };

    return (
        <form className={ style.ProfileForm } onSubmit={ logIn }>
            <h1>Log in</h1>
            <div className={ style.FormInput }>
                <input name='username' placeholder=' ' />
                <label>Username</label>
            </div>
            <div className={ style.FormInput }>
                <input name='password' placeholder=' ' type='password' />
                <label>Password</label>
            </div>
            <button className={ style.FormInput }>
                <Image src='/icons/login.svg' alt='login' width={ 24 } height={ 24 } />
                <p className={ style.I_FUCKIN_HATE_CSS }>Log in</p>
            </button>
            <button
                type='button'
                onClick={ () => setter(false) }
                className={ style.FormInput + ' ' + style.StyleOutline }
            >Create profile</button>
        </form>
    );
};

export default LogIn;