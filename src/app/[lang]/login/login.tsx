'use client';
import React   from 'react';
import Image   from 'next/image';
import { md5 } from 'js-md5';
import { useRouter, useParams } from 'next/navigation';

import MaterialInput from '@components/input';
import
    LoadingPlaceholder,
    { loading, stopLoading }
from '@components/loading';

import { Language } from '@logic/types';
import LanguageCTX  from '@logic/contexts/languageCTX';

import style from './login.module.css';

type LogInProps = {
    setter: React.Dispatch<React.SetStateAction<boolean>>;
};

const LogIn: React.FC<LogInProps> = ({ setter }) => {
    const router = useRouter();
    const params = useParams();
    
    const language: Language | undefined = React.useContext(LanguageCTX);

    const logIn = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!language) return;
        const data: FormData = new FormData(event.currentTarget);

        const username = data.get(language.auth.inputs.username) as string;
        const password = data.get(language.auth.inputs.password) as string;

        loading();
        fetch(`/api/auth/login?username=${ username }&password=${ md5(password) }`, {
            method: 'POST'
        }).then((res) => {
            stopLoading();
            if (!res.ok)
                return alert('Failed to log in.');
            router.replace(`/${ params.lang }/home`);
        });
    };

    if (!language)
        return (<LoadingPlaceholder />);

    return (
        <form className={ style.ProfileForm } onSubmit={ logIn }>
            <h1>{ language.auth.login.title }</h1>
            <MaterialInput name={ language.auth.inputs.username } type='text'     required={ true } />
            <MaterialInput name={ language.auth.inputs.password } type='password' required={ true } />
            <button className={ style.FormInput }>
                <Image src='/icons/login.svg' alt='login' width={ 24 } height={ 24 } />
                <p className={ style.I_FUCKIN_HATE_CSS }>{ language.auth.login.button }</p>
            </button>
            <button
                type='button'
                onClick={ () => setter(false) }
                className={ style.FormInput + ' ' + style.StyleOutline }
            >{ language.auth.signup.button }</button>
        </form>
    );
};

export default LogIn;