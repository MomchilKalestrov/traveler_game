import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import userCheck from '@logic/usercheck';
import { User } from '@logic/types';

import connect from '@logic/mongoose/mongoose';
import user from '@logic/mongoose/user';
import communityMadeLandmark from '@logic/mongoose/communityMadeLandmark';


const filterCommunityLandmarks = (user: User): string[] =>
    user.markedForVisit.reduce<string[]>((acc: string[], curr: string) => {
        if (curr.split('#')[0] === 'community')
            acc.push(curr.split('#')[1]);
        return acc;
    }, []);

const filterDuplicates = (allLandmarks: any[]): any[] => {
    const seen = new Set<string>();
    return allLandmarks.filter(landmark => {
        const duplicate = seen.has(landmark.name);
        seen.add(landmark.name);
        return !duplicate;
    });
};

const GET = async (request: NextRequest) => {
    const params = new URL(request.url).searchParams;
    const skip = parseInt(params.get('skip') || '0');
    const includeMarkedForVisit = params.get('includeMarkedForVisit') === 'true';

    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const sessionId = cookie.get('sessionId')?.value;

    if (!(await userCheck(username, sessionId)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        await connect();
        
        let all: any[] = [];
        all = await communityMadeLandmark
            .find({ author: { $ne: username } }, { __v: 0 })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(includeMarkedForVisit ? 10 : 5) as any[];
            
        if (!includeMarkedForVisit) return NextResponse.json(all, { status: 200 });
        
        const markedForVisitNames = filterCommunityLandmarks(await user.findOne({ username }) as User);
        const markedForVisitData = await communityMadeLandmark.find({ name: { $in: markedForVisitNames } }, { __v: 0 })
        all = all.concat(markedForVisitData);
        
        return NextResponse.json(filterDuplicates(all), { status: 200 });
    } catch (error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };