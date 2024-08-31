import style from './header.module.css';
import Settings from '@pages/settings/settings';
import React from 'react';
import UserSearch, { status } from '@pages/usersearch/usersearch';
import Image from 'next/image';

type user = {
    username: string,
    finished: string[]
    started: string[]
}

const Header = () => {
    const [settings,    setSettings] = React.useState<boolean>(false);
    const [userLookup,  setLookup  ] = React.useState<boolean>(false);
    const [userLoading, setLoading ] = React.useState<status>(status.loading);
    const [userData,    setUserData] = React.useState<user>({ username: '', finished: [], started: [] });
    const imgReference               = React.useRef<HTMLImageElement>(null);
    const inputReference             = React.useRef<HTMLInputElement>(null);
    const abortControllerRef         = React.useRef<AbortController | null>(null);
    const headerReference            = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        abortControllerRef.current = new AbortController();
        return () => abortControllerRef.current?.abort();
    }, []);

    const clearSearch = () => {
        if (!inputReference.current) return;

        inputReference.current.value = '';

        if (!imgReference.current) return;
        imgReference.current.style.display = 'none';
        
        if (abortControllerRef.current)
            abortControllerRef.current.abort();
    }

    const showSearch = () => {
        if (!headerReference.current) return;
        headerReference.current.style.background = 'var(--color-secondary)';
        headerReference.current.style.borderBottom = '1px solid var(--color-primary)';
        setLookup(true);

        if (!headerReference.current) return;
        const backButton = headerReference.current.children[0].children[0] as HTMLButtonElement;
        if (!backButton) return;

        backButton.style.display = 'block';
    }

    const closeLookup = () => {
        if (!headerReference.current) return;
        headerReference.current.style.background = '';
        headerReference.current.style.borderBottom = 'unset';
        setLookup(false);

        if (!headerReference.current) return;
        const backButton = headerReference.current.children[0].children[0] as HTMLButtonElement;
        if (!backButton) return;
        backButton.style.display = 'none';

        clearSearch();
        
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
                    setUserData({
                        username: username,
                        finished: [],
                        started: []
                    })
                    return setLoading(status.nouser);
                }
                else if (data.error) {
                    console.log(data.error);
                    return setLoading(status.error);
                }
                setUserData({
                    username: data.username,
                    finished: data.finished,
                    started: data.started
                });
                setLoading(status.founduser);
            })
            .catch((error) => {
                if (error.toString().includes('AbortError')) return;
                console.error(error);
            });
    }

    const onEdit = (event: React.FormEvent<HTMLInputElement>): void => {
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
            <header className={ style.Header } ref={ headerReference }>
                <div>
                    <button onClick={ closeLookup } aria-label='back from search' style={ { zIndex: 1, display: 'none' } }>
                        <Image alt='back' src='/icons/back.svg' width={ 32 } height={ 32 } />
                    </button>
                    <button onClick={ () => setSettings(true) } aria-label='settings'>
                        <Image alt='settings' src='/icons/settings.svg' width={ 32 } height={ 32 } />
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
                        width={ 32 }
                        height={ 32 }
                    />
                </button>
            </header>
        </>
    );
}

export default Header;