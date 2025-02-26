'use client';
import {
    Landmark,
    User,
    CommunityLandmark,
    toLandmark,
    toCommunityLandmark
} from '@logic/types';
import store from './store';

type fetchType = [
    Landmark[], Landmark[], Landmark[],
    User,
    {
        all: CommunityLandmark[],
        markedForVisit: CommunityLandmark[],
        visited: CommunityLandmark[]
    },
    CommunityLandmark[]
];

const fetchAllLandmarks = async (): Promise<any> =>
    await (await fetch(`/api/landmarks`)).json();

const fetchAllCommunityLandmarks = async (): Promise<any> =>
    await (await fetch(`/api/community-landmarks?includeStarted=true`)).json();

const fetchProfile = async (): Promise<User | undefined> =>
    (await fetch(`/api/auth/get?username=CURRENT_USER`))
        .json()
        .then(data => data.error ? undefined : data);

const fetchUserMadeLandmarks = async (): Promise<any> =>
    await (await fetch(`/api/auth/user-made-landmarks`)).json();

const getLandmarksMarkedToVisit = (allLandmarks: Landmark[], user: User): Landmark[] =>
    allLandmarks.filter((landmark: Landmark) => user.markedForVisit.includes(landmark.dbname));

const getVisitedLandmarks = (allLandmarks: Landmark[], user: User): Landmark[] =>
    allLandmarks.filter((landmark: Landmark) => user.visited.find(({ dbname }) => landmark.dbname === dbname));

const getNewLandmarks = (allLandmarks: Landmark[], user: User): Landmark[] =>
    allLandmarks.filter((landmark: Landmark) =>
        !user.markedForVisit.includes(landmark.dbname) &&
        !user.visited.find(({ dbname }) => landmark.dbname === dbname)
    );

const getCommunityLandmarksMarkedForVisit = (allCommunityLandmarks: CommunityLandmark[], user: User): CommunityLandmark[] => {
    const names = user.markedForVisit.reduce<string[]>((acc: string[], curr: string) => {
        if (curr.split('#')[0] === 'community')
            acc.push(curr.split('#')[1]);
        return acc;
    }, []);
    return allCommunityLandmarks.filter((landmark: CommunityLandmark) => names.includes(landmark.name));
};

const getVisitedCommunityLandmarks = (allCommunityLandmarks: CommunityLandmark[], user: User): CommunityLandmark[] => {
    const names = user.visited.reduce<string[]>((acc: string[], { dbname }) => {
        if (dbname.split('#')[0] === 'community')
            acc.push(dbname.split('#')[1]);
        return acc;
    }, []);
    return allCommunityLandmarks.filter((landmark: CommunityLandmark) => names.includes(landmark.name));
};

const getNewCommunityLandmarks = (
    allCommunityLandmarks: CommunityLandmark[],
    communityLandmarksMarkedForVisit: CommunityLandmark[],
    visitedCommunityLandmarks: CommunityLandmark[]
): CommunityLandmark[] =>
    allCommunityLandmarks.filter((landmark: CommunityLandmark) =>
        !communityLandmarksMarkedForVisit.find(l => l.name === landmark.name) &&
        !visitedCommunityLandmarks.find(l => l.name === landmark.name)
    );

const save = (key: string, value: any) =>
    sessionStorage.setItem(key, JSON.stringify(value));

const get = (key: string): any => 
    JSON.parse(sessionStorage.getItem(key) || 'null');

const cast = (object: any): Landmark[] => 
    Array.isArray(object) ? object.map(toLandmark) : [];

const castCommunity = (object: any): CommunityLandmark[] =>
    Array.isArray(object) ? object.map(toCommunityLandmark) : [];

const initialSave = async (): Promise<fetchType> => {
    const user = await fetchProfile();
    if (!user) throw new Error('Error fetching user data.');

    console.log('User:', user);
    console.log(await fetchAllLandmarks());
    const all = cast(await fetchAllLandmarks());
    const markedForVisit = getLandmarksMarkedToVisit(all, user);
    const visited = getVisitedLandmarks(all, user);

    const communityAll = castCommunity(await fetchAllCommunityLandmarks());
    const communityMarkedForVisit = getCommunityLandmarksMarkedForVisit(communityAll, user);
    const communityVisited = getVisitedCommunityLandmarks(communityAll, user);

    const userMade = castCommunity(await fetchUserMadeLandmarks());
    
    save('initialSave', true);
    
    return [
        markedForVisit, all, visited, 
        user, 
        {
            all: communityAll,
            markedForVisit: communityMarkedForVisit,
            visited: communityVisited
        },
        userMade
    ];
};

const saveToSessionStorage = (state: any) => {
    for (const key in state)
        save(key, state[key].value);
};

const getFromSessionStorage = (): Promise<fetchType> => {
    if (!get('initialSave'))
        return initialSave();
    else return new Promise((resolve) =>
        resolve([
            get('landmarksMarkedForVisit'),
            get('allLandmarks'),
            get('visitedLandmarks'),
    
            get('user'),
    
            get('communityMadeLandmarks'),
            
            get('userMadeLandmarks')
        ])
    );
};

const preloadFromSessionStorage = async (): Promise<void> => {
    const [
        started, all, finished,
        user,
        community,
        custom
    ] = await getFromSessionStorage();

    console.log(community);

    store.dispatch({ type: 'landmarksMarkedForVisit/update', payload: started });
    store.dispatch({ type: 'newLandmarks/update', payload: getNewLandmarks(all, user) });
    store.dispatch({ type: 'allLandmarks/update', payload: all });
    store.dispatch({ type: 'visitedLandmarks/update', payload: finished });

    store.dispatch({ type: 'user/update', payload: user });

    console.log(community)
    store.dispatch({ type: 'communityMadeLandmarks/updateMarkedForVisit', payload: community.markedForVisit });
    store.dispatch({ type: 'communityMadeLandmarks/updateNew', payload: getNewCommunityLandmarks(community.all, community.markedForVisit, community.visited) });
    store.dispatch({ type: 'communityMadeLandmarks/updateAll', payload: community.all });
    store.dispatch({ type: 'communityMadeLandmarks/updateVisited', payload: community.visited });

    store.dispatch({ type: 'userMadeLandmarks/update', payload: custom });
}

export { saveToSessionStorage, preloadFromSessionStorage };