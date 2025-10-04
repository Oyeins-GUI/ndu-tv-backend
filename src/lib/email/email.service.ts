import { Injectable } from '@nestjs/common';
import {
  IEmailService,
  MailOptions,
  TemplatedMailOptions,
} from './email.interface';
import { CustomLogger } from '../logger/logger.service';
import { createTransport, Transporter } from 'nodemailer';
import { env } from '../../config';
import hbs from 'nodemailer-express-handlebars';
import * as path from 'node:path';

@Injectable()
export class EmailService implements IEmailService {
  private readonly transporter: Transporter;

  constructor(private readonly logger: CustomLogger) {
    logger.setContext(EmailService.name);

    this.transporter = createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      auth: {
        user: env.MAIL_USERNAME,
        pass: env.MAIL_PASSWORD,
      },
    });

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          partialsDir: path.join(__dirname, 'templates'),
          defaultLayout: '',
        },
        viewPath: path.join(__dirname, 'templates'),
        extName: '.hbs',
      }),
    );
  }

  public async sendMail(options: MailOptions): Promise<void> {
    try {
      this.logger.debug(path.join(__dirname, 'templates'));
      this.logger.debug(process.cwd());
      this.logger.debug(path.join(process.cwd(), __dirname));
      const { to, template, context, subject, address } = options;
      await this.transporter.sendMail({
        from: `${env.APP_NAME} <${address || env.MAIL_FROM_ADDRESS}>`,
        to,
        sender: address || env.MAIL_FROM_ADDRESS,
        subject,
        template,
        context,
      } as unknown as TemplatedMailOptions);
    } catch (error) {
      this.logger.error(`Error sending mail`, error);
    }
  }
}
