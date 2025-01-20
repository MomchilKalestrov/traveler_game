import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSelector } from 'react-redux';

import LanguageCTX from '@logic/contexts/languageCTX';
import { validateLandmark } from '@logic/validate';
import { CommunityLocation } from '@logic/types';
import store, { RootState } from '@logic/redux/store';

import MaterialInput from '@components/input';
import Button from '@components/button';

import style from './createCard.module.css';


type CreateCardProps = {
    setter: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateCard: React.FC<CreateCardProps> = ({ setter }) => {
    const language = React.useContext(LanguageCTX);

    const userSlice = useSelector((state: RootState) => state.user.value);

    const containerReference = React.useRef<HTMLDivElement>(null);

    const [ position, setPosition ] = React.useState<{ lat: number, lng: number }>({ lat: 42.7339, lng: 25.4858 });
    const [ name, setName ] = React.useState<string | undefined>();

    if (!language || !userSlice) return (<></>);

    const Map = React.useMemo(() => dynamic(() => import('./map'), { ssr: false }), []);

    const close = () => {
        if(!containerReference.current) return;
        const parent = containerReference.current.parentElement;
        if(!parent) return;

        containerReference.current.style.animation = `${ style.slideOut } 0.5s ease-in-out forwards`;
        parent.style.animation            = `${ style.blurOut  } 0.5s ease-in-out forwards`;

        setTimeout(() => setter(false), 500);
    };

    const submit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const button = e.currentTarget;

        button.disabled = true;
        
        if (!validateLandmark(name || '')) {
            button.disabled = false;
            return alert(language.community.create.error.invalid);
        };

        const location: CommunityLocation = {
            _id: 'fuckIfIKnow',
            name: name as string,
            location: position,
            author: userSlice.username,
            likes: [],
            visits: 0,
        };

        fetch('/api/auth/custom-locations?mode=create', {
            method: 'POST',
            body: JSON.stringify(location)
        }).then(async response => {
            button.disabled = false;

            if (!response.ok) {
                response.json().then(console.error);
                alert(language.community.create.error.server);
                return;
            };
            
            store.dispatch({ type: 'custom/add', payload: location });
            close();
        });
    };

    return (
        <div className={ style.CreateCard }>
            <div ref={ containerReference }>
                <button aria-label='Close card' onClick={ close } className={ style.BackButton }>
                    <Image src='/icons/back.svg' alt='back' width={ 24 } height={ 24 } />
                </button>
                <div className={ style.MapContainer }>
                    <Map locationSetter={ setPosition } />
                </div>
                <div className={ style.FormContainer }>
                    <p style={ { margin: '0px' } }>{ language.community.create.warn }</p>
                    <MaterialInput
                        onChange={ (e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value) }
                        type='text' name={ language.community.create.input } required={ true }
                    />
                    <Button onClick={ submit } border={ true }>{ language.community.create.submit }</Button>
                </div>
            </div>
        </div>
    );
};

export default CreateCard;