import { Directive, Input, SimpleChanges, SimpleChange, OnChanges} from '@angular/core';
import { NgForOf } from '@angular/common';

interface NgForInChanges extends SimpleChanges {
    ngForIn?: SimpleChange;
    ngForOf?: SimpleChange;
}

/**
 * This directive allow the developper to use the for in loop in the template.
 * Normally, only the for of loop is allowed.
 * In some case, it use useful to have the objects keys and value
 */
@Directive({
    selector: '[ngFor][ngForIn]'
})
export class NgForIn<T> extends NgForOf<T> implements OnChanges {

    @Input() ngForIn: any;

    ngOnChanges(changes: NgForInChanges): void {
        if (changes.ngForIn) {
            this.ngForOf = Object.keys(this.ngForIn) as Array<any>;

            const change = changes.ngForIn;
            const currentValue = Object.keys(change.currentValue);
            const previousValue = change.previousValue ? 
                                    Object.keys(change.previousValue) : undefined;
            changes.ngForOf =  new SimpleChange(previousValue, currentValue, change.firstChange);

            super.ngOnChanges(changes);
        }
    }
}