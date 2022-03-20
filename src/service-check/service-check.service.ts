import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Cron, CronExpression } from '@nestjs/schedule'
import got from 'got/dist/source'
import { JSDOM } from 'jsdom'
import { CookieJar } from 'tough-cookie'
import {
  ServiceCheckStatus,
  ServiceCheckStatusDocument,
} from './schemas/service-check.schema'
import { PJATKService } from './service-check.enum'

class CheckError extends Error {
  toString() {
    return 'Error while checking service: ' + super.toString()
  }
}

@Injectable()
export class ServiceCheckService {
  private readonly logger = new Logger(ServiceCheckService.name)

  constructor(
    @InjectModel(ServiceCheckStatus.name)
    private serviceStatus: Model<ServiceCheckStatusDocument>,
  ) {}

  private async getGakkoState() {
    // prepare session
    const cookieJar = new CookieJar()
    const ses = got.extend({ cookieJar, throwHttpErrors: true })

    // login into gakko
    const loginPage = await ses.get('https://gakko.pja.edu.pl')
    const redirectionPage = await ses.post(loginPage.url, {
      form: {
        UserName: process.env.SCHECK_LOGIN,
        Password: process.env.SCHECK_PASSWORD,
        AuthMethod: 'FormsAuthentication',
      },
    })

    // bypass manually passing id_token
    const fragment = JSDOM.fragment(redirectionPage.body)

    const bypassing: Record<string, string> = {}
    try {
      bypassing.actionUrl = fragment
        .querySelector('[name=hiddenform]')
        .getAttribute('action')
      bypassing.idToken = fragment.querySelector('[name=id_token]').getAttribute('value')
      bypassing.state = fragment.querySelector('[name=state]').getAttribute('value')
    } catch {
      throw new CheckError('Auth failed!')
    }

    const { actionUrl, idToken, state } = bypassing

    await ses.post(actionUrl, {
      form: {
        id_token: idToken,
        state,
      },
      method: 'POST',
      followRedirect: false,
    })

    // check gakko itself
    const gakkoPage = await ses.get('https://gakko.pja.edu.pl')

    return {
      gakko: {
        status: gakkoPage.statusCode,
        timings: gakkoPage.timings,
        bodySize: gakkoPage.rawBody.length,
      },
      login: {
        status: loginPage.statusCode,
        timings: loginPage.timings,
        bodySize: gakkoPage.rawBody.length,
      },
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkGakko() {
    try {
      const { gakko, login } = await this.getGakkoState()

      await new this.serviceStatus({
        service: PJATKService.GAKKO,
        working: true,
        status: gakko.status,
        timings: gakko.timings,
      }).save()

      await new this.serviceStatus({
        service: PJATKService.LOGIN,
        working: true,
        status: login.status,
        timings: login.timings,
      }).save()
    } catch (err) {
      this.logger.warn(err)

      await new this.serviceStatus({
        service: PJATKService.GAKKO,
        working: false,
        errorMessage: err.toString(),
      }).save()

      await new this.serviceStatus({
        service: PJATKService.LOGIN,
        working: false,
        errorMessage: err.toString(),
      }).save()
    }
  }
}
