'use client';
import React from 'react';
import Image from 'next/image';

import Settings               from '@components/settings';
import { stopLoading }        from '@components/loading';
import UserSearch, { status } from '@components/usersearch';

import type { user } from '@logic/types';
import { getCookie } from '@logic/cookies';

import style from './header.module.css';
import { usePathname } from 'next/navigation';

const emptyUser: user = {
    username: '',
    finished: [],
    started: [],
    followers: [],
    following: [],
    xp: 0
};

const Header = () => {
    const pathname = usePathname();

    const [ userData,    setUserData ] = React.useState<user>(emptyUser);
    const [ userLookup,  setLookup   ] = React.useState<boolean>(false);
    const [ settings,    setSettings ] = React.useState<boolean>(false);
    const [ userLoading, setLoading  ] = React.useState<status>(status.loading);
    const [ timeoutId,   setId       ] = React.useState<NodeJS.Timeout | null>(null);

    const abortControllerRef = React.useRef<AbortController | null>(null);
    const headerBGReference  = React.useRef<HTMLDivElement>(null);
    const headerReference    = React.useRef<HTMLElement>(null);
    const inputReference     = React.useRef<HTMLInputElement>(null);
    const imgReference       = React.useRef<HTMLImageElement>(null);

    React.useEffect(() => {
        abortControllerRef.current = new AbortController();
        return () => abortControllerRef.current?.abort();
    }, []);

    if (pathname === '/login')
        return (<></>);

    const clearSearch = () => {
        const input = inputReference.current;
        const img = imgReference.current;
        if (!input || !img) return;

        input.value = '';
        img.style.display = 'none';
        
        setLookup(true);
        setLoading(status.loading);
        
        if (abortControllerRef.current)
            abortControllerRef.current.abort();
    };

    const showSearch = () => {
        const bg = headerBGReference.current;
        const header = headerReference.current;

        if (!bg || !header) return;

        bg.classList.add(style.HeaderSearchBGActive);

        const backButton = header.children[0].children[0] as HTMLButtonElement;
        if (!backButton) return;
        
        backButton.style.display = 'block';
        setLookup(true);
        setLoading(status.loading);
    };

    const closeLookup = () => {
        const bg = headerBGReference.current;
        const header = headerReference.current;
        
        if (!bg || !header) return;
        
        bg.classList.remove(style.HeaderSearchBGActive);
        
        const backButton = header.children[0].children[0] as HTMLButtonElement;
        if (!backButton) return;
        
        backButton.style.display = 'none';
        setLoading(status.loading);
        clearSearch();
        setLookup(false);
        
        if (abortControllerRef.current)
            abortControllerRef.current.abort();
    };

    const startSearch = (resetting?: boolean) => {
        if (!inputReference.current) return;
        
        if (abortControllerRef.current)
            abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        
        const username: string = inputReference.current.value;

        if (
            username === '' ||
            username === 'CURRENT_USER' ||
            username === getCookie('username')?.value ||
            username.length < 3
        ) {
            setLoading(status.loading);
            setUserData(emptyUser);
            return;
        };

        setLookup(true);
        setLoading(status.loading);

        fetch(`/api/auth/get?username=${ username }`, {
            signal: abortControllerRef.current?.signal
        })
            .then(response => response.json())
            .then(data => {
                if (data.error || data.error === 'User not found.') {
                    setUserData(emptyUser)
                    return setLoading(status.nouser);
                }
                else if (data.error) {
                    console.log(data.error);
                    return setLoading(status.error);
                }

                setUserData(data as user);
                setLoading(status.founduser);
                if (resetting)
                    stopLoading();
            })
            .catch((error) => {
                if (error.toString().includes('AbortError')) return;
                console.error(error);
            });
    };

    const onEdit = (event: React.FormEvent<HTMLInputElement>) => {
        if (!event.currentTarget) return;
        if (!imgReference.current) return;

        if (event.currentTarget.value !== '')
            imgReference.current.style.display = 'unset';
        else
            imgReference.current.style.display = 'none';

        if (timeoutId)
            clearTimeout(timeoutId);
        setId(setTimeout(startSearch, 250));
    };

    return (
        <>
            { settings && <Settings close={ () => setSettings(false) } /> }
            { userLookup && <UserSearch state={ userLoading } user={ userData } reset={ startSearch } /> }
            <div className={ style.HeaderSearchBG } ref={ headerBGReference } />
            <header className={ style.Header } ref={ headerReference }>
                <div>
                    <button onClick={ closeLookup } aria-label='back from search' style={ { zIndex: 1, display: 'none' } }>
                        <Image alt='back' src='/icons/back.svg' width={ 24 } height={ 24 } />
                    </button>
                    <button aria-label='settings' onClick={ () => setSettings(true) }>
                        <Image alt='settings' src='/icons/settings.svg' width={ 24 } height={ 24 } />
                    </button>
                </div>
                <input
                    ref={ inputReference }
                    type='text'
                    placeholder='Profile lookup ...'
                    onInput={ onEdit }
                    onClick={ showSearch }
                />
                <button
                    className={ style.HeaderCloseSearch }
                    onClick={ clearSearch }
                    aria-label='Close search'
                >
                    <Image
                        ref={ imgReference }
                        style={ { display: 'none' } }
                        alt='clear'
                        src='/icons/close.svg'
                        width={ 24 }
                        height={ 24 }
                    />
                </button>
            </header>
        </>
    );
};

export default Header;