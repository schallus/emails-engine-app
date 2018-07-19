import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ApiHelperService } from './api-helper.service';

@Injectable()
export class UploadService {
    apiBaseUrl: string;
    brandsUrl: string;

    params: HttpParams;
    options: any;

    private imageUploadUrl = (brandName: string, campaignName: string) => `${this.brandsUrl}/${brandName}/campaigns/${campaignName}/images`;

    constructor(private http: HttpClient, private apiHelper: ApiHelperService) {
        this.apiBaseUrl = environment.apiBaseUrl;
        this.brandsUrl = `${this.apiBaseUrl}/brands`;

        this.params = new HttpParams();

        this.options = {
            params: this.params
        };
    }

    // file from event.target.files[0]
    uploadImage(brandName: string, campaignName: string, image: File): any {

        const formData = new FormData();
        formData.append('image', image);

        return this.http.post<any>(this.imageUploadUrl(brandName, campaignName), formData, this.options)
            .pipe(catchError(this.apiHelper.handleError));
    }

    removeImage(brandName: string, campaignName: string, imageFileName: string) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: { imageFileName: imageFileName }
        };
        return this.http.delete<any>(this.imageUploadUrl(brandName, campaignName), httpOptions)
            .pipe(catchError(this.apiHelper.handleError));
    }
}
