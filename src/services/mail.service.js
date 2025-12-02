import nodemailer from "nodemailer";

const mailOption = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'sjquinteros@ufpso.edu.co',
        pass: 'mginkonbtyrrutmj'
    }
};

const transporter = nodemailer.createTransport(mailOption);

export const sendMail = async (to, subject, message) => {
    try {
        const result = await transporter.sendMail({
            from: 'sjquinteros@ufpso.edu.co',
            to,
            subject,
            html: message
        });
        return result;
    } catch (error) {
        console.error('Error enviando correo:', error);
        throw error;
    }
};

