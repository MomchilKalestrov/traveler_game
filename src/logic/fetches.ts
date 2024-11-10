'use client';
import { Location, User } from '@logic/types';

const fetchStarted = async (): Promise<any> => 
    await (await fetch('/api/started?username=CURRENT_USER')).json();

const fetchFinished = async (): Promise<any> => 
    await (await fetch(`/api/finished?username=CURRENT_USER`)).json();

const fetchAll = async (): Promise<any> =>
    await (await fetch('/api/locations')).json();

const filterNew = (started: Location[], finished: Location[], all: Location[]): Location[] => 
    all.filter((la: Location) =>
        !finished.some((lf: Location) => lf.name === la.name) &&
        !started.some((ls: Location) => ls.name === la.name)
    );

const fetchProfile = async (): Promise<User | boolean> => {
    const data = await (await fetch(`/api/auth/get?username=CURRENT_USER`)).json();
    return data.error ? false : data;
};

export { fetchStarted, fetchFinished, fetchAll, filterNew, fetchProfile };