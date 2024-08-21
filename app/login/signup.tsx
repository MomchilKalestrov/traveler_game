'use client';

import { Dispatch, FormEvent, SetStateAction } from 'react';
import style from './profile.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SignUp = (
    props: {
        setter: Dispatch<SetStateAction<boolean>>;
    }
) => {
    const router = useRouter();

    const createProfile = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data: FormData = new FormData(event.currentTarget);
        
        if(data.get('password') !== data.get('verify-password'))
            return alert('Passwords do not match.');

        if(((data.get('password') as string).length || 0) < 8)
            return alert('Password must be atleast 8 symbols long.');

        fetch(`/api/auth/create?username=${data.get('username')}&password=${data.get('password')}`, {
            method: 'POST'
        }).then(async (res) => {
            res.json().then((data) => {
                if(data.error)
                    return alert(data.error);
                router.replace('/');
            });
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
                onClick={ () => props.setter(true) }
                className={ style.FormInput + ' ' + style.StyleOutline }
            >Log in</button>
        </form>
    )
}

export default SignUp;