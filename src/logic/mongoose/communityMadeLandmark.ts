import mongoose from 'mongoose';
import { Landmark } from '@logic/types';

const availableLocales = [ 'en', 'bg' ];

const communityMadeLandmarkSchema: mongoose.Schema = new mongoose.Schema({
    name:     { type: String, required: true },
    author:   { type: String, required: true },

    location: { type: {
        lat: mongoose.Types.Decimal128,
        lng: mongoose.Types.Decimal128
    }, required: true },

    likes:    { type: [ String ], default: [] },
    visits:   { type: Number, default: 0 },
}, { versionKey: false });

interface CommunityMadeLandmarkDocument extends Landmark, mongoose.Document { };

const db = mongoose.connection;
const communityMadeLandmark =  db.models.CommunityMadeLandmark || db.model<CommunityMadeLandmarkDocument>('CommunityMadeLandmark', communityMadeLandmarkSchema);

export { availableLocales };
export default communityMadeLandmark;