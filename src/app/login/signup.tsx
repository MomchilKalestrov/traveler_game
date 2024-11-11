'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import loading, { stopLoading } from '@components/loading';

import validateName  from '@logic/validateName';

import style from './profile.module.css';

type SignUpProps = {
    setter: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignUp: React.FC<SignUpProps> = ({ setter }) => {
    const router = useRouter();

    const createProfile = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data: FormData = new FormData(event.currentTarget);
        
        if (data.get('password') !== data.get('verify-password'))
            return alert('Passwords do not match.');
        if (((data.get('password') as string).length || 0) < 8)
            return alert('Password must be atleast 8 symbols long.');
        if (!validateName(data.get('username') as string))
            return alert('Invalid username.');
        
        loading();
        fetch(`/api/auth/create?username=${data.get('username')}&password=${data.get('password')}`, {
            method: 'POST'
        }).then((res) => {
            if (res.ok) {
                stopLoading();
                router.replace('/home');
                return
            }
            alert('Failed to sign up.');
            stopLoading();
        });
    }

    return (
        <form className={ style.ProfileForm } onSubmit={ createProfile }>
            <h1>Sign up</h1>
            <div className={ style.FormInput }>
                <input name='username' placeholder=' ' required />
                <label>Username</label>
            </div>
            <div className={ style.FormInput }>
                <input name='password' placeholder=' ' type='password' required />
                <label>Password</label>
            </div>
            <div className={ style.FormInput }>
                <input name='verify-password' placeholder=' ' type='password' required />
                <label>Verify password</label>
            </div>
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