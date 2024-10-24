import React from 'react';
import type { user, location } from '@logic/types';

const CurrentUserCTX = React.createContext<user | undefined>(undefined);

const UserLookupCTX = React.createContext<{
    visible: user | boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean | user>>
} | undefined>(undefined);

const SettingsVisibleCTX = React.createContext<{
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
} | undefined>(undefined);

const StartedLocationsCTX = React.createContext<{
    locations: Array<location> | undefined,
    setLocations: React.Dispatch<React.SetStateAction<Array<location> | undefined>>
} | undefined>(undefined);

const NewLocationsCTX = React.createContext<{
    locations: Array<location> | undefined,
    setLocations: React.Dispatch<React.SetStateAction<Array<location> | undefined>>
} | undefined>(undefined);

const ResetFetchCTX = React.createContext<(() => void) | undefined>(undefined);

export { CurrentUserCTX, UserLookupCTX, SettingsVisibleCTX, StartedLocationsCTX, ResetFetchCTX, NewLocationsCTX };