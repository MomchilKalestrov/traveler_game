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

export { fetchStarted, fetchFinished, fetchAll, filterNew, fetchProfile };