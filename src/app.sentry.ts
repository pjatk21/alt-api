import { ArgumentsHost, Catch, Logger } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { BaseWsExceptionFilter } from '@nestjs/websockets'
import { SentryService } from '@ntegral/nestjs-sentry'

export class SentryWsExceptionsFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger('Sentry')

  catch(exception: unknown, host: ArgumentsHost) {
    SentryService.SentryServiceInstance().instance().captureException(exception)
    this.logger.debug(`WS error repoted to sentry...`)
    super.catch(exception, host)
  }
}

export class SentryAppExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger('Sentry')

  catch(exception: unknown, host: ArgumentsHost) {
    SentryService.SentryServiceInstance().instance().captureException(exception)
    this.logger.debug(`App error repoted to sentry...`)
    super.catch(exception, host)
  }
}
