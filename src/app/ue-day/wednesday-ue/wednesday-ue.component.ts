import { Component, OnInit, DoCheck } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAllService } from 'src/app/AllServices/firebase-all.service';
import { StatusServeService } from 'src/app/AllServices/status-serve.service';

@Component({
  selector: 'app-wednesday-ue',
  templateUrl: './wednesday-ue.component.html',
  styleUrls: ['./wednesday-ue.component.css']
})
export class WednesdayUeComponent implements OnInit, DoCheck {
  isVisibleMiddle = false;
  timeWednesdayObjectFromFirebase: any;
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
  showSkeleton: boolean;
  docIdAdmin: string;
  adminType: any;

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
      this.universitys,
      this.courses,
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
    this.showSkeleton = true;
    this.afAuth.authState.subscribe((datauser) => {
      if (datauser !== null) {
        this.firebaseService
          .checkAdminType(datauser.email)
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
                  this.firebaseService.getTimetableUe(this.statuService.universityNameService,
                    this.statuService.courseNameService, this.statuService.weekSelected, 'Wednesday')
                  .subscribe(wednesday => {
                    if (wednesday.length !== 0){
                      this.noData = false;
                      this.showSkeleton = false;
                      this.timeWednesdayObjectFromFirebase = wednesday;
                      this.statuService.progressBarStatus = false;
                    }else{
                      // No data
                      this.noData = true;
                      this.statuService.progressBarStatus = false;
                    }
                  });

                } else {
                  // Load that uid origin CR created the course
                  this.firebaseService.getUniversityCourse(datauser.uid).subscribe(datas => {
                    if (datas.length !== 0){
                      this.statuService.progressBarStatus = false;

                      datas.forEach(results => {
                        // tslint:disable-next-line: no-string-literal
                        this.course = results.payload.doc.data()['course'];
                        // tslint:disable-next-line: no-string-literal
                        this.university = results.payload.doc.data()['university'];

                        this.firebaseService.getTimetableUe(this.university, this.course, this.statuService.weekSelected, 'Wednesday')
                        .subscribe(wednesday => {

                          if (wednesday.length !== 0){
                            this.noData = false;
                            this.showSkeleton = false;
                            this.timeWednesdayObjectFromFirebase = wednesday;
                            this.statuService.progressBarStatus = false;
                          }else{
                            // No data
                            this.noData = true;
                            this.statuService.progressBarStatus = false;
                          }

                        });
                      });
                    }else{
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
