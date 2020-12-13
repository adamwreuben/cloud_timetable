import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';

export interface Table {
  MON: any[];
  TUE: any[];
  WED: any[];
  THUR: any[];
  FRI: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AutogenerateService {

  constructor(private http: HttpClient) { }

  getData(codes: any): Observable<any> {
    const url = 'https://mytimetableudsm.herokuapp.com/ati/udsm-timetable';
    return this.http.post(url, {data: codes});
  }

  checkCode(code: any): Observable<any> {
    const url = 'https://mytimetableudsm.herokuapp.com/check';
    return this.http.post(url, {code});
  }
}
