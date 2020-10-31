import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';

@Component({
  selector: 'app-review-ue',
  templateUrl: './review-ue.component.html',
  styleUrls: ['./review-ue.component.css']
})
export class ReviewUeComponent implements OnInit {

  isVisibleMiddle = false;
  isVisibleMiddleUpdate = false;
  selectedWeek = 'Week 1';
  seletedDay = 'Monday';


  university: any;
  course: any;

  dayValue;
  dateValue;
  subjectValue;
  typeValue;
  locationValue;
  startTimeValue;
  endTimeValue;

  constructor(
    public statusServ: StatusServeService
  ) { }


  ngOnInit(): void {
  }


  weekChange(){
    this.statusServ.weekSelected = this.selectedWeek;
  }


  handleOkMiddle(): void {
    this.isVisibleMiddle = false;
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }

  handleOkMiddleUpdate(): void {
    this.isVisibleMiddleUpdate = false;
  }

  handleCancelMiddleUpdate(): void {
    this.isVisibleMiddleUpdate = false;
  }

  showModalMiddleUpdate(): void {
    this.isVisibleMiddleUpdate = true;
  }

  onSubmit(){

  }

}
