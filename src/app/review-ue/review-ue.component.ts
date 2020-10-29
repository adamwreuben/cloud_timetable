import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review-ue',
  templateUrl: './review-ue.component.html',
  styleUrls: ['./review-ue.component.css']
})
export class ReviewUeComponent implements OnInit {

  isVisibleMiddle = false;
  isVisibleMiddleUpdate = false;


  dayValue;
  dateValue;
  subjectValue;
  typeValue;
  locationValue;
  startTimeValue;
  endTimeValue;

  constructor() { }

  selectedWeek = 'Week 1';


  ngOnInit(): void {
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
