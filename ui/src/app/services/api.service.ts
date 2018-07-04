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
import { Recipient } from '../models/recipient';

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
  private campaignsUrl = (brandName: string) => `${this.brandsUrl}/${brandName}/campaigns`;
  private blocksUrl = (brandName: string) => `${this.brandsUrl}/${brandName}/blocks`;
  private recipientsUrl = (brandName: string) => `${this.brandsUrl}/${brandName}/recipients`;
  private campaignArchiveUrl = (brandName: string, campaignName: string) =>
    `${this.brandsUrl}/${brandName}/campaigns/${campaignName}/archive`
  private campaignDeleteUrl = (brandName: string, campaignName: string) =>
    `${this.brandsUrl}/${brandName}/campaigns/${campaignName}/delete`
  private campaignStructureUrl = (brandName: string, campaignName: string) =>
    `${this.brandsUrl}/${brandName}/campaigns/${campaignName}/structure`
  private campaignBuildUrl = (brandName: string, campaignName: string) =>
    `${this.brandsUrl}/${brandName}/campaigns/${campaignName}/build`
  private campaignTestEmailUrl = (brandName: string, campaignName: string) =>
    `${this.brandsUrl}/${brandName}/campaigns/${campaignName}/send`
  private campaignZipUrl = (brandName: string, campaignName: string) =>
    `${this.brandsUrl}/${brandName}/campaigns/${campaignName}/zip`
  private campaignOptionsUrl = (brandName: string, campaignName: string) =>
    `${this.brandsUrl}/${brandName}/campaigns/${campaignName}`
  private campaignDuplicateUrl = (brandName: string, campaignName: string) =>
    `${this.brandsUrl}/${brandName}/campaigns/${campaignName}/duplicate`
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
    return this.http.get<Campaign[]>(this.campaignsUrl(brandName))
      .pipe(catchError(this.apiHelper.handleError));
  }

  addCampaign(brandName: string, campaignName: string) {
    return this.http.post<Campaign>(this.campaignsUrl(brandName), { displayName: campaignName }, httpOptions)
      .pipe(catchError(this.apiHelper.handleError));
  }

  editCampaign(brandName: string, campaignName: string, newName: string) {
    return this.http.patch<Campaign>(this.campaignOptionsUrl(brandName, campaignName), { displayName: newName }, httpOptions)
      .pipe(catchError(this.apiHelper.handleError));
  }

  duplicateCampaign(brandName: string, campaignName: string, newName: string) {
    return this.http.post<Campaign>(this.campaignDuplicateUrl(brandName, campaignName), { displayName: newName }, httpOptions)
      .pipe(catchError(this.apiHelper.handleError));
  }

  archiveCampaign(brandName: string, campaignName: string) {
    return this.http.delete(this.campaignArchiveUrl(brandName, campaignName))
      .pipe(catchError(this.apiHelper.handleError));
  }

  deleteCampaign(brandName: string, campaignName: string) {
    return this.http.delete(this.campaignDeleteUrl(brandName, campaignName))
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
    return this.http.get<any>(this.getBlockDataUrl(brandName, campaignName, blockName))
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

  exportCampaign(brandName: string, campaignName: string) {
    return this.http.post<any>(this.campaignZipUrl(brandName, campaignName), null, httpOptions)
      .pipe(catchError(this.apiHelper.handleError));
  }

  getRecipients(brandName: string) {
    return this.http.get<any>(this.recipientsUrl(brandName))
      .pipe(catchError(this.apiHelper.handleError));
  }

  setRecipients(brandName: string, recipients: Recipient[]) {
    return this.http.put<Recipient[]>(this.recipientsUrl(brandName), recipients, httpOptions)
      .pipe(catchError(this.apiHelper.handleError));
  }

  sendTestEmails(brandName: string, campaignName: string, recipients: string[], languages: string[]) {
    const data = {
      recipients: recipients,
      languages: languages
    };
    return this.http.post<any>(this.campaignTestEmailUrl(brandName, campaignName), data, httpOptions)
      .pipe(catchError(this.apiHelper.handleError));
  }
}
