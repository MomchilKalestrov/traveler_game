'use client';
import React from 'react';
import style from './profile.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import validateName from '@logic/validateName';
import { setCookie } from '@logic/cookies';
import { md5 } from 'js-md5';

const SignUp = ({ setter }: { setter: React.Dispatch<React.SetStateAction<boolean>> }) => {
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

        fetch(`/api/auth/create?username=${data.get('username')}&password=${data.get('password')}`, {
            method: 'POST'
        }).then((res) => {
            if (res.ok) {
                // Set the cookies
                setCookie('username', data.get('username') as string);
                setCookie('password', md5(data.get('password') as string));
                router.replace('/home');
            }
            else return alert('Failed to sign up.');
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