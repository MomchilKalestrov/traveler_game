'use client'
import Navbar from '@components/navbar';
import Home from '@pages/home';
import Map from '@pages/map';
import Profile from '@pages/profile';
import Settings from '@pages/settings';
import LeaderBoard from '@pages/leaderboard';
import Header from '@components/header';
import React from 'react';
import { useRouter } from 'next/navigation';
import type { location, user } from '@logic/types';
import { getCookie } from '@logic/cookies';
import { CurrentUserCTX, UserLookupCTX, SettingsVisibleCTX, StartedLocationsCTX, ResetFetchCTX, NewLocationsCTX } from '@logic/context';
import { lookup } from 'dns';

const toLocation = (data: any): location => ({
    name: data.name,
    location: {
        lat: parseFloat(data.location.lat['$numberDecimal']),
        lng: parseFloat(data.location.lng['$numberDecimal'])
    },
    description: data.description,
    xp: data.xp
})

const Page = () => {
    const router             = useRouter();
    const abortControllerRef = React.useRef<AbortController | null>(null);
    const [ userData,         setUserData        ] = React.useState<user | undefined>(undefined);
    const [ userLookup,       setUserLookup      ] = React.useState<((username: string) => void) | undefined>(undefined);
    const [ settingsVisible,  setSettingsVisible ] = React.useState<boolean>(false);
    const [ startedLocations, setStarted         ] = React.useState<Array<location> | undefined>(undefined);
    const [ newLocations,     setNew             ] = React.useState<Array<location> | undefined>(undefined);
    const [ reset,            setReset           ] = React.useState<number>(0);

    const resetRender = () => setReset(reset + 1);

    React.useEffect(() => {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
            
        const verifyLogin = async () => {
            try {
                const data = await (await fetch(`/api/auth/get?username=${ encodeURIComponent('CURRENT_USER') }`)).json();
                const username = getCookie('username')?.value;
                const password = getCookie('password')?.value;
                if (!username || !password || data.error) {
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
                const started: any = await (
                    await fetch('/api/started', {
                        signal: abortControllerRef.current?.signal
                    })
                ).json();
                if(started.error || !started) throw Error('Error user started data.');

                const finished: any = await (
                    await fetch(`/api/finished?username=${ encodeURIComponent('CURRENT_USER') }`, {
                        signal: abortControllerRef.current?.signal
                    })
                ).json();
                if(finished.error || !finished) throw Error('Error user finished data.');
                
                const all: any = await (
                    await fetch('/api/locations', {
                        signal: abortControllerRef.current?.signal,
                        cache: 'force-cache',
                        next : { revalidate: 604800 } // revalidate every 7 days
                    })
                ).json();

                if(all.error || !all) throw Error('Error locations data.');
                let locArr: Array<location> = [];
                
                for(let i: number = 0; i < all.length; i++)
                    if (
                        !started.some((loc: location) => loc.name === all[i].name) &&
                        !finished.some((loc: location) => loc.location === all[i].name)
                    ) locArr.push(toLocation(all[i]));

                setStarted(started.map((data: any) => toLocation(data)));
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
        React.createRef<HTMLElement>(),
        React.createRef<HTMLElement>()
    ];

    return (
        <CurrentUserCTX.Provider value={ userData }>
        <UserLookupCTX.Provider value={ { lookup: userLookup, setLookup: setUserLookup } }>
        <SettingsVisibleCTX.Provider value={ { visible: settingsVisible, setVisible: setSettingsVisible } }>
        <StartedLocationsCTX.Provider value={ { locations: startedLocations, setLocations: setStarted } }>
        <NewLocationsCTX.Provider value={ { locations: newLocations, setLocations: setNew } }>
        <ResetFetchCTX.Provider value={ resetRender }>
            <Header />
            <Home refs={ refs[0] } />
            <Map refs={ refs[1] } />
            <Profile refs={ refs[2] } />
            <LeaderBoard refs={ refs[3] } />
            <Settings />
            <Navbar refs={ refs } />
        </ResetFetchCTX.Provider>
        </NewLocationsCTX.Provider>
        </StartedLocationsCTX.Provider>
        </SettingsVisibleCTX.Provider>
        </UserLookupCTX.Provider>
        </CurrentUserCTX.Provider>
    )
};

export default Page;