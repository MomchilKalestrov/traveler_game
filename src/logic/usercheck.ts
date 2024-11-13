'use server';
import connect from '@logic/mongoose/mongoose';
import users   from '@logic/mongoose/user';

const userCheck = async (username?: string | undefined, password?: string | undefined): Promise<boolean> => {
    if(!username || !password)
        return false;

    try {
        await connect();
        const user = await users.findOne({ username: username, password: password })
        return user ? true : false;
    } catch (error) {
        console.log(error);
        return false;
    };
};

export default userCheck;