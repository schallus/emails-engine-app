import { Injectable, isDevMode } from '@angular/core';
import { Response } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw';

export class APIError {
  status: number;
  message: string;
}

@Injectable()
export class ApiHelperService {

  constructor() {}

  handleError(res) {
    let error: APIError;
    if (res instanceof HttpErrorResponse) {
      const body = res.error || {};
      const err = <APIError> body.error;
      if (err) {
        error = err;
      } else {
        error = {status: res.status, message: 'An unexpected error occurred. Please reload the page.'};
      }
    } else {
      error = {status: 500, message: 'An unexpected error occurred. Please reload the page.'};
    }

    if (isDevMode()) console.error('error', error.message);
    return Observable.throw(error);
  }

  extractData(res: Response) {
    const body = res.json();
    return body.result;
  }
}
