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
        console.log(`${res.status} - ${res.statusText || ''} - ${err.message}`);
        error = err;
      } else {
        console.log(`${res.status} - ${res.statusText || ''} - ${JSON.stringify(body)}`);
        error = {status: res.status, message: 'An unexpected error occurred. Please reload the page.'};
      }
    } else {
      console.log(res);
      error = {status: 500, message: 'An unexpected error occurred. Please reload the page.'};
    }
    return Observable.throw(error);
  }

  extractData(res: Response) {
    const body = res.json();
    return body.result;
  }
}
