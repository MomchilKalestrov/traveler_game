'use client'
import Navbar from '@components/navbar/navbar';
import Home from '@pages/home/home';
import Map from '@pages/map/map';
import Profile from '@pages/profile/profile';
import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@components/header/header';
import type { location, user } from '@app/types';

const Page = () => {
    const router                            = useRouter();
    const abortControllerRef                = React.useRef<AbortController | null>(null);
    const [userData,          setUserData]  = React.useState<user | undefined>(undefined);
    const [startedLocations,  setStarted ]  = React.useState<Array<location> | undefined>(undefined);
    const [newLocations,      setNew     ]  = React.useState<Array<location> | undefined>(undefined);
    const [reset,             setReset   ]  = React.useState<number>(0);

    const resetRender = () => setReset(reset + 1);

    React.useEffect(() => {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
            
        const verifyLogin = async () => {
            try {
                const data = await (await fetch(`/api/auth/get?username=${ encodeURIComponent('CURRENT_USER') }`)).json();
                const cookies = await (await fetch('/api/auth/cookies')).json();
                if (!cookies.username || !cookies.password || data.error) {
                    if (abortControllerRef.current)
                        abortControllerRef.current.abort();
                    return router.replace('/login');
                }
                setUserData(data);
            }
            catch (error) {
                alert('Error fetching user data: \n' + error);
            };
        }

        const getData = async () => {
            try {
                const started = await (
                    await fetch('/api/started', {
                        signal: abortControllerRef.current?.signal
                    })
                ).json();
                if(started.error || !started) throw Error('Error user started data.');

                const finished = await (
                    await fetch(`/api/finished?username=${ encodeURIComponent('CURRENT_USER') }`, {
                        signal: abortControllerRef.current?.signal
                    })
                ).json();
                if(finished.error || !finished) throw Error('Error user finished data.');
                
                const all = await (
                    await fetch('/api/locations', {
                        signal: abortControllerRef.current?.signal,
                        next : { revalidate: 604800 } // revalidate every 7 days
                    })
                ).json();
                if(all.error || !all) throw Error('Error locations data.');
                let locArr: Array<location> = [];
                for(let i: number = 0; i < all.length; i++)
                    if (
                        !started.some((loc: location) => loc.name === all[i].name) &&
                        !finished.some((loc: any) => loc.location === all[i].name)
                    )
                        locArr.push({
                            name: all[i].name,
                            location: {
                                lat: parseFloat(all[i].location.lat['$numberDecimal']),
                                lng: parseFloat(all[i].location.lng['$numberDecimal'])
                            }
                        });
                setStarted(started.map((data: any) => {
                    return {
                        name: data.name,
                        location: {
                            lat: parseFloat(data.location.lat['$numberDecimal']),
                            lng: parseFloat(data.location.lng['$numberDecimal'])
                        }
                    }
                }));
                setNew(locArr);
                document.getElementById('loading')?.remove();
            } catch (error) {
                console.log('Error fetching data: \n' + error);
            };
        };
        
        verifyLogin();
        getData();
    }, [reset]);

    let refs: Array<React.RefObject<HTMLElement>> = [
        React.createRef<HTMLElement>(),
        React.createRef<HTMLElement>(),
        React.createRef<HTMLElement>()
    ];

    return (
        <>
            <Header />
            <Home
                refs={ refs[0] }
                userData={ userData }
                newLocations={ newLocations }
                reset={ resetRender }
            />
            <Map 
                refs={ refs[1] }
                startedLocations={ startedLocations }
                reset={ resetRender }
            />
            <Profile 
                refs={ refs[2] }
                userData={ userData }
            />
            <Navbar refs={ refs } />
        </>
    )
};

export default Page;