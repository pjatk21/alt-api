import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { IncomingMessage } from 'http'
import { DateTime } from 'luxon'
import { Observable, tap } from 'rxjs'
import { StatsService } from './stats.service'

@Injectable()
export class StatsInterceptor implements NestInterceptor {
  private start?: DateTime
  private url?: string

  constructor(private readonly statsService: StatsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.before(context)
    return next.handle().pipe(tap(async () => await this.after()))
  }

  private before(context: ExecutionContext) {
    this.url = (context.getArgByIndex(0) as IncomingMessage).url
    this.start = DateTime.now()
  }

  private async after() {
    await this.statsService.recordStats(
      this.url,
      DateTime.now().diff(this.start).milliseconds,
    )
  }
}
