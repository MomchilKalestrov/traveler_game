'use client';
import React   from 'react';
import Image   from 'next/image';
import { md5 } from 'js-md5';
import { useRouter } from 'next/navigation';

import { loading, stopLoading } from '@components/loading';
import MaterialInput            from '@components/input';

import style from './profile.module.css';

type LogInProps = {
    setter: React.Dispatch<React.SetStateAction<boolean>>;
};

const LogIn: React.FC<LogInProps> = ({ setter }) => {
    const router = useRouter();

    const logIn = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data: FormData = new FormData(event.currentTarget);
        
        const username = data.get('Username') as string || '';
        const password = data.get('Password') as string || '';

        loading();
        fetch(`/api/auth/login?username=${ username }&password=${ md5(password) }`, {
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
            <MaterialInput name='Username' type='text' required={ true } />
            <MaterialInput name='Password' type='password' required={ true } />
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