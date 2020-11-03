import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit {

  totalCrNumber: any = undefined;

  constructor(
    private afAuth: AngularFireAuth,
    private fireService: FirebaseAllService,
    private routes: Router,
    public statusServ: StatusServeService,
  ) { }

  ngOnInit(): void {
    this.checkAllCr();
  }

  checkAllCr(){
    this.statusServ.progressBarStatus = true;
    this.fireService.getUserVerifiedCrOly().subscribe((datas) => {
      if (datas.length !== 0) {
        this.statusServ.progressBarStatus = false;
        this.totalCrNumber = String(datas.length) + ' CRs';
      } else {
        this.statusServ.progressBarStatus = false;
      }
    });
  }

}
