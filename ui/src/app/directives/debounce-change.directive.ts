import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounceChange]'
})
export class DebounceChangeDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 500;
  @Output() debounceChange = new EventEmitter();
  private changes = new Subject();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.changes.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(e => this.debounceChange.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('input', ['$event'])
  changeEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.changes.next(event);
  }

  @HostListener('onContentChanged', ['$event'])
  onContentChangedEvent(event) {
    this.changes.next(event);
  }
}

