import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monday',
  templateUrl: './monday.component.html',
  styleUrls: ['./monday.component.css']
})
export class MondayComponent implements OnInit {

  isVisibleMiddle = false;
  timeMondayObjectFromFirebase: any;
  university: any;
  course: any;

  dayValue;
  subjectValue;
  typeValue;
  locationValue;
  startTimeValue;
  endTimeValue;
  comment;

  noData: any;
  onlineStatus: any;

  constructor() { }

  ngOnInit(): void {
  }

  deleteData(docId: any, university: any, course: any) {

    this.loadDatabase();
  }

  loadDatabase() {

  }

  openUpdateDialog(
    docId: any,
    university: any,
    course: any,
    day: any,
    subject: any,
    type: any,
    location: any,
    start: any,
    end: any,
    comment: any
  ) {

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

  onSubmit(){

  }

  confirm(){

  }

  cancel(){
  }

}
