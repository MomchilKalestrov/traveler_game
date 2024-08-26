'use client';
import style from './admin.module.css';

const SignIn = () => {
    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        
        fetch('/api/auth/admin/savecookie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passphrase: data.get('passphrase') }) 
        }).then(() => window.location.reload());
    }

    return (
        <div className={ style.Admin }>
            <form className={ style.AdminPane } onSubmit={ submit } method='get'>
                <h1>Authenticator</h1>
                <input name='passphrase' placeholder='passphrase' />
                <button>Authenticate</button>
            </form>
        </div>
    );
}

export default SignIn;