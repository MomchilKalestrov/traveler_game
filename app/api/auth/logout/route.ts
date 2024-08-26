import { cookies } from "next/headers"
import { NextResponse } from "next/server";

const POST = async () => {
    const cookie = cookies();
    cookie.delete('username');
    cookie.delete('password');
    return NextResponse.json({ success: true });
}

const GET = async () => {
    const cookie = cookies();
    cookie.delete('username');
    cookie.delete('password');
    return NextResponse.json({ success: true });
}

export { POST, GET };