'use client';
import React   from 'react';
import Image   from 'next/image';
import { md5 } from 'js-md5';
import { useRouter } from 'next/navigation';

import MaterialInput            from '@components/input';
import { loading, stopLoading } from '@components/loading';

import validateName  from '@logic/validateName';

import style from './profile.module.css';

type SignUpProps = {
    setter: React.Dispatch<React.SetStateAction<boolean>>;
};

const validateForm = (
    username?: string | undefined,
    password?: string | undefined,
    verify?:   string | undefined
): boolean => {
    if (!username || !password) {
        alert('Please fill in all fields.');
        return false;
    }
    if (password !== verify) {
        alert('Passwords do not match.');
        return false;
    }
    if (password.length < 8) {
        alert('Password must be at least 8 symbols long.');
        return false;
    }
    if (!validateName(username)) {
        alert('Invalid username.');
        return false;
    }
    return true;
};

const SignUp: React.FC<SignUpProps> = ({ setter }) => {
    const router = useRouter();

    const createProfile = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data: FormData = new FormData(event.currentTarget);

        const username = data.get('Username') as string | undefined;
        const password = data.get('Password') as string | undefined;
        const verify = data.get('Verify password') as string | undefined;
        
        if (!validateForm(username, password, verify)) return;
        
        loading();
        fetch(`/api/auth/create?username=${ username }&password=${ md5(password as string) }`, {
            method: 'POST'
        }).then((res) => {
            stopLoading();
            if (!res.ok) 
                return alert('Failed to sign up.');
            router.replace('/home');
        });
    }

    return (
        <form className={ style.ProfileForm } onSubmit={ createProfile }>
            <h1>Sign up</h1>
            <MaterialInput name='Username'        type='text'     required={ true } />
            <MaterialInput name='Password'        type='password' required={ true } />
            <MaterialInput name='Verify password' type='password' required={ true } />
            <button className={ style.FormInput }>
            <Image src='/icons/login.svg' alt='signup' width={ 24 } height={ 24 } />
                <p className={ style.I_FUCKIN_HATE_CSS }>Create profile</p>
            </button>
            <button
                type='button'
                onClick={ () => setter(true) }
                className={ style.FormInput + ' ' + style.StyleOutline }
            >Log in</button>
        </form>
    )
}

export default SignUp;