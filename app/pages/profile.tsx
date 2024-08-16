'use client';
import style from './profile.module.css';

const Page = (
  props: {
    refs: React.Ref<HTMLElement>
    userData?: any
  }
) => {

  if (!props.userData)
    return (<main ref={ props.refs } style={ { display: 'none' } }>Loading...</main>);

  return (
    <main ref={ props.refs } style={ { display: 'none' } }>
      <div className={ style.ProfileContainer }>
        <div className={ `${ style.ProfileCard } ${ style.ProfileInfo }` }>
            <img className={ style.ProfilePhoto } src={ `/user/${ props.userData.username }.png` } />
            <h2>{ props.userData.username }</h2>
        </div>
        {
          props.userData.finished.length > 0
          ? <div className={ `${ style.ProfileCard }` }>
              <h2>Badges</h2>
              <div className={ style.ProfileDivider } />
              <div className={ style.ProfileBadges }>
                {
                  props.userData.finished.map((data: string, key: number) =>
                    <img src={ `/badges/${ data }.svg` } alt={ data } key={ key } />
                  )
                }
              </div>
            </div>
          : <></>
        }
      </div>
    </main>
  );
}

export default Page;