import mongoose from 'mongoose';

const oneMonth: number = 60 * 60 * 24 * 30;

const sessionSchema: mongoose.Schema = new mongoose.Schema({
    username: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, expires: oneMonth }
}, { versionKey: false });

interface SessionDocument extends mongoose.Document {
    name:      string;
    sessionId: string;
    expireAt:  Date;
};

const db = mongoose.connection;
const session = db.models.Session || db.model<SessionDocument>('Session', sessionSchema);

export default session;