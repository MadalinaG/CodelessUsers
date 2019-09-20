import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'userage' })
export class UserAgePipe implements PipeTransform {
    transform(birthday: Date) : number {
        var age = 0;
    
        if (birthday) {
          var timeDiff = Math.abs(Date.now() - new Date(birthday).getTime());
          age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        }
    
        return age;
    }
}