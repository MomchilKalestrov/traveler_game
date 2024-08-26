'use server';
import { md5 } from 'js-md5';
import Panel from './panel';
import SignIn from './signin';
import { cookies } from 'next/headers';

const Page = () => {
    const cookie = cookies();
    const passphrase: string = cookie.get('passphrase')?.value || '';

    if (passphrase === md5(process.env.ADMIN_PASS as string)) return <Panel />;
    else return <SignIn />
}

export default Page;