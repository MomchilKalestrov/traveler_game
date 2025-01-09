'use client';
import React   from 'react';
import Image   from 'next/image';
import { md5 } from 'js-md5';

import MaterialInput from '@components/input';
import
    LoadingPlaceholder,
    { loading, stopLoading }
from '@components/loading';

import LanguageCTX  from '@logic/contexts/languageCTX';
import { Language } from '@logic/types';
import {
    validateName,
    validateEmail
} from '@logic/validate';

import style from './login.module.css';

type SignUpProps = {
    setter: React.Dispatch<React.SetStateAction<boolean>>;
};

const validateForm = (
    username?: string | undefined,
    password?: string | undefined,
    verify?:   string | undefined,
    email?:    string | undefined
): boolean => {
    if (!username || !password || !email) {
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
    if (!validateEmail(email)) {
        alert('Invalid e-mail.');
        return false;
    }
    return true;
};

const SignUp: React.FC<SignUpProps> = ({ setter }) => {
    const language: Language | undefined = React.useContext(LanguageCTX);

    const createProfile = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!language) return;
        const data: FormData = new FormData(event.currentTarget);

        const username = data.get(language.auth.inputs.username) as string;
        const email    = data.get('E-mail') as string;
        const password = data.get(language.auth.inputs.password) as string;
        const verify   = data.get(language.auth.inputs.verify)   as string;
        
        if (!validateForm(username, password, verify, email)) return;
        
        loading();
        fetch(`/api/auth/create`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password: md5(password),
                email
            })
        }).then((res) => {
            stopLoading();
            alert(!res.ok ? 'Failed to sign up.' : 'Successfully created profile. Please verify your e-mail before continuing.');
        });
    };

    if (!language)
        return (<LoadingPlaceholder />);

    return (
        <form className={ style.ProfileForm } onSubmit={ createProfile }>
            <h1>{ language.auth.signup.title }</h1>
            
            <MaterialInput name={ language.auth.inputs.username } type='text'     required={ true } />
            <MaterialInput name='E-mail' type='text' required={ true } />
            <MaterialInput name={ language.auth.inputs.password } type='password' required={ true } />
            <MaterialInput name={ language.auth.inputs.verify   } type='password' required={ true } />
            
            <button className={ style.FormInput }>
                <Image src='/icons/login.svg' alt='signup' width={ 24 } height={ 24 } />
                <p className={ style.I_FUCKIN_HATE_CSS }>{ language.auth.signup.button }</p>
            </button>
            
            <button
                type='button'
                onClick={ () => setter(true) }
                className={ style.FormInput + ' ' + style.StyleOutline }
            >{ language.auth.login.button }</button>
        </form>
    )
}

export default SignUp;