import { Injectable } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';


@Injectable()
export class ToastrService {

    toastrOptions = {
        closeButton: false,
        tapToDismiss: true,
        positionClass: 'toast-top-right'
    };

    constructor(
        private toast: ToastService
    ) {}

  showSuccess(body: string, title: string) {
    this.toast.success(body, title, this.toastrOptions);
  }

  showError(body: string, title: string) {
    this.toast.error(body, title, this.toastrOptions);
  }

  showInfo(body: string, title: string) {
    this.toast.info(body, title, this.toastrOptions);
  }

  showWarning(body: string, title: string) {
    this.toast.warning(body, title, this.toastrOptions);
  }

}
