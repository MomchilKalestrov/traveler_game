'use client'
import React   from 'react';
import dynamic from 'next/dynamic';
import { NextPage }    from 'next';
import { useSelector } from 'react-redux';

import { RootState } from '@logic/redux/store';
import { Language, Location, CommunityLocation }  from '@logic/types';
import LanguageCTX from '@logic/contexts/languageCTX';

import LoadingPlaceholder from '@components/loading';
import Dialog from '@components/dialog';

type AllLocation = Location | CommunityLocation;

const Page: NextPage = () => {
    const language: Language | undefined = React.useContext(LanguageCTX);

    const started:   AllLocation[] | undefined = useSelector((state: RootState) => state.started.value);
    const community: AllLocation[] | undefined = useSelector((state: RootState) => state.community.value).started;

    const [ allowGPS, setPermission ] = React.useState<boolean>(true);
    const [ request,  setRequest    ] = React.useState<boolean>(false);

    const Map = React.useMemo(() => dynamic(
        () => import('./map'), {
            loading: () => (<LoadingPlaceholder />),
            ssr: false
        }
    ), []);

    React.useEffect(() => {
        navigator.permissions.query({ name: 'geolocation' })
            .then((permission) =>
                setRequest(permission.state !== 'granted')
            );
    }, []);

    const setRequestPermission = (hasGPSAccess: boolean): void =>
        setPermission(hasGPSAccess);

    if (!language) return (<LoadingPlaceholder />);

    return (
        <main style={ { padding: '0px', height: 'calc(100vh - 5rem)' } }>
        {
            request &&
            <Dialog
                title={ language.misc.GPSaccess.title }
                description={ language.misc.GPSaccess.description }
                options={ [ {
                    name: language.misc.GPSaccess.decline,
                    event: () => setRequestPermission(false)
                }, {
                    name: language.misc.GPSaccess.accept,
                    event: () => {
                        navigator.geolocation.getCurrentPosition(
                            () => setRequestPermission(true),
                            () => setRequestPermission(false)
                        );
                    },
                    primary: true
                } ] }
                close={ setRequest }
            />
        }
            <Map locations={ started?.concat(community || []) } hasGPSAccess={ allowGPS } />
        </main>
    );
};

export default Page;
