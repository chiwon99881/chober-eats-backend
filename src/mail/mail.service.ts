import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';
import got from 'got';
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly mailOptions: MailModuleOptions,
  ) {}

  async sendEmail(subject: string, content: string): Promise<Boolean> {
    const form = new FormData();
    form.append('from', `Excited User <mailgun@${this.mailOptions.domain}>`);
    form.append('to', 'chiwon99881@gmail.com');
    form.append('subject', subject);
    form.append('html', content);
    //curl 방식으로 user를 Authorized 하는 방식인데
    //curl -s --user 'api:YOUR_API_KEY' \ 이렇게 되어있으면
    //header에 Basic Buffer.from('api:YOUR_API_KEY).toString('base64') 로 기입해야 한다.
    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.mailOptions.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.mailOptions.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (error) {
      //console.log(error);
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string): void {
    this.sendEmail(
      'Verify Your Email',
      `<h1>Hello ${email}</h1>
      Copy this Code: <span style="color:black; font-size:50px">${code}</span>`,
    );
  }
}
