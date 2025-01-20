import mongoose from 'mongoose';
import { Location } from '@logic/types';

const availableLocales = [ 'en', 'bg' ];

const communityMadeLocationSchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },

    location: { type: {
        lat: mongoose.Types.Decimal128,
        lng: mongoose.Types.Decimal128
    }, required: true },

    likes: { type: [ String ], default: [] },
    visits: { type: Number, default: 0 },
}, { versionKey: false });

interface CommunityMadeLocationDocument extends Location, mongoose.Document { };

const db = mongoose.connection.useDb('TestDB');
const communityMadeLocations =  db.models.CommunityMadeLocation || db.model<CommunityMadeLocationDocument>('CommunityMadeLocation', communityMadeLocationSchema);

export { availableLocales };
export default communityMadeLocations;