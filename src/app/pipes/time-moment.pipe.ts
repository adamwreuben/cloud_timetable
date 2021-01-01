import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeMoment',
})
export class TimeMomentPipe implements PipeTransform {
  transform(value: any): unknown {
    return moment(value).format('llll');
  }
}
