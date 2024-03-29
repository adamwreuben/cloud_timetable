import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';
import { UniversityCourse } from '../account/login/unicourse.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  allCourseInitials: any;

  courseSub;
  universitySub;
  docIdSub: any;

  noData: any;
  onlineStatus: any;

  docIdReal;
  subjectLong;
  subjectShort;
  teacherName;
  teacherEmail;
  teacherPhoneNo;
  teacherRoom;

  isVisibleMiddle = false;
  isVisibleMiddleUpdate = false;
  visible = false;

  nameInfo;
  shortInfo;
  emailInfo;
  phoneNoInfo;
  roomInfo;
  subjectinfo;
  showSkeleton: boolean;
  docIdAdmin: string;
  adminType: any;
  course: any;
  university: any;

  constructor(
    private firebaseService: FirebaseAllService,
    public statuService: StatusServeService,
    private auth: AngularFireAuth,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  open(
    short: any,
    name: any,
    email: any,
    phoneNo: any,
    room: any,
    subject: any
  ): void {
    this.visible = true;
    this.shortInfo = short;
    this.nameInfo = name;
    this.emailInfo = email;
    this.phoneNoInfo = phoneNo;
    this.roomInfo = room;
    this.subjectinfo = subject;
  }

  close(): void {
    this.visible = false;
  }

  handleCancelDrawer() {
    console.log('drawer closing');
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
    this.firebaseService.updateCourseInitial(
      this.docIdReal,
      this.universitySub,
      this.courseSub,
      this.subjectShort,
      this.subjectLong,
      this.teacherName,
      this.teacherEmail,
      this.teacherPhoneNo,
      this.teacherRoom
    );
    this.isVisibleMiddleUpdate = false;
  }

  handleCancelMiddleUpdate(): void {
    this.isVisibleMiddleUpdate = false;
  }

  cancel() {}

  deleteData(docId: any, university: any, course: any) {
    this.firebaseService.deleteCourseInitial(docId, university, course);
    this.loadSubjects();
  }

  showModalMiddleUpdate(
    docId: any,
    university: any,
    course: any,
    subjectShorts: any,
    subjectLongs: any,
    teacherNames: any,
    teacherEmails: any,
    teacherPhones: any,
    teacherRooms: any
  ): void {
    this.isVisibleMiddleUpdate = true;

    this.docIdReal = docId;
    this.universitySub = university;
    this.courseSub = course;
    this.subjectShort = subjectShorts;
    this.subjectLong = subjectLongs;
    this.teacherName = teacherNames;
    this.teacherEmail = teacherEmails;
    this.teacherPhoneNo = teacherPhones;
    this.teacherRoom = teacherRooms;
  }

  onSubmitUpdate() {
    this.firebaseService.updateCourseInitial(
      this.docIdReal,
      this.universitySub,
      this.courseSub,
      this.subjectShort,
      this.subjectLong,
      this.teacherName,
      this.teacherEmail,
      this.teacherPhoneNo,
      this.teacherRoom
    );
  }

  onSubmitSubj() {
    this.statuService.progressBarStatus = true;
    this.firebaseService
      .uploadShortAndLongForm(
        this.adminType === 'collaborate'
          ? this.statuService.universityNameService
          : this.university,
        this.adminType === 'collaborate'
          ? this.statuService.courseNameService
          : this.course,
        {
          subjectShort: this.subjectShort,
          subjectLong: this.subjectLong,
          teacherName: this.teacherName,
          teacherEmail: this.teacherEmail,
          teacherPhone: this.teacherPhoneNo,
          teacherRoom: this.teacherRoom,
        }
      )
      .then(() => {
        this.statuService.progressBarStatus = false;
        this.notification.create('success', '😁', 'Subject is Added!', {
          nzDuration: 2000,
          nzPlacement: 'bottomLeft',
        });
        this.subjectShort = '';
        this.subjectLong = '';
        this.teacherName = '';
        this.teacherEmail = '';
        this.teacherPhoneNo = '';
        this.teacherRoom = '';
      });
  }

  loadSubjects() {
    this.showSkeleton = true;
    this.statuService.progressBarStatus = true;
    this.auth.authState.subscribe((userData) => {
      if (userData !== null) {
        this.firebaseService
          .checkAdminType(userData.email)
          .subscribe((data) => {
            if (data !== null) {
              this.statuService.progressBarStatus = false;
              this.noData = false;
              data.forEach((results) => {
                this.docIdSub = results.payload.doc.id;
                this.docIdAdmin = results.payload.doc.id;
                // tslint:disable-next-line: no-string-literal
                this.adminType = results.payload.doc.data()['type'];
                // tslint:disable-next-line: no-string-literal
                this.statuService.courseNameService = results.payload.doc.data()[
                  'course'
                ];
                // tslint:disable-next-line: no-string-literal
                this.statuService.universityNameService = results.payload.doc.data()[
                  'university'
                ];

                if (this.adminType === 'collaborate') {
                  this.firebaseService
                    .getCourseLongAndShort(
                      this.statuService.universityNameService,
                      this.statuService.courseNameService
                    )
                    .subscribe((datas) => {
                      if (datas.length !== 0) {
                        this.noData = false;
                        this.showSkeleton = false;
                        this.allCourseInitials = datas;
                      } else {
                        this.noData = true;
                      }
                    });
                } else {
                  // Load that uid origin CR created the course
                  this.firebaseService
                    .getUniversityCourse(userData.uid)
                    .subscribe((datasOgs) => {
                      if (datasOgs.length !== 0) {
                        datasOgs.forEach((resultsOg) => {
                          // tslint:disable-next-line: no-string-literal
                          this.course = resultsOg.payload.doc.data()['course'];
                          // tslint:disable-next-line: no-string-literal
                          this.university = resultsOg.payload.doc.data()[
                            'university'
                          ];
                          this.firebaseService
                            .getCourseLongAndShort(this.university, this.course)
                            .subscribe((datasOg) => {
                              if (datasOg.length !== 0) {
                                this.noData = false;
                                this.showSkeleton = false;
                                this.allCourseInitials = datasOg;
                              } else {
                                this.noData = true;
                              }
                            });
                        });
                      } else {
                      }
                    });
                }
              });
            } else {
              // No data
              this.noData = true;
            }
          });
      }
    });
  }
}
