import { ArgumentsHost, Logger } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { BaseWsExceptionFilter } from '@nestjs/websockets'
import { SentryService } from '@ntegral/nestjs-sentry'

class SentryAdapter {
  private readonly logger = new Logger('Sentry')

  static default = new SentryAdapter()

  reportException(exception: unknown) {
    SentryService.SentryServiceInstance().instance().captureException(exception)
    this.logger.debug(`Error repoted to sentry...`)
  }
}

export class SentryWsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    SentryAdapter.default.reportException(exception)
    super.catch(exception, host)
  }
}

export class SentryAppExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    SentryAdapter.default.reportException(exception)
    super.catch(exception, host)
  }
}
