import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';

@Component({
  selector: 'app-review-ue',
  templateUrl: './review-ue.component.html',
  styleUrls: ['./review-ue.component.css'],
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
  locationValue;
  startTimeValue;
  endTimeValue;

  // Arrays--->
  startArray = [];
  endArray = [];

  startArrayStatus = false;
  endArrayStatus = false;
  docIdSub: string;
  docIdAdmin: string;
  adminType: any;

  constructor(
    private servFirebase: FirebaseAllService,
    private auth: AngularFireAuth,
    private notification: NzNotificationService,
    public statusServ: StatusServeService
  ) {}

  ngOnInit(): void {
    this.auth.authState.subscribe((userData) => {
      if (userData !== null) {
        this.servFirebase
          .checkAdminType(userData.email)
          .subscribe((adminTypeDdata) => {
            if (adminTypeDdata !== null) {
              adminTypeDdata.forEach((typeResults) => {
                this.docIdSub = typeResults.payload.doc.id;
                this.docIdAdmin = typeResults.payload.doc.id;
                // tslint:disable-next-line: no-string-literal
                this.adminType = typeResults.payload.doc.data()['type'];
                // tslint:disable-next-line: no-string-literal
                this.statusServ.courseNameService = typeResults.payload.doc.data()['course'];
                // tslint:disable-next-line: no-string-literal
                this.statusServ.universityNameService = typeResults.payload.doc.data()['university'];

                if (this.adminType !== 'collaborate') {
                  this.servFirebase
                    .getUniversityCourse(userData.uid)
                    .subscribe((ogUserData) => {
                      if (ogUserData.length !== 0) {
                        ogUserData.forEach((ogTypeEachData) => {
                          // tslint:disable-next-line: no-string-literal
                          this.course = ogTypeEachData.payload.doc.data()['course'];
                          // tslint:disable-next-line: no-string-literal
                          this.university = ogTypeEachData.payload.doc.data()['university'];
                        });
                      } else {
                        // No data
                      }
                    });
                }
              });
            }
          });
      }
    });
  }

  weekChange() {
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

  onSubmit() {
    if (this.startTimeValue >= this.endTimeValue) {
      this.notification.create(
        'warning',
        'Something is Wrong😡',
        "Start Time can't Exceed End Time! Or Be Equal",
        {
          nzDuration: 2000,
          nzPlacement: 'bottomLeft',
        }
      );
    } else {
      if (this.endTimeValue <= this.startTimeValue) {
        this.notification.create(
          'warning',
          'Something is Wrong😡',
          "End Time can't be Less than Start Time Or Be Equal!",
          {
            nzDuration: 2000,
            nzPlacement: 'bottomLeft',
          }
        );
      } else {
        this.servFirebase
          .getTimeCollisionUE(
            this.adminType === 'collaborate'
              ? this.statusServ.universityNameService
              : this.university,
            this.adminType === 'collaborate'
              ? this.statusServ.courseNameService
              : this.course,
            this.dayValue,
            this.selectedWeek
          )
          .subscribe((datas) => {
            if (datas.length !== 0) {
              datas.forEach((results) => {
                if (
                  !this.startArray.includes(results.payload.doc.data().start)
                ) {
                  this.startArray.push(
                    parseInt(results.payload.doc.data().start.replace(':', ''))
                  );
                }

                if (!this.endArray.includes(results.payload.doc.data().end)) {
                  this.endArray.push(
                    parseInt(results.payload.doc.data().end.replace(':', ''))
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
                      nzPlacement: 'bottomLeft',
                    }
                  );
                  this.endArrayStatus = false;
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
                      nzPlacement: 'bottomLeft',
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
                  .uploadUeTimetable(
                    {
                      dayName: this.dayValue,
                      dateUe: String(this.dateValue),
                      subjName: this.subjectValue,
                      location: this.locationValue,
                      start: this.startTimeValue,
                      end: this.endTimeValue,
                    },
                    this.adminType === 'collaborate'
                      ? this.statusServ.universityNameService
                      : this.university,
                    this.adminType === 'collaborate'
                      ? this.statusServ.courseNameService
                      : this.course,
                    this.selectedWeek
                  )
                  .then(() => {
                    this.statusServ.progressBarStatus = false;
                    this.dayValue = '';
                    this.subjectValue = '';
                    this.startTimeValue = '';
                    this.locationValue = '';
                    this.endTimeValue = '';
                    this.notification.create(
                      'success',
                      'Everything Looks Fine😁',
                      'Timetable is Added!',
                      {
                        nzDuration: 2000,
                        nzPlacement: 'bottomLeft',
                      }
                    );
                  });
              }
            } else {
              // No data So user can just post timetable.

              this.statusServ.progressBarStatus = true;
              this.servFirebase
                .uploadUeTimetable(
                  {
                    dayName: this.dayValue,
                    dateUe: String(this.dateValue),
                    subjName: this.subjectValue,
                    location: this.locationValue,
                    start: this.startTimeValue,
                    end: this.endTimeValue,
                  },
                  this.adminType === 'collaborate'
                    ? this.statusServ.universityNameService
                    : this.university,
                  this.adminType === 'collaborate'
                    ? this.statusServ.courseNameService
                    : this.course,
                  this.selectedWeek
                )
                .then(() => {
                  this.statusServ.progressBarStatus = false;
                  this.dayValue = '';
                  this.subjectValue = '';
                  this.startTimeValue = '';
                  this.locationValue = '';
                  this.endTimeValue = '';
                  this.notification.create(
                    'success',
                    'Everything Looks Fine😁',
                    'Timetable is Added!',
                    {
                      nzDuration: 2000,
                      nzPlacement: 'bottomLeft',
                    }
                  );
                });
            }
          });
      }
    }
  }
}
