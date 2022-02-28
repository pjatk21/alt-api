import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { DateTime } from 'luxon'

@Injectable()
export class ParseDateIsoPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    return DateTime.fromISO(value)
  }
}
