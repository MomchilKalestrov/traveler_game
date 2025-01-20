'use server';
import connect from '@logic/mongoose/mongoose';
import users   from '@logic/mongoose/user';
import { RootFilterQuery } from 'mongoose';

const userCheck = async (
    username?: string | undefined,
    password?: string | undefined,
    query?: RootFilterQuery<any> | undefined
): Promise<boolean> => {
    if(!username || !password)
        return false;

    try {
        await connect();
        const user = await users.findOne({ username: username, password: password, verified: true, ...query });
        return !!user;
    } catch (error) {
        console.log(error);
        return false;
    };
};

export default userCheck;