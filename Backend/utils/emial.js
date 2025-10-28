import nodemailer from 'nodemailer'
import dotenv from 'dotenv'


dotenv.config()
export const transporter= nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.Mail,
        pass:process.env.App_password
    }
})