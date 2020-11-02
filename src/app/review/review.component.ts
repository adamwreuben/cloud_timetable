import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NzNotificationService } from 'ng-zorro-antd/notification';
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

  allCourseInitials: any;

  showSpinner: boolean = false;
  comment = 'No Info';

  //Arrays--->
  startArray = [];
  endArray = [];

  startArrayStatus: boolean = false;
  endArrayStatus: boolean = false;


  constructor(
    public statusServ: StatusServeService,
    public servFirebase: FirebaseAllService,
    private notification: NzNotificationService,
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
              this.loadSubjects();
            } else {
              this.statusServ.progressBarStatus = false;
            }
          });
      } else {
        //No user data.
      }
    });
  }

  handleOkMiddle(): void {
    this.isVisibleMiddle = false;
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
    this.dayValue = '';
    this.subjectValue = '';
    this.startTimeValue = '';
    this.typeValue = '';
    this.locationValue = '';
    this.startTimeValue = '';
    this.endTimeValue = '';
    this.startArray = [];
    this.endArray = [];
    this.startArrayStatus = false;
    this.endArrayStatus = false;
  }

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }

  onSubmitAdd(){

    console.log('day: ', this.dayValue);
    console.log('subj: ', this.subjectValue);
    console.log('type: ', this.typeValue);
    console.log('start: ', this.startTimeValue);
    console.log('end: ', this.endTimeValue);

    if (this.startTimeValue >= this.endTimeValue) {

      this.notification.create(
        'warning',
        'Something is Wrong😡',
        'Start Time can\'t Exceed End Time! Or Be Equal',
        {
          nzDuration: 2000,
          nzPlacement: 'bottomLeft'
        }
      );
    } else {
      if (this.endTimeValue <= this.startTimeValue) {

        this.notification.create(
          'warning',
          'Something is Wrong😡',
          'End Time can\'t be Less than Start Time Or Be Equal!',
          {
            nzDuration: 2000,
            nzPlacement: 'bottomLeft'
          }
        );
      } else {
        this.servFirebase
          .getTimeCollision(this.university, this.course, this.dayValue)
          .subscribe((datas) => {
            if (datas !==  null) {
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
                  this.notification.create(
                    'warning',
                    'Something is Wrong😡',
                    'Start time already exist!',
                    {
                      nzDuration: 2000,
                      nzPlacement: 'bottomLeft'
                    }
                  );
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
                  this.notification.create(
                    'warning',
                    'Something is Wrong😡',
                    'End time already exist!',
                    {
                      nzDuration: 2000,
                      nzPlacement: 'bottomLeft'
                    }
                  );
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
                    },
                    this.university,
                    this.course
                  )
                  .then(() => {
                    this.dayValue = '';
                    this.subjectValue = '';
                    this.startTimeValue = '';
                    this.typeValue = '';
                    this.locationValue = '';
                    this.startTimeValue = '';
                    this.endTimeValue = '';
                    this.startArray = [];
                    this.endArray = [];
                    this.startArrayStatus = false;
                    this.endArrayStatus = false;
                    this.notification.create(
                      'success',
                      'Everything Looks Fine😁',
                      'Timetable is Added!',
                      {
                        nzDuration: 2000,
                        nzPlacement: 'bottomLeft'
                      }
                    );
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

                  this.notification.create(
                    'success',
                    'Everything Looks Fine😁',
                    'Timetable is Added!',
                    {
                      nzDuration: 2000,
                      nzPlacement: 'bottomLeft'
                    }
                  );
                });
            }
          });
      }
    }
  }

  loadSubjects() {
    this.statusServ.progressBarStatus = true;
    this.auth.authState.subscribe((userData) => {
      if (userData !== null) {
        this.servFirebase
          .getUniversityCourse(userData.uid)
          .subscribe((data) => {
            if (data !== null) {
              this.statusServ.progressBarStatus = false;
              //this.noData = false;
              data.forEach((results) => {

                this.servFirebase
                  .getCourseLongAndShort(this.university, this.course)
                  .subscribe((datas) => {
                    if (datas.length !== 0){
                      //this.noData = false;
                      this.allCourseInitials = datas;
                      this.statusServ.subjectInitialForAll = datas;
                    }else{
                      //this.noData = true;
                    }
                  });
              });
            } else {
              //No data
              //this.noData = true;
            }
          });
      }
    });
  }

}
