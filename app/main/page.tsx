'use client'
import Navbar from '@/app/components/navbar';
import Home from '@/app/pages/home';
import Map from '@/app/pages/map';
import Profile from '@/app/pages/profile';
import { createRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/header';

type location = {
    name: string,
    location: {
        lat: number,
        lng: number
    }
};

const Page = () => {
    const router = useRouter();
    const [userData,          setUserData] = useState<any | undefined>(undefined);
    const [startedLocations,  setStarted ] = useState<Array<location> | undefined>(undefined);
    const [finishedLocations, setFinished] = useState<Array<location> | undefined>(undefined);
    const [newLocations,      setNew     ] = useState<Array<location> | undefined>(undefined);
    const [reset,             setReset   ] = useState<number>(0);

    const resetRender = () => setReset(reset + 1);
    
    useEffect(() => {        
        const verifyLogin = async () => {
            try {
                const data = await (await fetch(`/api/auth/get?username=${ encodeURIComponent('CURRENT_USER') }`)).json();
                const cookies = await (await fetch('/api/auth/cookies')).json();
                if (!cookies.username || !cookies.password || data.error)
                    return router.replace('/login');
                setUserData(data);
            }
            catch (error) {
                alert('Error fetching data: \n' + error);
            };
        }

        const getData = async () => {
            try {
                const started = await (
                    await fetch('/api/started')
                ).json();
                if(started.error) return alert('Error user started data.');

                const finished = await (
                    await fetch(`/api/finished?username=${ encodeURIComponent('CURRENT_USER') }`)
                ).json();
                if(finished.error) return alert('Error user finished data.');
                
                const all = await (
                    await fetch('/api/locations')
                ).json();
                if(all.error) return alert('Error locations data.');
                
                let locArr: Array<location> = [];
                for(let i: number = 0; i < all.length; i++)
                    if (
                        !started.some((loc: location) => loc.name === all[i].name) &&
                        !finished.some((loc: location) => loc.name === all[i].name)
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
                setFinished(finished.map((data: any) => {
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
                alert('Error fetching data: \n' + error);
            };
        };
        
        verifyLogin();
        getData();
    }, [reset]);

    let refs: Array<React.RefObject<HTMLElement>> = [
        createRef<HTMLElement>(),
        createRef<HTMLElement>(),
        createRef<HTMLElement>()
    ];

    console.log('user data', userData);
    console.log('started', startedLocations);
    console.log('finished', finishedLocations);
    console.log('new', newLocations);

    return (
        <>
            <Header />
            <Home 
                refs={ refs[0] }
                startedLocations={ startedLocations }
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