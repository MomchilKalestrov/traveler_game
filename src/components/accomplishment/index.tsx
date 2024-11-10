import Image from 'next/image';
import { Accomplishment } from '@logic/types';
import style from './accomplishment.module.css';

type AccomplishmentTagProps = {
    accomplishment: Accomplishment;
};

const AccomplishmentTag: React.FC<AccomplishmentTagProps> = ({ accomplishment }) => (
    <div className={ style.Accomplishment }>
        <Image
            alt={ accomplishment.location } width={ 40 } height={ 40 }
            src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ accomplishment.location  }.svg` }
        />
        <h3>{ accomplishment.user } got the { accomplishment.location } badge!</h3>
        <p>
            {
                new Date(accomplishment.time).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })
            }
        </p>
    </div>
);

export default AccomplishmentTag;