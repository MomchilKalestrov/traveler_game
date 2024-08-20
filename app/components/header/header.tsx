import style from './header.module.css';
import { useState } from 'react';
import Settings from '@pages/settings/settings';

const Header = () => {
    const [settings, setSettings] = useState(false);

    return (
        <>
            { settings && <Settings setter={ setSettings } /> }
            <header className={ style.Header }>
                <button onClick={ () => setSettings(true) }><img src='/settings.svg' /></button>
                <input type='text' placeholder='Profile lookup ...' />
                <button><img src='/search.svg' /></button>
            </header>
        </>
    );
}

export default Header;