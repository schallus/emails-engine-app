import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { config } from './../config';
import { ApiHelperService } from './api-helper.service';

@Injectable()
export class UploadService {
    apiBaseUrl: string;
    brandsUrl: string;

    constructor(private http: HttpClient, private apiHelper: ApiHelperService) {
        this.apiBaseUrl = config.apiBaseUrl;
        this.brandsUrl = `${this.apiBaseUrl}/brands`;
    }

    // file from event.target.files[0]
    uploadImage(brandName: string, campaignName: string, image: File): any {

        const imageUploadUrl = `${this.brandsUrl}/${brandName}/campaigns/${campaignName}/images`;

        const formData = new FormData();
        formData.append('image', image);

        const params = new HttpParams();

        const options = {
            params: params
        };

        return this.http.post<any>(imageUploadUrl, formData, options)
            .pipe(catchError(this.apiHelper.handleError));
    }
}
