'use client'
import Navbar from '@/components/navbar';
import Home from '@/app/main/Home/home';
import Map from '@/app/main/Map/map';
import Profile from '@/app/main/Profile/profile';
import { createRef } from 'react';

const Page = () => {
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