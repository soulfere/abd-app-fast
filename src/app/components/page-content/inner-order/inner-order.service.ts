import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { OrderListDetailTableModel } from '../../../models/order-list-detail.model';
import { BasicAndSealModel,ComponentListTableModel, BasicPartListTableModel, OtherComponentModel } from '../../../models/inner-order.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
};

@Injectable()
export class InnerOrderService {
  bomInfo = 'http://localhost:53366/api/innerOrder/';
  modelLibrary = 'http://localhost:53366/api/innerOrder/modelLibrary/';
  existBumpInfo = 'http://localhost:53366/api/innerOrder/existBumpInfo/';
  basicSealInfo = 'http://localhost:53366/api/innerOrder/basicSealInfo/';
  otherComponentInfo = 'http://localhost:53366/api/innerOrder/otherComponentInfo/';
  bomGridDataByUpload = 'http://localhost:53366/api/innerOrder/BOMGridData/';
  bomGridDataForDisplay = 'http://localhost:53366/api/innerOrder/BOMGridData/';
  constructor(private http: HttpClient) { }

  getExistedBumpInfo(orderNo:string, bumpId: string) {
    return this.http.get<OrderListDetailTableModel> (this.existBumpInfo + (orderNo + "|DASH|" + bumpId).replace("/","|SLASH|")).pipe( catchError(this.handleError) );
  }

  getBasicSealInfo(orderNo:string, bumpId: string) {
    return this.http.get<BasicAndSealModel> (this.basicSealInfo + (orderNo + "|DASH|" + bumpId).replace("/","|SLASH|")).pipe( catchError(this.handleError) );
  }

  getOtherComponentInfo(orderNo:string, bumpId: string) {
    return this.http.get<OtherComponentModel> (this.otherComponentInfo + (orderNo + "|DASH|" + bumpId).replace("/","|SLASH|")).pipe( catchError(this.handleError) );
  }

  saveInnerOrder(orderListDetailTableModel: OrderListDetailTableModel,basicAndSealModel: BasicAndSealModel, componentListTableData: Array<ComponentListTableModel>, basicPartListTableData: Array<BasicPartListTableModel>, otherComponentModel: OtherComponentModel) {
    return this.http.post<any>(this.bomInfo, this.makeIntegrationObject(orderListDetailTableModel,basicAndSealModel,componentListTableData,basicPartListTableData,otherComponentModel), httpOptions).pipe( retry(3), catchError(this.handleError) );
  }

  makeIntegrationObject(orderListDetailTableModel:OrderListDetailTableModel, basicAndSealModel: BasicAndSealModel, componentListTableData: Array<ComponentListTableModel>, basicPartListTableData: Array<BasicPartListTableModel>, otherComponentModel: OtherComponentModel) {
    let integeationMap: {[key: string] : Object} = {};

    integeationMap["orderListDetailTableModel"] = orderListDetailTableModel;
    integeationMap["basicAndSealModel"] = basicAndSealModel;
    integeationMap["componentListTableData"] = componentListTableData;
    integeationMap["basicPartListTableData"] = basicPartListTableData;
    integeationMap["otherComponentModel"] = otherComponentModel;
    
    return JSON.stringify(integeationMap);
  }

  getModelLibrary(bumpType: string) {
    return this.http.get(this.modelLibrary + bumpType.replace("/","|SLASH|")).pipe( catchError(this.handleError) );
  }

  getGridDataByUpload() {
    return this.http.get(this.bomGridDataByUpload).pipe( catchError(this.handleError) );
  }

  getDisplayGridData(orderNo:string, bumpId: string) {
    return this.http.get(this.bomGridDataForDisplay + (orderNo + "|DASH|" + bumpId).replace("/","|SLASH|")).pipe( catchError(this.handleError) );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}