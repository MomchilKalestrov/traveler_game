import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import connect from '@logic/mongoose/mongoose';
import user from '@logic/mongoose/user';
import communityMadeLocations from '@logic/mongoose/communityMadeLocations';
import userCheck from '@logic/usercheck';
import { User } from '@src/logic/types';


const filterCommunityLocations = (user: User): string[] =>
    user.started.reduce<string[]>((acc: string[], curr: string) => {
        if (curr.split('#')[0] === 'community')
            acc.push(curr.split('#')[1]);
        return acc;
    }, []);

const filterDuplicates = (all: any[]): any[] => {
    const seen = new Set<string>();
    return all.filter(location => {
        const duplicate = seen.has(location.name);
        seen.add(location.name);
        return !duplicate;
    });
};

const GET = async (request: NextRequest) => {
    const params = new URL(request.url).searchParams;
    const skip = parseInt(params.get('skip') || '0');
    const includeStarted = params.get('includeStarted') === 'true';

    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const password = cookie.get('password')?.value;

    if (!(await userCheck(username, password)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        await connect();

        const started = filterCommunityLocations(await user.findOne({ username }) as User);
        
        let all: any[] = [];

        all = await communityMadeLocations
            .find({ author: { $ne: username } }, { __v: 0 })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(includeStarted ? 10 : 5) as any[];
            
        if (!includeStarted) return NextResponse.json(all, { status: 200 });

        all = all.concat(await communityMadeLocations.find({ name: { $in: started } }, { __v: 0 }));
        
        return NextResponse.json(filterDuplicates(all), { status: 200 });
    } catch (error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };