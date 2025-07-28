import { SendMailOptions } from 'nodemailer';

export interface IEmailService {
  sendMail(options: MailOptions): Promise<void>;
}

export interface TemplatedMailOptions extends SendMailOptions {
  template: string;
  context: Record<string, any>;
}

export type MailOptions = {
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
  address?: string;
};
