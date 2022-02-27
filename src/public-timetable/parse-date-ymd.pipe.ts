import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { DateTime } from 'luxon'

@Injectable()
export class ParseDateYmdPipe implements PipeTransform<string, DateTime> {
  transform(value: string, metadata: ArgumentMetadata) {
    return DateTime.fromFormat(value, 'yyyy-MM-dd', { zone: 'Europe/Warsaw' })
  }
}
