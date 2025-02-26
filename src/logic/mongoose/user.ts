import mongoose from 'mongoose';
import { User } from '@logic/types';

const visitedLandmarkSchema: mongoose.Schema = new mongoose.Schema({
    dbname: String,
    time: Number
}, { _id: false, versionKey: false });

const userSchema: mongoose.Schema = new mongoose.Schema({
    email:     { type: String,  unique:   true, required: true },
    verified:  { type: Boolean, default:  false },
    username:  { type: String,  unique:   true, required: true },
    password:  { type: String,  required: false },

    visited:   { type: [ visitedLandmarkSchema ], default: [] },
    markedForVisit: { type: [ String ], default: [] },

    followers: { type: [ String ], default: [] },
    following: { type: [ String ], default: [] },

    xp: { type: Number, default: 0 },
}, { versionKey: false });

interface UserDocument extends User, mongoose.Document { };

const db = mongoose.connection;
const user = db.models.User || db.model<UserDocument>('User', userSchema);

export default user;