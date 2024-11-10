import mongoose from 'mongoose';
import { User } from '@logic/types';

const UserSchema: mongoose.Schema = new mongoose.Schema({
    username: String,
    finished: [ {
        location: String,
        time: Number
    } ],
    started: [ String ],
    followers: [ String ],
    following: [ String ],
    xp: Number
});

interface UserDocument extends User, mongoose.Document { };

const UserModel = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema, 'UserCollection');

export default UserModel;