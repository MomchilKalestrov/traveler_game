'use client';
import style from './profile.module.css';

const Page = (props: { refs: React.Ref<HTMLElement> }) => {
  
  return (
    <main ref={ props.refs } style={ { display: 'none' } }>
      Profile
    </main>
  );
}

export default Page;