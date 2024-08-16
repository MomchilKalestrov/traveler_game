import style from './header.module.css';
import { useState } from 'react';
import Settings from '../pages/settings';

const Header = () => {
    const [settings, setSettings] = useState(false);

    return (
        <>
            { settings && <Settings setter={ setSettings } /> }
            <header className={ style.Header }>
                <input type='text' placeholder='Search ...' />
                <button onClick={ () => setSettings(true) }><img src='/settings.svg' /></button>
            </header>
        </>
    );
}

export default Header;