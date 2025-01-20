import mongoose from 'mongoose';
import { Location } from '@logic/types';

const availableLocales = [ 'en', 'bg' ];

const localeSchema: mongoose.Schema = new mongoose.Schema({
    language: { type: String, required: true },
    name:   { type: String, required: true },
    description: { type: String }
}, { _id: false, versionKey: false });


const locationSchema: mongoose.Schema = new mongoose.Schema({
    locales: [ localeSchema ],
    location: { type: {
        lat: mongoose.Types.Decimal128,
        lng: mongoose.Types.Decimal128
    }, required: true },
    xp: Number,
    type: { type: String, default: 'misc' }
}, { versionKey: false });

interface LocationDocument extends Location, mongoose.Document { };

const db = mongoose.connection.useDb('TestDB');
const locations =  db.models.Location || db.model<LocationDocument>('Location', locationSchema);

export { availableLocales };
export default locations;