'use client';
import {
    Location,
    User,
    CommunityLocation,
    toLocation,
    toCommunityLocation
} from '@logic/types';
import store from './store';

type fetchType = [
    Location[], Location[], Location[],
    User,
    {
        all: CommunityLocation[],
        started: CommunityLocation[],
        finished: CommunityLocation[]
    },
    CommunityLocation[]
];

const fetchAll = async (): Promise<any> =>
    await (await fetch(`/api/locations`)).json();

const fetchAllCommunity = async (): Promise<any> =>
    await (await fetch(`/api/community-locations?includeStarted=true`)).json();

const fetchProfile = async (): Promise<User | undefined> =>
    (await fetch(`/api/auth/get?username=CURRENT_USER`))
        .json()
        .then(data => data.error ? undefined : data);

const fetchCustom = async (): Promise<any> =>
    await (await fetch(`/api/auth/custom-locations`)).json();

const getStarted = (all: Location[], user: User): Location[] =>
    all.filter((l: Location) => user.started.includes(l.dbname));

const getFinished = (all: Location[], user: User): Location[] =>
    all.filter((l: Location) => user.finished.find(f => f.location === l.dbname));

const getNew = (all: Location[], user: User): Location[] =>
    all.filter((l: Location) =>
        !user.started.includes(l.dbname) &&
        !user.finished.find(f => f.location === l.dbname)
    );

const getCommunityStarted = (all: CommunityLocation[], user: User): CommunityLocation[] => {
    const started = user.started.reduce<string[]>((acc: string[], curr: string) => {
        if (curr.split('#')[0] === 'community')
            acc.push(curr.split('#')[1]);
        return acc;
    }, []);
    return all.filter((location: CommunityLocation) => started.includes(location.name));
};

const getCommunityFinished = (all: CommunityLocation[], user: User): CommunityLocation[] => {
    const finished = user.finished.reduce<string[]>((acc: string[], curr: any) => {
        if (curr.location.split('#')[0] === 'community')
            acc.push(curr.location.split('#')[1]);
        return acc;
    }, []);
    return all.filter((location: CommunityLocation) => finished.includes(location.name));
};

const getCommunityNew = (
    all: CommunityLocation[],
    started: CommunityLocation[],
    finished: CommunityLocation[]
): CommunityLocation[] =>
    all.filter((location: CommunityLocation) =>
        !started.find(l => l.name === location.name) &&
        !finished.find(l => l.name === location.name)
    );

const save = (key: string, value: any) =>
    sessionStorage.setItem(key, JSON.stringify(value));

const get = (key: string): any => 
    JSON.parse(sessionStorage.getItem(key) || 'null');

const cast = (object: any): Location[] => 
    Array.isArray(object) ? object.map(toLocation) : [];

const castCommunity = (object: any): CommunityLocation[] =>
    Array.isArray(object) ? object.map(toCommunityLocation) : [];

const initialSave = async (): Promise<fetchType> => {
    const user = await fetchProfile();
    if (!user) throw new Error('Error fetching user data.');

    const all = cast(await fetchAll());
    const started = getStarted(all, user);
    const finished = getFinished(all, user);

    const communityAll = castCommunity(await fetchAllCommunity());
    const communityStarted = getCommunityStarted(communityAll, user);
    const communityFinished = getCommunityFinished(communityAll, user);

    const custom = castCommunity(await fetchCustom());
    
    save('initialSave', true);

    return [
        started, all, finished, 
        user, 
        {
            all: communityAll,
            started: communityStarted,
            finished: communityFinished
        },
        custom
    ];
};

const saveToSessionStorage = (state: any) => {
    for (const key in state)
        save(key, state[key].value);
};

const getFromSessionStorage = (): Promise<fetchType> => {
    if (!get('initialSave'))
        return initialSave();
    else return new Promise((resolve) => {
        resolve([
            get('started'),
            get('all'),
            get('finished'),
    
            get('user'),
    
            get('community'),
            
            get('custom')
        ]);
    });
};

const preloadFromSessionStorage = async (): Promise<void> => {
    const [
        started, all, finished,
        user,
        community,
        custom
    ] = await getFromSessionStorage();

    store.dispatch({ type: 'started/update', payload: started });
    store.dispatch({ type: 'new/update', payload: getNew(all, user) });
    store.dispatch({ type: 'all/update', payload: all });
    store.dispatch({ type: 'finished/update', payload: finished });

    store.dispatch({ type: 'user/update', payload: user });

    store.dispatch({ type: 'community/updateStarted', payload: community.started });
    store.dispatch({ type: 'community/updateNew', payload: getCommunityNew(community.all, community.started, community.finished) });
    store.dispatch({ type: 'community/updateAll', payload: community.all });
    store.dispatch({ type: 'community/updateFinished', payload: community.finished });

    store.dispatch({ type: 'custom/update', payload: custom });
}

export { saveToSessionStorage, preloadFromSessionStorage };