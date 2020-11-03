import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FirebaseAllService } from 'src/app/AllServices/firebase-all.service';
import { StatusServeService } from 'src/app/AllServices/status-serve.service';
import { WednesdayUeComponent } from '../../ue-day/wednesday-ue/wednesday-ue.component';

@Component({
  selector: 'app-wednesday',
  templateUrl: './wednesday.component.html',
  styleUrls: ['./wednesday.component.css']
})
export class WednesdayComponent implements OnInit {

  isVisibleMiddle = false;
  timeWednesdayObjectFromFirebase: any;
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
    this.showSkeleton = true;
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
                  .getTimetable(this.university, this.course, 'Wednesday')
                  .subscribe((wednesday) => {
                    if (wednesday.length !== 0) {
                      this.noData = false;
                      this.showSkeleton = false;
                      this.timeWednesdayObjectFromFirebase = wednesday;
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
