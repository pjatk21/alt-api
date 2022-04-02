import { Injectable } from '@nestjs/common'
import { MailService } from '@sendgrid/mail'
import { Timetable } from 'src/public-timetable/schemas/timetable.schema'
import * as YAML from 'yaml'

@Injectable()
export class PostOfficeService {
  private readonly sendgridMail = new MailService()

  constructor() {
    this.sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)
  }

  async notifyScheduleChange(delta: any[], updated: Timetable, previous: Timetable) {
    this.sendgridMail.send({
      from: 'schedule-changes@kpostek.dev',
      templateId: 'd-9f3f6c1d58f44e51832818998666d406',
      to: 's25290@pjwstk.edu.pl',
      dynamicTemplateData: {
        outdated: YAML.stringify(previous.entry),
        updated: YAML.stringify(updated.entry),
        delta: YAML.stringify(Object.fromEntries(delta)),
      },
    })
  }
}
