'use client'
import Navbar from '@/app/components/navbar';
import Home from '@/app/pages/home';
import Map from '@/app/pages/map';
import Profile from '@/app/pages/profile';
import { createRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type location = {
    name: string,
    location: {
        lat: number,
        lng: number
    }
};

const Page = () => {
    const router = useRouter();
    const [startedLocations,  setStarted ] = useState<Array<location> | undefined>(undefined);
    const [finishedLocations, setFinished] = useState<Array<location> | undefined>(undefined);
    const [newLocations,      setNew     ] = useState<Array<location> | undefined>(undefined);
    
    useEffect(() => {
        const verifyLogin = async () => {
            try {
                const authResponse = await fetch('/api/auth/get');
                const authData = await authResponse.json();
                if (!authData.username || !authData.password)
                    return router.replace('/login');
            }
            catch (error) { alert('An error has occured:\n' + error); }
        }

        const getData = async () => {
            try { 
                const started = await (
                    await fetch('/api/started')
                ).json();
                if(started.error) alert('Error fetching data.');
                setStarted(started.map((data: any) => {
                    return {
                        name: data.name,
                        location: {
                            lat: parseFloat(data.location.lat['$numberDecimal']),
                            lng: parseFloat(data.location.lng['$numberDecimal'])
                        }
                    }
                }));
      
                const finished = await (
                    await fetch(`/api/finished?username=${ encodeURIComponent('<|current|>') }`)
                ).json();
                if(finished.error) alert('Error fetching data.');
                setFinished(finished.map((data: any) => {
                    return {
                        name: data.name,
                        location: {
                            lat: parseFloat(data.location.lat['$numberDecimal']),
                            lng: parseFloat(data.location.lng['$numberDecimal'])
                        }
                    }
                }));

                const all = await (
                    await fetch('/api/locations')
                ).json();
                if(all.error) alert('Error fetching data.');
              
                let locArr: Array<location> = [];
                for(let i: number = 0; i < all.length; i++) 
                    if (
                        !started.includes(all[i]) &&
                        !finished.includes(all[i])
                    )
                        locArr.push({
                            name: all[i].name,
                            location: {
                                lat: parseFloat(all[i].location.lat['$numberDecimal']),
                                lng: parseFloat(all[i].location.lng['$numberDecimal'])
                            }
                        });
                setNew(locArr);
            } catch (error) {
                alert('Error fetching data: \n' + error);
            }
        };
        getData();
        verifyLogin();
    }, []);

    let refs: Array<React.RefObject<HTMLElement>> = [
        createRef<HTMLElement>(),
        createRef<HTMLElement>(),
        createRef<HTMLElement>()
    ];

    return (
        <>
            <Home 
                refs={ refs[0] }
                startedLocations={ startedLocations }
                newLocations={ newLocations }
            />
            <Map 
                refs={ refs[1] }
                startedLocations={ startedLocations }
            />
            <Profile 
                refs={ refs[2] }
            />
            <Navbar  refs={ refs } />
        </>
    )
};

export default Page;