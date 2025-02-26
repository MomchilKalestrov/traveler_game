import mongoose from 'mongoose';
import { Landmark } from '@logic/types';

const availableLocales = [ 'en', 'bg' ];

const localeSchema: mongoose.Schema = new mongoose.Schema({
    language: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String }
}, { _id: false, versionKey: false });


const landmarkSchema: mongoose.Schema = new mongoose.Schema({
    locales: [ localeSchema ],
    location: { type: {
        lat: mongoose.Types.Decimal128,
        lng: mongoose.Types.Decimal128
    }, required: true },
    xp: Number,
    type: { type: String, default: 'misc' }
}, { versionKey: false });

interface LandmarkDocument extends Landmark, mongoose.Document { };

const db = mongoose.connection;
const landmark =  db.models.Landmark || db.model<LandmarkDocument>('Landmark', landmarkSchema);

export { availableLocales };
export default landmark;