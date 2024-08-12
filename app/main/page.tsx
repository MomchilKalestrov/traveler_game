'use client'
import Navbar from '@/components/navbar';
import Home from '@/app/pages/home';
import Map from '@/app/pages/map';
import Profile from '@/app/pages/profile';
import { createRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    
    useEffect(() => {
        const verifyLogin = async () => {
            try {
                const authResponse = await fetch('/api/auth/get');
                const authData = await authResponse.json();
                if (!authData.username || !authData.password) {
                    router.replace('/login');
                    return;
                }
            }
            catch (error) { console.log(error); }
        }
        verifyLogin();
    });

    let refs: Array<React.Ref<HTMLElement>> = [];
    for(let i: number = 0; i < 3; ++i)
        refs.push(createRef<HTMLElement>());

    return (
        <>
            <Home    refs={ refs[0] } />
            <Map     refs={ refs[1] } />
            <Profile refs={ refs[2] } />
            <Navbar  refs={ refs    } />
        </>
    )
};

export default Page;