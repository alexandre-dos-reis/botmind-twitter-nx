import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
  pure: true,
})
export class DateAgoPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29) return 'Just now';

      interface Intervals {
        [key: string]: number;
      }

      const intervals: Intervals = {
        année: 31536000,
        mois: 2592000,
        semaine: 604800,
        jour: 86400,
        heure: 3600,
        minute: 60,
        seconde: 1,
      };
      let counter;

      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i as keyof Intervals]);
        if (counter > 0) {
          if (counter === 1) {
            return 'Il y a ' + counter + ' ' + i; // singular (1 day ago)
          } else {
            return 'Il y a ' + counter + ' ' + i; // plural (2 days ago)
          }
        }
      }
    }
    return value;
  }
}
