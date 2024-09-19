import style from './header.module.css';
import Settings from '@pages/settings/settings';
import React from 'react';
import UserSearch, { status } from '@pages/usersearch/usersearch';
import type { user } from '@pages/usersearch/usersearch';
import Image from 'next/image';

const Header = () => {
    const [settings,    setSettings] = React.useState<boolean>(false);
    const [userLookup,  setLookup  ] = React.useState<boolean>(false);
    const [userLoading, setLoading ] = React.useState<status>(status.loading);
    const [userData,    setUserData] = React.useState<user | null>(null);
    const imgReference               = React.useRef<HTMLImageElement>(null);
    const inputReference             = React.useRef<HTMLInputElement>(null);
    const abortControllerRef         = React.useRef<AbortController | null>(null);
    const headerReference            = React.useRef<HTMLElement>(null);
    const headerBGReference          = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        abortControllerRef.current = new AbortController();
        return () => abortControllerRef.current?.abort();
    }, []);

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
    }

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
    }

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
    }

    const startSearch = () => {
        if (!inputReference.current) return;
        
        if (abortControllerRef.current)
            abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        
        const username: string = inputReference.current.value;

        if (
            username === '' ||
            username === 'CURRENT_USER' ||
            username.length < 3
        ) return setLoading(status.loading);

        setLookup(true);
        setLoading(status.loading);

        fetch(`/api/auth/get?username=${ username }`, {
            signal: abortControllerRef.current?.signal
        })
            .then(response => response.json())
            .then(data => {
                if (data.error || data.error === 'User not found.') {
                    setUserData(null)
                    return setLoading(status.nouser);
                }
                else if (data.error) {
                    console.log(data.error);
                    return setLoading(status.error);
                }

                setUserData(data as user);
                setLoading(status.founduser);
            })
            .catch((error) => {
                if (error.toString().includes('AbortError')) return;
                console.error(error);
            });
    }

    const onEdit = (event: React.FormEvent<HTMLInputElement>) => {
        if (!event.currentTarget) return;
        if (!imgReference.current) return;

        if (event.currentTarget.value !== '')
            imgReference.current.style.display = 'unset';
        else
            imgReference.current.style.display = 'none';

        startSearch();
    }

    return (
        <>
            { settings && <Settings setter={ setSettings } /> }
            { userLookup && <UserSearch loading={ userLoading } user={ userData } /> }
            <div className={ style.HeaderSearchBG } ref={ headerBGReference } />
            <header className={ style.Header } ref={ headerReference }>
                <div>
                    <button onClick={ closeLookup } aria-label='back from search' style={ { zIndex: 1, display: 'none' } }>
                        <Image alt='back' src='/icons/back.svg' width={ 24 } height={ 24 } />
                    </button>
                    <button onClick={ () => setSettings(true) } aria-label='settings'>
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
}

export default Header;