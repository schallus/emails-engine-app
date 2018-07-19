import { Injectable } from '@angular/core';
 
@Injectable()
export class StepperService {
    private currentStep: number;

    constructor() {
        this.currentStep = 0;
    }
 
    set(step: number) {
        this.currentStep = step;
        return this.currentStep;
    }
 
    get() : number {
        return this.currentStep;
    }
 
    next() {
        this.currentStep++;
        return this.currentStep;
    }

    previous() {
        this.currentStep--;
        return this.currentStep;
    }
}