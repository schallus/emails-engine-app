import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filter', pure: false})
export class FilterPipe implements PipeTransform {
    transform(items: any[], propertyName: string, value: string): any {
        if (items) {
            return items.filter(item => item[propertyName] === value)[0];
        }
    }
}
