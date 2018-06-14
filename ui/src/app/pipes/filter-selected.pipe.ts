import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filterSelected'})
export class FilterSelectedPipe implements PipeTransform {
    transform(items: any[]): any {
        console.log('pipe');
        return items.filter(item => item.selected);
    }
}
