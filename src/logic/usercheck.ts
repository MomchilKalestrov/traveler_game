'use server';
import { RootFilterQuery } from 'mongoose';

import connect from '@logic/mongoose/mongoose';
import user from '@logic/mongoose/user';
import session from '@logic/mongoose/session';

const userCheck = async (
    username?: string | undefined,
    sessionId?: string | undefined,
    query?: RootFilterQuery<any> | undefined
): Promise<boolean> => {
    if(!username || !sessionId)
        return false;

    try {
        await connect();
        const sessionExists = await session.findOne({ username, _id: sessionId });
        const userExists = await user.findOne({ ...query, username, verified: true });
        return sessionExists && userExists;
    } catch (error) {
        console.log(error);
        return false;
    };
};

export default userCheck;