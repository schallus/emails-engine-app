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

  /**
   * Function everytime an API request return an error
   * Its goal is to handle those errors by logging the error if we are in dev mode.
   * In production, it's gonna throw an error which will be caught by the component and it will display a custom error message
   */
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

  /**
   * Extract the JSON data from a API request
   */
  extractData(res: Response) {
    const body = res.json();
    return body.result;
  }
}
