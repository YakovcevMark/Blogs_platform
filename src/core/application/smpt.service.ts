import nodemailer from "nodemailer";

export class SmtpService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL_ADDRESS,
            pass: process.env.SMTP_EMAIL_PASSWORD,
        },
    });

    public sendMail = async (params: { from: string, to: string[], subject: string, text?: string, html?: string }) => {
        return this.transporter.sendMail({...params, to:params.to.join(' ,')})
    }

}
