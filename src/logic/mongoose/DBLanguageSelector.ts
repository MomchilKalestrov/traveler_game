import { PipelineStage } from "mongoose";

const localeSelector = (locale: string): PipelineStage[] => [
    { $addFields: { localesType: { $type: '$locales' } } },
    { $match: {
        localesType: 'array'
    } },
    { $project: {
        locales: {
            $filter: {
                input: '$locales',
                as: 'locale',
                cond: { $eq: ['$$locale.language', locale] }
            }
        },
        location: 1,
        xp: 1,
        minlevel: 1
    } },
    { $project: {
        name: { $arrayElemAt: ['$locales.name', 0] },
        description: { $arrayElemAt: ['$locales.description', 0] },
        location: 1,
        xp: 1,
        minlevel: 1
    } }
];

export default localeSelector;