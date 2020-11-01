import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  isOkLoading = false;
  isVisibleMiddle = false;

  university: any;
  course: any;

  dayValue;
  subjectValue;
  typeValue;
  locationValue;
  startTimeValue;
  endTimeValue;

  showSpinner: boolean = false;
  comment = 'No Info';
  collision = 'no' ;

  //Arrays--->
  startArray = [];
  endArray = [];

  startArrayStatus: boolean = false;
  endArrayStatus: boolean = false;


  constructor(
    public statusServ: StatusServeService,
    public servFirebase: FirebaseAllService,
    private auth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.auth.authState.subscribe((userData) => {
      if (userData !== null) {
        this.servFirebase
          .getUniversityCourse(userData.uid)
          .subscribe((data) => {
            if (data.length !== 0) {
              this.statusServ.progressBarStatus = false;
              data.forEach((results) => {
                this.course = results.payload.doc.data()['course'];
                this.university = results.payload.doc.data()['university'];
              });
            } else {
              this.statusServ.progressBarStatus = false;
            }
          });
      } else {
        this.course = this.statusServ.courseName;
        this.university = this.statusServ.universityName;
      }
    });
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

  onSubmitAdd(){
    if (this.startTimeValue >= this.endTimeValue) {
      // this.snack.open(
      //   "Start Time can't Exceed End Time! Or Be Equal",
      //   '',
      //   this.noMatchConfig
      // );
    } else {
      if (this.endTimeValue <= this.startTimeValue) {
        // this.snack.open(
        //   "End Time can't be Less than Start Time!",
        //   '',
        //   this.noMatchConfig
        // );
      } else {
        this.servFirebase
          .getTimeCollision(this.university, this.course, this.dayValue)
          .subscribe((datas) => {
            if (datas.length !== 0) {
              datas.forEach((results) => {
                if (
                  !this.startArray.includes(results.payload.doc.data()['start'])
                ) {
                  this.startArray.push(
                    parseInt(
                      results.payload.doc.data()['start'].replace(':', '')
                    )
                  );
                }

                if (
                  !this.endArray.includes(results.payload.doc.data()['end'])
                ) {
                  this.endArray.push(
                    parseInt(results.payload.doc.data()['end'].replace(':', ''))
                  );
                }
              });

              for (let i = 0; i < this.startArray.length; i++) {
                if (
                  parseInt(this.startTimeValue.replace(':', '')) >=
                    this.startArray[i] &&
                  parseInt(this.startTimeValue.replace(':', '')) <=
                    this.endArray[i]
                ) {
                  // this.snack.open(
                  //   'Start time already exist!',
                  //   '',
                  //   this.noMatchConfig
                  // );
                  this.startArrayStatus = false;
                } else {
                  this.startArrayStatus = true;
                }
              }

              for (let i = 0; i < this.endArray.length; i++) {
                if (
                  parseInt(this.endTimeValue.replace(':', '')) >=
                    this.startArray[i] &&
                  parseInt(this.endTimeValue.replace(':', '')) <=
                    this.endArray[i]
                ) {
                  // this.snack.open(
                  //   'End time already exist!',
                  //   '',
                  //   this.noMatchConfig
                  // );
                  this.endArrayStatus = false;
                } else {
                  this.endArrayStatus = true;
                }
              }

              if (
                this.startArrayStatus === true &&
                this.endArrayStatus === true
              ) {
                this.servFirebase
                  .uploadTimetable(
                    {
                      dayName: this.dayValue,
                      subjName: this.subjectValue,
                      type: this.typeValue,
                      location: this.locationValue,
                      start: this.startTimeValue,
                      end: this.endTimeValue,
                      comment: this.comment,
                      collision: this.collision
                    },
                    this.university,
                    this.course
                  )
                  .then(() => {
                    this.dayValue = '';
                    this.subjectValue = '';
                    this.startTimeValue = '';
                    this.locationValue = '';
                    this.startTimeValue = '';
                    this.endTimeValue = '';
                    this.startArray = [];
                    this.endArray = [];
                    this.startArrayStatus = false;
                    this.endArrayStatus = false;
                    //this.snack.open('Successful Added', '', { duration: 2000 });
                  });
              }
            } else {
              //No data So user can just post timetable.
              this.servFirebase
                .uploadTimetable(
                  {
                    dayName: this.dayValue,
                    subjName: this.subjectValue,
                    type: this.typeValue,
                    location: this.locationValue,
                    start: this.startTimeValue,
                    end: this.endTimeValue,
                    comment: this.comment,
                  },
                  this.university,
                  this.course
                )
                .then(() => {
                  this.dayValue = '';
                  this.subjectValue = '';
                  this.startTimeValue = '';
                  this.endTimeValue = '';
                  this.startArray = [];
                  this.endArray = [];
                  this.startArrayStatus = false;
                  this.endArrayStatus = false;
                  //this.snack.open('Successful Added', '', { duration: 2000 });
                });
            }
          });
      }
    }
  }

}
