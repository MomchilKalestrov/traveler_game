import mongoose from 'mongoose';
import { Location } from '@logic/types';

const locationSchema: mongoose.Schema = new mongoose.Schema({
    name: String,
    location: {
        lat: Number,
        lng: Number
    },
    description: String,
    xp: Number
});

interface LocationDocument extends Location, mongoose.Document { };

const LocationModel = mongoose.models.Location || mongoose.model<LocationDocument>('Location', locationSchema, 'LocationCollection');

export default LocationModel;