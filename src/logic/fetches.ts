'use client';
import { toLocation } from './types';
import type { location, user } from '@logic/types';

const fetchStarted = async (): Promise<any> => 
    await (await fetch('/api/started')).json();

const fetchFinished = async (): Promise<any> => 
    await (await fetch(`/api/finished?username=CURRENT_USER`)).json();

const fetchAll = async (): Promise<any> =>
    await (
        await fetch('/api/locations', {
            cache: 'force-cache',
            next : { revalidate: 604800 } // revalidate every 7 days
        })
    ).json();

const filterNew = (started: location[], finished: location[], all: location[]): location[] => 
    all.filter((la: location) =>
        !finished.some((lf: location) => lf.name === la.name) &&
        !started.some((ls: location) => ls.name === la.name)
    );

const fetchProfile = async (): Promise<user | boolean> => {
    const data = await (await fetch(`/api/auth/get?username=CURRENT_USER`)).json();
    return data.error ? false : data;
};

const save = (key: string, value: any, isArray?: boolean) =>
    sessionStorage.setItem(key, JSON.stringify(!isArray ? value : value.map(toLocation)));

const get = (key: string): any => 
    JSON.parse(sessionStorage.getItem(key) || 'null');

const initialSave = async () => {    
    const fetches = await Promise.all([
        fetchStarted(),
        fetchFinished(),
        fetchAll(),
        fetchProfile()
    ]);

    save('started', fetches[0], true);
    save('finished', fetches[1], true);
    save('all', fetches[2], true);
    save('user', fetches[3]);
    save('initialSave', true);
    
    return fetches;
};

const saveData = async () =>
    !get('initialSave')
        ? await initialSave()
        : [
            get('started'),
            get('finished'),
            get('all'),
            get('user')
        ];

export { fetchStarted, fetchFinished, fetchAll, filterNew, fetchProfile, saveData };