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
import { CurrentUserCTX, SettingsVisibleCTX, StartedLocationsCTX, ResetFetchCTX, NewLocationsCTX } from '@logic/context';

const fetchStarted = async (signal: AbortSignal): Promise<any> => 
    await (await fetch('/api/started', { signal: signal })).json();

const fetchFinished = async (signal: AbortSignal): Promise<any> => 
    await (await fetch(`/api/finished?username=CURRENT_USER`, { signal: signal })).json();

const fetchAll = async (signal: AbortSignal): Promise<any> =>
    await (
        await fetch('/api/locations', {
            signal: signal,
            cache: 'force-cache',
            next : { revalidate: 604800 } // revalidate every 7 days
        })
    ).json();

const filterNew = (started: Array<location>, finished: Array<location>, all: Array<location>): Array<location> => 
    all.filter((loc: location) =>
        !finished.some((l: location) => l.name === loc.name) &&
        !started.some((l: location) => l.name === loc.name)
    );

const fetchProfile = async (): Promise<user | boolean> => {
    const data = await (await fetch(`/api/auth/get?username=CURRENT_USER`)).json();
    return data.error ? false : data;
}

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
    const [ settingsVisible,  setSettingsVisible ] = React.useState<boolean>(false);
    const [ startedLocations, setStarted         ] = React.useState<Array<location> | undefined>(undefined);
    const [ newLocations,     setNew             ] = React.useState<Array<location> | undefined>(undefined);
    const [ reset,            setReset           ] = React.useState<number>(0);

    const resetRender = () => setReset(reset + 1);

    React.useEffect(() => {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
            
        const verifyProfile = async () => {
            try {
                const data: user | boolean = await fetchProfile();
                if (!data) {
                    abortControllerRef.current?.abort();
                    return router.replace('/login');
                }
                setUserData(data as user);
            }
            catch (error) {
                alert('Error fetching user data: \n' + error);
            };
        }

        const getData = async () => {
            if (!abortControllerRef.current) return;
            try {
                const started: any = await fetchStarted(abortControllerRef.current.signal);
                if(started.error || !started) throw Error('Error user started data.');

                const finished: any = await fetchFinished(abortControllerRef.current.signal);
                if(finished.error || !finished) throw Error('Error user finished data.');
                
                const all: any = await fetchAll(abortControllerRef.current.signal);
                if(all.error || !all) throw Error('Error locations data.');
                
                setStarted(started.map(toLocation));
                setNew(filterNew(started, finished, all));

                document.getElementById('loading')?.remove();
            } catch (error) {
                console.log('Error fetching data: \n' + error);
            };
        };
        
        verifyProfile();
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
        </CurrentUserCTX.Provider>
    )
};

export default Page;