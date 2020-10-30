import { Injectable, OnInit } from '@angular/core';
import { merge, Observable, fromEvent, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class StatusServeService implements OnInit{

  checkStatus:boolean = false;
  progressBarStatus:boolean = false;
  adminVerifyStatus:boolean = false;
  requestVerification:boolean = false;


  universityName:any = null
  courseName:any = null;

  dayFromTabs:any = "Monday";

  loginStatus:boolean;

  course:any;
  university:any;

  constructor(private auth:AngularFireAuth) { }

  ngOnInit(){

    this.auth.authState.subscribe(userData=>{
      if(userData !== null){
        this.loginStatus = true
      }else{
        this.loginStatus =false
      }
    })
  }

  changeStatusServ(value:boolean){
    this.checkStatus = value;
  }



  checkOnlineStatus$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }
}
