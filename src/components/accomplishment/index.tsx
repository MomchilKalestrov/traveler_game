import type { accomplishment } from '@logic/types';
import style from './accomplishment.module.css';
import Image from 'next/image';

const Accomplishment = (props: { accomplishment: accomplishment }) => (
    <div className={ style.Accomplishment }>
        <Image
            alt={ props.accomplishment.location } width={ 40 } height={ 40 }
            src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ props.accomplishment.location  }.svg` }
        />
        <h3>{ props.accomplishment.user } got the { props.accomplishment.location } badge!</h3>
        <p>
            {
                new Date(props.accomplishment.time).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })
            }
        </p>
    </div>
);

export default Accomplishment;