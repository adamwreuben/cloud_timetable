import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAllService } from 'src/app/AllServices/firebase-all.service';
import { StatusServeService } from 'src/app/AllServices/status-serve.service';

@Component({
  selector: 'app-tuesday',
  templateUrl: './tuesday.component.html',
  styleUrls: ['./tuesday.component.css']
})
export class TuesdayComponent implements OnInit {

  isVisibleMiddle = false;
  timeTuesdayObjectFromFirebase: any;
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

  constructor(
    private firebaseService: FirebaseAllService,
    private statuService: StatusServeService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDatabase();
  }

  deleteData(docId: any, university: any, course: any) {

    this.loadDatabase();
  }

  loadDatabase() {
    this.afAuth.authState.subscribe((userData) => {
      if (userData !== null) {
        this.firebaseService
          .getUniversityCourse(userData.uid)
          .subscribe((data) => {
            if (data.length != 0) {
              this.statuService.progressBarStatus = false;
              data.forEach((results) => {
                this.course = results.payload.doc.data()['course'];
                this.university = results.payload.doc.data()['university'];

                this.firebaseService
                  .getTimetable(this.university, this.course, 'Tuesday')
                  .subscribe((tuesday) => {
                    if (tuesday.length != 0) {
                      this.noData = false;

                      this.timeTuesdayObjectFromFirebase = tuesday;
                      this.statuService.progressBarStatus = false;
                    } else {
                      //No data
                      this.noData = true;

                      this.statuService.progressBarStatus = false;
                    }
                  });
              });
            } else {
              //No data

            }
          });
      } else {
        this.router.navigate(['/']);
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

  onSubmit(){

  }

  confirm(){

  }

  cancel(){
  }

}
