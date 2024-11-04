'use server';
import { MongoClient } from 'mongodb';

const userCheck = async (username: string, password: string): Promise<boolean> => {
    const client = new MongoClient(process.env.MONGODB_URI as string);

    if(!username || !password)
        return false;

    try {
        await client.connect();
        const userCollection = client.db('TestDB').collection('UserCollection');

        const user = (await userCollection.aggregate([{
            $match: { username: username }
        }]).toArray())[0];

        await client.close(true);
        return (user && user.password === password);
    }
    catch (error) {
        console.log(error);
        await client.close(true);
        return false;
    };
};

export default userCheck;