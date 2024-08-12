import { MongoClient } from 'mongodb';

const userCheck = async (username: string, password: string): Promise<boolean> => {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    let result: boolean = false;

    if(!username || !password)
        return false;

    try {
        await client.connect();
        const db = client.db("TestDB");
        const collection = db.collection("TestCollection");

        const user = (await collection.aggregate([{
            $match: { username: username }
        }]).toArray())[0];

        result = (!user || user.password !== password);
    }
    catch (error) {
        console.log(error);
        client.close();
        result = false;
    }

    return result;
}

export default userCheck;