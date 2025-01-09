'use server';
import nodemailer from 'nodemailer';

const htmlEmailTemplate = (email: string, id: string) => `
<!DOCTYPE html>
<html>
    <table style="
        font-family: Arial, Helvetica, sans-serif;
        color: #484b3d;
        border-spacing: 16px;
        margin: 0px auto;
        padding: 0px;
    ">
        <tr style="margin: 0px; padding: 0px; height: 48px;"><td style="margin: 0px; padding: 0px; height: 48px;">
            <img src="https://venturo-game.vercel.app/media/logo.svg" alt="Venturo" width="134" height="48" />
        </td></tr>

        <tr style="margin: 0px; padding: 0px;"><td style="margin: 0px; padding: 0px;">
            <div style="margin: 0px; padding: 0px; height: 2px; width: 100%; background-color: #484b3d80;"></div>
        </td></tr>

        <tr style="margin: 0px; padding: 0px;"><td style="margin: 0px; padding: 0px;">
            <h1 style="
                margin: 0px 0px 16px 0px;
                font-size: 24px;
                line-height: 24px;
            ">Hello ${ email },</h1>
            <p style="
                margin: 0px 0px 16px 0px;
                font-size: 16px;
                line-height: 16px;
            ">A profile has recently been created with your e-mail.<br>Please verify it with the button below.</p>
            <button style="
                margin: 0px;
                padding: 8px 32px;
                border-radius: 56px;
                font-size: 16px;
                line-height: 16px;
                font-weight: bold;
                border: 0px;
                border: 1px solid #484b3d;
                background-color: white;
            ">
                <a
                    style="text-decoration: none; color: #484b3d;"
                    href="https://venturo-game.vercel.app/api/auth/verify?id=${ id }"
                >Verify</a>
            </button>
        </td></tr>

        <tr style="margin: 0px; padding: 0px;"><td style="margin: 0px; padding: 0px;">
            <div style="margin: 0px; padding: 0px; height: 2px; width: 100%; background-color: #484b3d80;"></div>
        </td></tr>

        <tr style="margin: 0px; padding: 0px;"><td style="margin: 0px; padding: 0px;">
            <p style="margin: 0px; font-weight: bold;">Thanks,</p>
            <p style="margin: 0px;">The Venturo Team</p>
        </td></tr>
    </table>
</html>
`;

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendVerificationEmail = async (id: string, email: string) => {
    await transporter.sendMail({
        from: `<${ process.env.EMAIL_USER }>`,
        to: email,
        subject: 'Please Verify Your Email',
        html: htmlEmailTemplate(email, id),
        text: 
`
Hello ${ email },
A profile has recently been created with your e-mail.
Please verify it by visiting the link below:
https://venturo-game.vercel.app/api/auth/verify?id=${ id }
`
    });
};

export default sendVerificationEmail;