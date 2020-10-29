import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  subjectLong;
  subjectShort;
  teacherName;
  teacherEmail;
  teacherPhoneNo;
  teacherRoom;

  isVisibleMiddle = false;
  isVisibleMiddleUpdate = false;


  constructor() { }

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
