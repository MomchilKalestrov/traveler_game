'use client';
import { toLocation }     from '@logic/types';
import { Location, User } from '@logic/types';
import store              from './store';

type fetchType = [ Location[], Location[], Location[], User ];

const fetchAll = async (): Promise<any> =>
    await (await fetch(`/api/locations`)).json();

const fetchProfile = async (): Promise<User | undefined> =>
    (await fetch(`/api/auth/get?username=CURRENT_USER`))
        .json()
        .then(data => data.error ? undefined : data)

const getStarted = (all: Location[], user: User): Location[] =>
    all.filter((l: Location) => user.started.includes(l.dbname));

const getFinished = (all: Location[], user: User): Location[] =>
    all.filter((l: Location) => user.finished.find(f => f.location === l.dbname));

const getNew = (all: Location[], user: User): Location[] =>
    all.filter((l: Location) =>
        !user.started.includes(l.dbname) &&
        !user.finished.find(f => f.location === l.dbname)
    );

const save = (key: string, value: any) =>
    sessionStorage.setItem(key, JSON.stringify(value));

const get = (key: string): any => 
    JSON.parse(sessionStorage.getItem(key) || 'null');

const cast = (object: any): Location[] => 
    Array.isArray(object) ? object.map(toLocation) : [];

const initialSave = async (): Promise<fetchType> => {
    const user = await fetchProfile();

    if (!user)
        throw new Error('Error fetching user data.');

    const all      = cast(await fetchAll());
    const started  = getStarted(all, user);
    const finished = getFinished(all, user);

    save('started',     started);
    save('all',         all);
    save('finished',    finished)
    save('user',        user);
    save('initialSave', true);
    
    return [ started, all, finished, user ];
}

const saveToSessionStorage = (state: any) => {
    for (const key in state)
        save(key, state[key].value);
};

const getFromSessionStorage = async (): Promise<fetchType> => {
    if (!get('initialSave'))
        return await initialSave();
    else return [
        get('started'),
        get('all'),
        get('finished'),
        get('user')
    ];
};

const preloadFromSessionStorage = async (): Promise<void> => {
    const [ started, all, finished, user ] = await getFromSessionStorage();
    store.dispatch({
        type: 'started/update',
        payload: started
    });
    store.dispatch({
        type: 'new/update',
        payload: getNew(all, user)
    });
    store.dispatch({
        type: 'user/update',
        payload: user
    });
    store.dispatch({
        type: 'all/update',
        payload: all
    });
    store.dispatch({
        type: 'finished/update',
        payload: finished
    });
}

export { saveToSessionStorage, preloadFromSessionStorage };