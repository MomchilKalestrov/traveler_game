import style from './header.module.css';
import { useCallback, useState } from 'react';
import Settings from '@pages/settings/settings';
import React from 'react';
import UserSearch from '@pages/usersearch/usersearch';

type user = {
    username: string,
    finished: string[]
    started: string[]
}

const Header = () => {
    const [settings,    setSettings] = useState<boolean>(false);
    const [userLookup,  setLookup  ] = useState<boolean>(false);
    const [userLoading, setLoading ] = useState<'loading' | 'nouser' | 'founduser' | 'error'>('nouser');
    const [userData,    setUserData] = useState<user>({ username: '', finished: [], started: [] });
    const imgReference               = React.useRef<HTMLImageElement>(null);
    const inputReference             = React.useRef<HTMLInputElement>(null);
    const typingTimeoutRef           = React.useRef<number | null>(null);

    const debounce = (func: Function, delay: number) => {
        return (...args: any[]) => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = window.setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const closeSearch = (): void => {
        if (!inputReference.current) return;

        inputReference.current.value = '';
        setLookup(false);

        if (!imgReference.current) return;
        imgReference.current.style.display = 'none';
    }

    const startSearch = () => {
        if (!inputReference.current) return;
        
        const username: string = inputReference.current.value;

        if (
            username === '' ||
            username === 'CURRENT_USER' ||
            username.length < 3
        ) return;

        setLookup(true);
        setLoading('loading');

        fetch(`/api/auth/get?username=${ username }`)
            .then(response => response.json())
            .then(data => {
                if (data.error || data.error === 'User not found.') {
                    setUserData({
                        username: username,
                        finished: [],
                        started: []
                    })
                    return setLoading('nouser');
                }
                else if (data.error) {
                    console.log(data.error);
                    return setLoading('error');
                }
                setUserData({
                    username: data.username,
                    finished: data.finished,
                    started: data.started
                });
                setLoading('founduser');
            });
    }

    const onEdit = (event: React.FormEvent<HTMLInputElement>): void => {
        if (!event.currentTarget) return;
        if (!imgReference.current) return;

        if (event.currentTarget.value !== '') {
            imgReference.current.style.display = 'unset';
            setLookup(false);
        }
        else {
            imgReference.current.style.display = 'none';
            setLookup(true);
        }
    }

    const debouncedOnEdit = useCallback(debounce(startSearch, 300), []);

    return (
        <>
            { settings && <Settings setter={ setSettings } /> }
            { userLookup && <UserSearch loading={ userLoading } user={ userData } /> }
            <header className={ style.Header }>
                <button onClick={ () => setSettings(true) }><img src='/settings.svg' /></button>
                <input
                    ref={ inputReference }
                    type='text'
                    placeholder='Profile lookup ...'
                    onInput={ (event) => {
                        onEdit(event);
                        debouncedOnEdit();
                    } }
                />
                <button className={ style.HeaderCloseSearch } onClick={ closeSearch}>
                    <img
                        ref={ imgReference }
                        style={ { display: 'none' } }
                        src='/close.svg'
                    />
                </button>
            </header>
        </>
    );
}

export default Header;