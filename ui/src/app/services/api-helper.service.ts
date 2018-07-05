import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
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
    if (res instanceof Response) {
      const body = res.json() || {};
      const err = <APIError> body.error;
      if (err) {
        error = err;
      } else {
        error = {status: res.status, message: 'An unexpected error occurred. Please reload the page.'};
      }
    } else {
      error = {status: 500, message: 'An unexpected error occurred. Please reload the page.'};
    }

    console.error('error', error);
    return Observable.throw(error);
  }

  extractData(res: Response) {
    const body = res.json();
    return body.result;
  }
}
