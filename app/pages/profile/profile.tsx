'use client';
import React from 'react';
import style from './profile.module.css';
import Image from 'next/image';
import getColors from '@app/profileColor';

const Page = (
  props: {
    refs: React.Ref<HTMLElement>
    userData?: any
  }
) => {
  if (!props.userData)
    return (
      <main ref={ props.refs } style={ { display: 'none' } }>
        <Image
          src='/icons/loading.svg'
          alt='Loading'
          width={ 64 }
          height={ 64 }
          style={ {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          } }
        />
      </main>
    );

  const [ color, r_color ] = getColors(props.userData.username.slice(0, 3));

  return (
    <main ref={ props.refs } style={ { display: 'none' } }>
      <div className={ style.ProfileContainer }>
        <div className={ `${ style.ProfileCard } ${ style.ProfileInfo }` }>
            <p
              className={ style.ProfilePhoto }
              style={ { backgroundColor: color, color: r_color } }
            >{ props.userData.username[0] }</p>
            <h2>{ props.userData.username }</h2>
            <div>
              <p><b>{ props.userData.followers.length }</b> followers</p>
              <p><b>{ props.userData.following.length }</b> following</p>
            </div>
        </div>
        {
          props.userData.finished.length > 0 &&
          <div className={ `${ style.ProfileCard }` }>
            <h2>Badges</h2>
            <div className={ style.ProfileDivider } />
            <div className={ style.ProfileBadges }>
              {
                props.userData.finished.map((data: { location: string, time: number }, key: number) =>
                  <Image
                    src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ data.location }.svg` }
                    alt={ data.location } key={ key } width={ 48 } height={ 48 }
                  />
                )
              }
            </div>
          </div>
        }
      </div>
    </main>
  );
}

export default Page;