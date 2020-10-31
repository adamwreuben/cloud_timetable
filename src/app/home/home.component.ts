import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allCourseInitials: any;

  course: any;
  university: any;

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
                    this.allCourseInitials = datas;
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
