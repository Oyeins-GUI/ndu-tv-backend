// import { Injectable } from '@nestjs/common';
// import {
//   IEmailService,
//   MailOptions,
//   TemplatedMailOptions,
// } from './email.interface';
// import { CustomLogger } from '../logger/logger.service';
// import { createTransport, Transporter } from 'nodemailer';
// import { env } from '../../config';
// import hbs from 'nodemailer-express-handlebars';
// import * as path from 'node:path';
// import { MailtrapTransport } from 'mailtrap';

// @Injectable()
// export class EmailService implements IEmailService {
//   private readonly transporter: Transporter;

//   constructor(private readonly logger: CustomLogger) {
//     logger.setContext(EmailService.name);

//     // this.transporter = createTransport({
//     //   host: env.MAIL_HOST,
//     //   port: env.MAIL_PORT,
//     //   secure: env.MAIL_PORT == 465 && env.NODE_ENV == 'production',
//     //   requireTLS: env.NODE_ENV == 'production',
//     //   tls: {
//     //     rejectUnauthorized: false,
//     //     requestCert: false,
//     //   },
//     //   auth: {
//     //     user: env.MAIL_USERNAME,
//     //     pass: env.MAIL_PASSWORD,
//     //   },
//     // });

//     this.transporter = createTransport(
//       MailtrapTransport({
//         token: env.API_MAIL_TOKEN,
//       }),
//     );

//     // this.transporter.use(
//     //   'compile',
//     //   hbs({
//     //     viewEngine: {
//     //       extname: '.hbs',
//     //       partialsDir: path.join(__dirname, 'templates'),
//     //       defaultLayout: '',
//     //     },
//     //     viewPath: path.join(__dirname, 'templates'),
//     //     extName: '.hbs',
//     //   }),
//     // );
//   }

//   public async sendMail(options: MailOptions): Promise<void> {
//     try {
//       // this.logger.debug(path.join(__dirname, 'templates'));
//       // this.logger.debug(process.cwd());
//       // const { to, template, context, subject, address } = options;
//       // await this.transporter.sendMail({
//       //   from: `${env.APP_NAME} <${address || env.MAIL_FROM_ADDRESS}>`,
//       //   to,
//       //   sender: address || env.MAIL_FROM_ADDRESS,
//       //   subject,
//       //   template,
//       //   context,
//       // } as unknown as TemplatedMailOptions);
//     } catch (error) {
//       this.logger.error(`Error sending mail`, error);
//     }
//   }
// }

// //Mailer send verion
// import { Injectable } from '@nestjs/common';
// import { IEmailService, MailOptions } from './email.interface';
// import { CustomLogger } from '../logger/logger.service';
// import { env } from '../../config';
// import * as fs from 'fs';
// import * as path from 'node:path';
// import hbs from 'handlebars';
// import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

// @Injectable()
// export class EmailService implements IEmailService {
//   // private readonly transporter: Transporter;
//   private mailersend: MailerSend;

//   private sentFrom: Sender;

//   constructor(private readonly logger: CustomLogger) {
//     logger.setContext(EmailService.name);

//     this.mailersend = new MailerSend({
//       apiKey: env.API_MAIL_TOKEN,
//     });

//     this.sentFrom = new Sender('info@domain.com', 'Your name');
//   }

//   public async sendMail(options: MailOptions): Promise<void> {
//     try {
//       const { to, template, context, subject, address } = options;

//       const templatePath = path.join(__dirname, 'templates', `${template}.hbs`);
//       const source = fs.readFileSync(templatePath, 'utf8');
//       const compiled = hbs.compile(source);
//       const html = compiled(context);

//       const recipients = [new Recipient(to, 'Your Client')];

//       const emailParams = new EmailParams()
//         .setFrom(this.sentFrom)
//         .setTo(recipients)
//         .setSubject(subject)
//         .setHtml(html);

//       await this.mailersend.email.send(emailParams);
//     } catch (error) {
//       console.log(error);
//       this.logger.error(`Error sending mail`, error);
//     }
//   }
// }

//Mailtrap Version
//Mailer send verion
import { Injectable } from '@nestjs/common';
import { IEmailService, MailOptions } from './email.interface';
import { CustomLogger } from '../logger/logger.service';
import { env } from '../../config';
import * as fs from 'fs';
import * as path from 'node:path';
import hbs from 'handlebars';

import { MailtrapClient } from 'mailtrap';

@Injectable()
export class EmailService implements IEmailService {
  private mailtrap: MailtrapClient;

  constructor(private readonly logger: CustomLogger) {
    logger.setContext(EmailService.name);

    this.mailtrap = new MailtrapClient({
      token: env.API_MAIL_TOKEN,
    });
  }

  public async sendMail(options: MailOptions): Promise<void> {
    try {
      const { to, template, context, subject, address } = options;

      const templatePath = path.join(__dirname, 'templates', `${template}.hbs`);
      const source = fs.readFileSync(templatePath, 'utf8');
      const compiled = hbs.compile(source);
      const html = compiled(context);

      const recipient = [{ email: to }];
      await this.mailtrap.send({
        from: { email: env.API_MAIL_FROM_ADDRESS, name: env.APP_NAME },
        subject,
        html,
        to: recipient,
      });
    } catch (error) {
      console.log(error);
      this.logger.error(`Error sending mail`, error);
    }
  }
}
