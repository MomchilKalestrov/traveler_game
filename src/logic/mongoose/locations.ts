import mongoose from 'mongoose';
import { Location } from '@logic/types';

const locationSchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    location: { type: {
        lat: mongoose.Types.Decimal128,
        lng: mongoose.Types.Decimal128
    }, required: true },
    description: String,
    xp: Number
});

interface LocationDocument extends Location, mongoose.Document { };

const db = mongoose.connection.useDb('TestDB');
const locations =  db.models.User || db.model<LocationDocument>('User', locationSchema, 'LocationCollection');

export default locations;