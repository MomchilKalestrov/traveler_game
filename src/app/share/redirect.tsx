'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Redirect: React.FC = () => {
    const router = useRouter();

    React.useEffect(() => {
        router.push('/');
    }, [ router ]);

    return (
        <div style={ {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '1rem'
        } }>
            <Image src='/favicon.png' alt='Venturo' width={ 64 } height={ 64 } />
            <h1>Redirecting</h1>
        </div>
    );
};

export default Redirect;