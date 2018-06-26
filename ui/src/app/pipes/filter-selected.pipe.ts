import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filterSelected', pure: false})
export class FilterSelectedPipe implements PipeTransform {
    transform(items: any[]): any {
        if (items) {
            return items.filter(item => item.selected);
        }
    }
}
