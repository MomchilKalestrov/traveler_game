import mongoose from 'mongoose';
import { User } from '@logic/types';

const finishedLocationSchema: mongoose.Schema = new mongoose.Schema({
    location: String,
    time: Number
}, { _id: false, versionKey: false });

const userSchema: mongoose.Schema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    finished: { type: [ finishedLocationSchema ], default: [] },
    started: { type: [ String ], default: [] },
    followers: { type: [ String ], default: [] },
    following: { type: [ String ], default: [] },
    xp: { type: Number, default: 0 },
}, { versionKey: false, _id: false });

interface UserDocument extends User, mongoose.Document { };

const db = mongoose.connection.useDb('TestDB');
const users = db.models.User || db.model<UserDocument>('User', userSchema, 'UserCollection');

export default users;