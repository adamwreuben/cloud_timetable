import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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

  constructor(
    private firebaseService: FirebaseAllService,
    public statuService: StatusServeService,
    private auth: AngularFireAuth,
    private router: Router,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.loadSubjects();
  }


  open(short: any, name: any, email: any, phoneNo: any, room: any, subject: any): void {
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

  handleCancelDrawer(){
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

  cancel(){
  }

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

  onSubmitUpdate(){
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

  onSubmitSubj(){
    this.statuService.progressBarStatus = true;
    this.firebaseService
      .uploadShortAndLongForm(this.universitySub, this.courseSub, {
        subjectShort: this.subjectShort,
        subjectLong: this.subjectLong,
        teacherName: this.teacherName,
        teacherEmail: this.teacherEmail,
        teacherPhone: this.teacherPhoneNo,
        teacherRoom: this.teacherRoom,
      })
      .then(() => {
        this.statuService.progressBarStatus = false;
        this.notification.create(
          'success',
          '😁',
          'Subject is Added!',
          {
            nzDuration: 2000,
            nzPlacement: 'bottomLeft'
          }
        );
        this.subjectShort = '';
        this.subjectLong = '';
        this.teacherName = '';
        this.teacherEmail = '';
        this.teacherPhoneNo = '';
        this.teacherRoom = '';
      });
  }

  loadSubjects() {
    this.statuService.progressBarStatus = true;
    this.auth.authState.subscribe((userData) => {
      if (userData !== null) {
        this.firebaseService
          .getUniversityCourse(userData.uid)
          .subscribe((data) => {
            if (data !== null) {
              this.statuService.progressBarStatus = false;
              this.noData = false;
              data.forEach((results) => {
                this.docIdSub = results.payload.doc.id;
                // tslint:disable-next-line: no-string-literal
                this.courseSub = results.payload.doc.data()['course'];
                // tslint:disable-next-line: no-string-literal
                this.universitySub = results.payload.doc.data()['university'];
                this.firebaseService
                  .getCourseLongAndShort(this.universitySub, this.courseSub)
                  .subscribe((datas) => {
                    if (datas.length !== 0){
                      this.noData = false;
                      this.allCourseInitials = datas;
                    }else{
                      this.noData = true;
                    }
                  });
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
