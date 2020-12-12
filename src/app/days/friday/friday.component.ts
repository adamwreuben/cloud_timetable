import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FirebaseAllService } from 'src/app/AllServices/firebase-all.service';
import { StatusServeService } from 'src/app/AllServices/status-serve.service';

@Component({
  selector: 'app-friday',
  templateUrl: './friday.component.html',
  styleUrls: ['./friday.component.css'],
})
export class FridayComponent implements OnInit {
  isVisibleMiddle = false;
  timeFridayObjectFromFirebase: any;
  university: any;
  course: any;
  docId: any;

  dayValue;
  subjectValue;
  typeValue;
  locationValue;
  startTimeValue;
  endTimeValue;
  comments;

  noData: any;
  onlineStatus: any;
  showSkeleton: boolean;
  docIdAdmin: string;
  adminType: any;

  constructor(
    private firebaseService: FirebaseAllService,
    public statuService: StatusServeService,
    private afAuth: AngularFireAuth,
    private notification: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDatabase();
    this.statuService.checkOnlineStatus$().subscribe((isOnline) => {
      this.onlineStatus = isOnline;
    });
  }

  deleteData(docId: any, university: any, course: any, day: any) {
    this.firebaseService.deleteTimetableForDay(docId, university, course, day);
    this.loadDatabase();
  }

  handleOkMiddle(): void {
    this.onSubmit();
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  showModalMiddle(
    id: any,
    day: any,
    subject: any,
    location: any,
    type: any,
    start: any,
    end: any,
    comment: any
  ): void {
    this.docId = id;
    this.dayValue = day;
    this.subjectValue = subject;
    this.locationValue = location;
    this.typeValue = type;
    this.startTimeValue = start;
    this.endTimeValue = end;
    this.comments = comment;
    this.isVisibleMiddle = true;
  }

  onSubmit() {
    this.firebaseService.updateTimeTable(
      this.docId,
      this.adminType === 'collaborate' ? this.statuService.universityNameService : this.university,
      this.adminType === 'collaborate' ? this.statuService.courseNameService : this.course,
      this.dayValue,
      this.subjectValue,
      this.typeValue,
      this.locationValue,
      this.startTimeValue,
      this.endTimeValue,
      this.comments
    );
  }

  cancel() {}

  loadDatabase() {
    this.showSkeleton = true;
    this.afAuth.authState.subscribe((data) => {
      if (data !== null) {
        this.firebaseService
          .checkAdminType(data.email)
          .subscribe((userVerificationType) => {
            if (userVerificationType.length !== 0) {
              userVerificationType.forEach((resultsTypes) => {
                this.docIdAdmin = resultsTypes.payload.doc.id;
                // tslint:disable-next-line: no-string-literal
                this.adminType = resultsTypes.payload.doc.data()['type'];
                // tslint:disable-next-line: no-string-literal
                this.statuService.courseNameService = resultsTypes.payload.doc.data()['course'];
                // tslint:disable-next-line: no-string-literal
                this.statuService.universityNameService = resultsTypes.payload.doc.data()['university'];

                if (this.adminType === 'collaborate') {
                  this.firebaseService
                    .getTimetable(
                      this.statuService.universityNameService,
                      this.statuService.courseNameService,
                      'Friday'
                    )
                    .subscribe((friday) => {
                      if (friday.length !== 0) {
                        this.noData = false;
                        this.showSkeleton = false;
                        this.timeFridayObjectFromFirebase = friday;
                        this.statuService.progressBarStatus = false;
                      } else {
                        // No data
                        this.noData = true;
                        this.statuService.progressBarStatus = false;
                      }
                    });
                } else {
                  // Load that uid origin CR created the course
                  this.firebaseService
                    .getUniversityCourse(data.uid)
                    .subscribe((datas) => {
                      if (datas.length !== 0) {
                        datas.forEach((results) => {
                          // tslint:disable-next-line: no-string-literal
                          this.course = results.payload.doc.data()['course'];
                          // tslint:disable-next-line: no-string-literal
                          this.university = results.payload.doc.data()[
                            'university'
                          ];
                          this.firebaseService
                            .getTimetable(
                              this.university,
                              this.course,
                              'Friday'
                            )
                            .subscribe((friday) => {
                              if (friday.length !== 0) {
                                this.noData = false;
                                this.showSkeleton = false;
                                this.timeFridayObjectFromFirebase = friday;
                                this.statuService.progressBarStatus = false;
                              } else {
                                // No data
                                this.noData = true;
                                this.statuService.progressBarStatus = false;
                              }
                            });
                        });
                      } else {
                      }
                    });
                }
              });
            } else {
              this.router.navigate(['/']);
            }
          });
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
