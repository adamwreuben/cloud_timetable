import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FirebaseAllService } from 'src/app/AllServices/firebase-all.service';
import { StatusServeService } from 'src/app/AllServices/status-serve.service';

@Component({
  selector: 'app-thursday',
  templateUrl: './thursday.component.html',
  styleUrls: ['./thursday.component.css']
})
export class ThursdayComponent implements OnInit {

  isVisibleMiddle = false;
  timeThursdayObjectFromFirebase: any;
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

  constructor(
    private firebaseService: FirebaseAllService,
    public statuService: StatusServeService,
    private afAuth: AngularFireAuth,
    private notification: NzNotificationService,
    private router: Router
  ) { }

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

  onSubmit(){
    this.firebaseService.updateTimeTable(
      this.docId,
      this.university,
      this.course,
      this.dayValue,
      this.subjectValue,
      this.typeValue,
      this.locationValue,
      this.startTimeValue,
      this.endTimeValue,
      this.comments
      );
  }


  cancel(){
  }

  loadDatabase() {
    this.afAuth.authState.subscribe((userData) => {
      if (userData !== null) {
        this.firebaseService
          .getUniversityCourse(userData.uid)
          .subscribe((data) => {
            if (data.length !== 0) {
              data.forEach((results) => {
                this.course = results.payload.doc.data()['course'];
                this.university = results.payload.doc.data()['university'];

                this.firebaseService
                  .getTimetable(this.university, this.course, 'Thursday')
                  .subscribe((thursday) => {
                    if (thursday.length !== 0) {
                      this.noData = false;
                      this.timeThursdayObjectFromFirebase = thursday;
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
              // this.snack.open(
              //   'Set Your University and Your Course Class',
              //   '',
              //   { duration: 2000 }
              // );
            }
          });
      } else {
        this.router.navigate(['/']);
      }
    });
  }

}
