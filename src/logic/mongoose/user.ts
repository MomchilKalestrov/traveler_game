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

const UserModel = mongoose.model<UserDocument>('Location', UserSchema);

export default UserModel;