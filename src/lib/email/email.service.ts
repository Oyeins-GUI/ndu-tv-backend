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
      const { to, template, context, subject } = options;

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
