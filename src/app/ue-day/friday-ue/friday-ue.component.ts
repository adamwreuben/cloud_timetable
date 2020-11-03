import { Component, OnInit, DoCheck } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAllService } from 'src/app/AllServices/firebase-all.service';
import { StatusServeService } from 'src/app/AllServices/status-serve.service';

@Component({
  selector: 'app-friday-ue',
  templateUrl: './friday-ue.component.html',
  styleUrls: ['./friday-ue.component.css']
})
export class FridayUeComponent implements OnInit, DoCheck {
  isVisibleMiddle = false;
  timeFridayObjectFromFirebase: any;
  university: any;
  course: any;

  selectedWeek;
  dayValue;
  subjectValue;
  locationValue;
  startTimeValue;
  endTimeValue;

  docIds: any;
  universitys: any;
  courses: any;
  dateValue: any;
  week: any;

  currentWeek: any;

  noData: any;
  onlineStatus: any;

  constructor(
    private firebaseService: FirebaseAllService,
    public statuService: StatusServeService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDatabase();
    this.currentWeek = this.statuService.weekSelected;

    this.statuService.checkOnlineStatus$().subscribe((isOnline) => {
      this.onlineStatus = isOnline;
    });
  }

  ngDoCheck(){
    if (this.statuService.weekSelected !== this.currentWeek){
      this.loadDatabase();
      this.currentWeek = this.statuService.weekSelected;
    }
  }

  deleteData(docId: any, university: any, course: any, week: any, day: any) {
    this.firebaseService.deleteTimetableUe(docId, university, course, week, day);
    this.loadDatabase();
  }


  handleOkMiddle(): void {
    this.isVisibleMiddle = false;
    this.onSubmit();
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  showModalMiddle(
    docId: any,
    university: any,
    course: any,
    days: any,
    subjects: any,
    locations: any,
    starts: any,
    ends: any,
    weeks: any,
    dates: any
  ): void {
    this.isVisibleMiddle = true;
    this.docIds = docId;
    this.universitys = university;
    this.courses = course;
    this.dayValue = days;
    this.subjectValue = subjects;
    this.locationValue = locations;
    this.startTimeValue = starts;
    this.endTimeValue = ends;
    this.week = weeks;
    this.dateValue = dates;

  }

  onSubmit(){
    this.firebaseService.updateUeTimeTable(
      this.docIds,
      this.university,
      this.course,
      this.dayValue,
      this.subjectValue,
      this.locationValue,
      this.startTimeValue,
      this.endTimeValue,
      this.statuService.weekSelected,
      this.dateValue
      );
  }



  cancel(){
  }

  loadDatabase(){
    this.afAuth.authState.subscribe(userData => {
      this.firebaseService.getUniversityCourse(userData.uid).subscribe(data => {
        if (data.length !== 0){
          this.statuService.progressBarStatus = false;

          data.forEach(results => {
            // tslint:disable-next-line: no-string-literal
            this.course = results.payload.doc.data()['course'];
            // tslint:disable-next-line: no-string-literal
            this.university = results.payload.doc.data()['university'];

            this.firebaseService.getTimetableUe(this.university, this.course, this.statuService.weekSelected, 'Friday').subscribe(friday => {

              if (friday.length !== 0){
                this.noData = false;
                this.timeFridayObjectFromFirebase = friday;
                this.statuService.progressBarStatus = false;
              }else{
                // No data
                this.noData = true;
                this.statuService.progressBarStatus = false;
              }

            });
          });
        }else{
          // No data
          // this.snack.open("Set Your University and Your Course Class","",{duration:2000})

        }

      });
    });
  }

}
