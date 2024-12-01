import React from 'react';
import Image from 'next/image';
import { Accomplishment, Language } from '@logic/types';
import LanguageCTX from '@logic/contexts/languageCTX';
import style from './accomplishment.module.css';

type AccomplishmentTagProps = {
    accomplishment: Accomplishment;
};

const AccomplishmentTag: React.FC<AccomplishmentTagProps> = ({ accomplishment }) => {
    const language: Language | undefined = React.useContext(LanguageCTX);
    return (
        <div className={ style.Accomplishment }>
            <Image
                alt={ accomplishment.location } width={ 40 } height={ 40 }
                src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ accomplishment.dbname  }.svg` }
            />
            <h3>
                {
                    language?.misc.accomplishment.title
                        .replace('{NAME}', accomplishment.user)
                        .replace('{LOCATION}', accomplishment.location)
                }
            </h3>
            <p>
                {
                    new Date(accomplishment.time).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })
                }
            </p>
        </div>
    );
};

export default AccomplishmentTag;