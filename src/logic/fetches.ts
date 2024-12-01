'use client';
import { Location, User } from '@logic/types';

const fetchStarted = async (locale: string): Promise<any> => 
    await (await fetch(`/api/started?locale=${ locale }`)).json();

const fetchFinished = async (locale: string): Promise<any> => 
    await (await fetch(`/api/finished?locale=${ locale }`)).json();

const fetchAll = async (locale: string): Promise<any> =>
    await (await fetch(`/api/locations?locale=${ locale }`)).json();

const filterNew = (started: Location[], finished: Location[], all: Location[]): Location[] => 
    all.filter((la: Location) =>
        !finished.some((lf: Location) => lf.name === la.name) &&
        !started.some((ls: Location) => ls.name === la.name)
    );

const fetchProfile = async (locale: string): Promise<User | boolean> => {
    const data = await (await fetch(`/api/auth/get?username=CURRENT_USER&locale=${ locale }`)).json();
    return data.error ? false : data;
};

export { fetchStarted, fetchFinished, fetchAll, filterNew, fetchProfile };