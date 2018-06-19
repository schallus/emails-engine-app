import { ApiHelperService } from './api-helper.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { config } from './../config';

import { Brand } from '../models/brand';
import { Campaign } from '../models/campaign';
import { Block } from '../models/block';
import { BlockPosition } from './../models/block-position';
import { CampaignOptions } from './../models/campaign-options';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiBaseUrl: string;
  private brandsUrl: string;
  private campaignUrl = (brandName: string) => `${this.brandsUrl}/${brandName}/campaigns`;
  private blocksUrl = (brandName: string) => `${this.brandsUrl}/${brandName}/blocks`;
  private campaignStructureUrl = (brandName: string, campaignName: string) =>
    `${this.brandsUrl}/${brandName}/campaigns/${campaignName}/structure`
  private campaignBuildUrl = (brandName: string, campaignName: string) =>
    `${this.brandsUrl}/${brandName}/campaigns/${campaignName}/build`
  private campaignOptionsUrl = (brandName: string, campaignName: string) =>
    `${this.brandsUrl}/${brandName}/campaigns/${campaignName}`
  private getBlockDataUrl = (brandName: string, campaignName: string, blockName: string) =>
    `${this.brandsUrl}/${brandName}/campaigns/${campaignName}/blocks/${blockName}`
  private getBlocksDataUrl = (brandName: string, campaignName: string) =>
    `${this.brandsUrl}/${brandName}/campaigns/${campaignName}/blocks`

  constructor(
    private http: HttpClient,
    private apiHelper: ApiHelperService
  ) {
    this.apiBaseUrl = config.apiBaseUrl;
    this.brandsUrl = `${this.apiBaseUrl}/brands`;
  }

  getBrands() {
    return this.http.get<Brand[]>(this.brandsUrl)
      .pipe(catchError(this.apiHelper.handleError));
  }

  getCampaigns(brandName: string) {
    return this.http.get<Campaign[]>(this.campaignUrl(brandName))
      .pipe(catchError(this.apiHelper.handleError));
  }

  getBlocks(brandName: string) {
    return this.http.get<Block[]>(this.blocksUrl(brandName))
      .pipe(catchError(this.apiHelper.handleError));
  }

  getCampaignOptions(brandName: string, campaignName: string) {
    return this.http.get<CampaignOptions>(this.campaignOptionsUrl(brandName, campaignName))
      .pipe(catchError(this.apiHelper.handleError));
  }

  setCampaignOptions(brandName: string, campaignName: string, options: CampaignOptions) {
    return this.http.post<CampaignOptions>(this.campaignOptionsUrl(brandName, campaignName), options, httpOptions)
      .pipe(catchError(this.apiHelper.handleError));
  }

  getCampaignStructure(brandName: string, campaignName: string) {
    return this.http.get<BlockPosition[]>(this.campaignStructureUrl(brandName, campaignName))
      .pipe(catchError(this.apiHelper.handleError));
  }

  setCampaignStructure(brandName: string, campaignName: string, structure: BlockPosition[]) {
    return this.http.post<BlockPosition[]>(this.campaignStructureUrl(brandName, campaignName), structure, httpOptions)
      .pipe(catchError(this.apiHelper.handleError));
  }

  getBlockData(brandName: string, campaignName: string, blockName: string) {
    return this.http.get<any[]>(this.getBlockDataUrl(brandName, campaignName, blockName))
      .pipe(catchError(this.apiHelper.handleError));
  }

  getBlocksData(brandName: string, campaignName: string) {
    return this.http.get<any[]>(this.getBlocksDataUrl(brandName, campaignName))
      .pipe(catchError(this.apiHelper.handleError));
  }

  setBlocksData(brandName: string, campaignName: string, blocksData: any) {
    return this.http.put<any[]>(this.getBlocksDataUrl(brandName, campaignName), blocksData, httpOptions)
      .pipe(catchError(this.apiHelper.handleError));
  }

  changeBlockData(brandName: string, campaignName: string, blockName: string, blockData: any) {
    return this.http.put<any[]>(this.getBlockDataUrl(brandName, campaignName, blockName), blockData, httpOptions)
      .pipe(catchError(this.apiHelper.handleError));
  }

  setBlockData(brandName: string, campaignName: string, blockData: any) {
    return this.http.post<any[]>(this.getBlocksDataUrl(brandName, campaignName), blockData, httpOptions)
      .pipe(catchError(this.apiHelper.handleError));
  }

  removeBlockData(brandName: string, campaignName: string, blockName: string) {
    return this.http.delete<any>(this.getBlockDataUrl(brandName, campaignName, blockName))
      .pipe(catchError(this.apiHelper.handleError));
  }

  buildCampaign(brandName: string, campaignName: string) {
    return this.http.post<any>(this.campaignBuildUrl(brandName, campaignName), null, httpOptions)
      .pipe(catchError(this.apiHelper.handleError));
  }
}
