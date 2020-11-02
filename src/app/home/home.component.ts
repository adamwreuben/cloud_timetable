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

  subjectLong;
  subjectShort;
  teacherName;
  teacherEmail;
  teacherPhoneNo;
  teacherRoom;

  isVisibleMiddle = false;
  isVisibleMiddleUpdate = false;


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
                this.courseSub = results.payload.doc.data()['course'];
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
              //No data
              this.noData = true;
            }
          });
      }
    });
  }

}
