// Every time I open this forsaken file I feel sick
// Someday I'll rewrite this whole thing

'use client';
import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import Settings        from '@components/settings';
import { stopLoading } from '@components/loading';
import UserInfo        from '@components/playerInfo';

import { Language, User } from '@logic/types';
import LanguageCTX        from '@logic/contexts/languageCTX';
import { usePageStack }   from '@logic/pageStackProvider';

import style from './header.module.css';

type status = 'loading' | 'nouser' | 'founduser' | 'error';

const isHidden = (url: string): boolean => {
    const hidden: string[] = [ 'login', 'about' ];
    let hide = false;

    hidden.forEach((page) => hide = hide || url.includes(page));
    
    return hide;
};

type UserSearchOutputProps = {
    user?: User;
    status: status;
    language: Language;
}

const UserSearchOutput: React.FC<UserSearchOutputProps> = ({ status, user, language }) => {
    switch (status) {
        case 'loading': return (
            <div className={ `${ style.UserSearchOutput } ${ style.UserSearchCentered }` }>
                <Image style={ { filter: 'none' } } src='/icons/loading.svg' alt='Loading' width={ 64 } height={ 64 } />
            </div>
        );
        case 'nouser': return (
            <div className={ `${ style.UserSearchOutput } ${ style.UserSearchCentered }` }>
                <Image src='/icons/nouser.svg' alt='no user' width={ 48 } height={ 48 } />
                <p>{ language.misc.lookup.nouser }</p>
            </div>
        );
        case 'error': return (
            <div className={ `${ style.UserSearchOutput } ${ style.UserSearchCentered }` }>
                <Image src='/icons/error.svg' alt='error' width={ 48 } height={ 48 } />
                <p>{ language.misc.lookup.error }</p>
            </div>
        );
        case 'founduser':
            return (
                <div className={ style.UserSearchOutput }>
                    <UserInfo user={ user! } />
                </div>
            );
    }
}

const Header = () => {
    const language: Language | undefined = React.useContext(LanguageCTX);

    const { addPage, removePage } = usePageStack();

    const pathname = usePathname();

    const [ userData,    setUserData ] = React.useState<User | undefined>(undefined);
    const [ userLookup,  setLookup   ] = React.useState<boolean>(false);
    const [ userStatus,  setStatus   ] = React.useState<status>('loading');
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

    const clearSearch = () => {
        const input = inputReference.current;
        const img = imgReference.current;
        if (!input || !img) return;

        input.value = '';
        img.style.display = 'none';
        
        setLookup(true);
        setStatus('loading');
        
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
        setStatus('loading');
    };

    const closeLookup = () => {
        const bg = headerBGReference.current;
        const header = headerReference.current;
        
        if (!bg || !header) return;
        
        bg.classList.remove(style.HeaderSearchBGActive);
        
        const backButton = header.children[0].children[0] as HTMLButtonElement;
        if (!backButton) return;
        
        backButton.style.display = 'none';
        setStatus('loading');
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
            username.length < 3
        ) {
            setStatus('loading');
            setUserData(undefined);
            return;
        };

        setLookup(true);
        setStatus('loading');

        fetch(`/api/auth/get?username=${ username }`, {
            signal: abortControllerRef.current?.signal
        })
            .then(response => response.json())
            .then(data => {
                if (data.error || data.error === 'User not found.') {
                    setUserData(undefined)
                    return setStatus('nouser');
                }
                else if (data.error) {
                    console.log(data.error);
                    return setStatus('error');
                }

                setUserData(data as User);
                setStatus('founduser');
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

        const state: string = event.currentTarget.value !== '' ? 'unset' : 'none';
        imgReference.current.style.display = state;

        if (timeoutId)
            clearTimeout(timeoutId);
        setId(setTimeout(startSearch, 250));
    };

    if (!language || isHidden(pathname)) return (<></>);

    return (
        <>
            { userLookup && <UserSearchOutput user={ userData } status={ userStatus } language={ language } /> }
            <div className={ style.HeaderSearchBG } ref={ headerBGReference } />
            <header className={ style.Header } ref={ headerReference }>
                <div>
                    <button onClick={ closeLookup } aria-label='Close search' style={ { zIndex: 1, display: 'none' } }>
                        <Image alt='back' src='/icons/back.svg' width={ 24 } height={ 24 } />
                    </button>
                    <button
                        aria-label='Go to settings'
                        onClick={ () =>
                            addPage({ name: 'settings', page: (<Settings close={ () => removePage('settings') } />) })
                        }
                    >
                        <Image alt='settings' src='/icons/settings.svg' width={ 24 } height={ 24 } />
                    </button>
                </div>
                <input
                    ref={ inputReference }
                    type='text'
                    placeholder={ language.misc.lookup.title }
                    onInput={ onEdit }
                    onClick={ showSearch }
                />
                <button
                    className={ style.HeaderCloseSearch }
                    onClick={ clearSearch }
                    aria-label='Clear search input'
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