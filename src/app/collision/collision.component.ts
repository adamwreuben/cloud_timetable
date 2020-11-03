import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';
import { CollisionModel } from './collision.model';

@Component({
  selector: 'app-collision',
  templateUrl: './collision.component.html',
  styleUrls: ['./collision.component.css']
})
export class CollisionComponent implements OnInit {

  selectedCourse;
  selectedSubject: any = 'MT 100';

  course: any;
  university: any;

  courseMe: any;
  universityMe: any;

  collisionTime: any;

  noData: any;
  onlineStatus: any;

  showSelectSubject: boolean = false;
  showSelectDay: boolean = false;
  showPleaseSelect: boolean = false;

  allCourseFromFirebase: any;
  allSubjectFromFirebase: any;
  collisionResultsFromFirebase: any;
  subjectSelected:any;

  //Arrays--->
  startArray: CollisionModel[] = [];
  startArrayOther = [];
  endArray: CollisionModel[] = [];
  endArrayOther = [];

  startTimeOtherCollided: any;
  endTimeOtherCollided: any;




  startArrayStatus: boolean = false;
  endArrayStatus: boolean = false;

  dayValue;
  subjectValue;
  typeValue;
  locationValue;
  startTimeValue;
  endTimeValue;

  comment = 'No Info';

  constructor(
    private afAuth: AngularFireAuth,
    private statuService: StatusServeService,
    private router: Router,
    private firebaseService: FirebaseAllService
  ) {}



  ngOnInit(): void {
    this.loadCourses();
    this.statuService.checkOnlineStatus$().subscribe((isOnline) => {
      this.onlineStatus = isOnline;
    });
  }

  ngDoCheck(){
    // if(this.showPleaseSelect === true){
    //   console.log("start Status: ",this.startArrayStatus);
    //   console.log("end Status: ",this.endArrayStatus);

    // }
  }

  loadCourses() {
    this.firebaseService.getUniversityCourseOnly().subscribe((results) => {
      if (results !== null) {
        this.allCourseFromFirebase = results;
      } else {
        //No COURSES
      }
    });
  }

  loadSubjectsOnly(value: any) {
    this.showSelectSubject = true;
    this.course = value;

    this.statuService.progressBarStatus = true;

    if(this.startArray.length !== 0){
      this.startArray = [];
      this.showSelectDay = false;
      this.showSelectSubject = false;
      this.collisionResultsFromFirebase = undefined;
    }

    if(this.endArray.length !== 0){
      this.endArray = [];
      this.showSelectDay = false;
      this.showSelectSubject = false;
      this.collisionResultsFromFirebase = undefined;

    }

    if(this.startArrayOther.length !== 0){
      this.startArrayOther = [];
      this.showSelectDay = false;
      this.showSelectSubject = false;
      this.collisionResultsFromFirebase = undefined;
    }

    if(this.endArrayOther.length !== 0){
      this.endArrayOther = [];
      this.showSelectDay = false;
      this.showSelectSubject = false;
      this.collisionResultsFromFirebase = undefined;
    }

    if (this.statuService.courseName === null) {
      this.afAuth.authState.subscribe((userData) => {
        if (userData !== null) {
          this.firebaseService
            .getUniversityCourse(userData.uid)
            .subscribe((data) => {
              if (data.length != 0) {
                this.statuService.progressBarStatus = false;

                data.forEach((results) => {
                  this.university = results.payload.doc.data()['university'];
                  this.firebaseService
                    .getCourseLongAndShort(this.university, this.course)
                    .subscribe((subjectResults) => {
                      if (subjectResults !== null) {
                        this.noData = false;
                        this.allSubjectFromFirebase = subjectResults;
                        this.statuService.progressBarStatus = false;
                      } else {
                        //NO subject
                        this.noData = true;
                        this.statuService.progressBarStatus = false;
                      }
                    });
                });
              } else {
                //No data
                this.statuService.progressBarStatus = false;

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
    } else {
      this.university = this.statuService.universityName;
      this.firebaseService
        .getCourseLongAndShort(this.university, this.course)
        .subscribe((subjectResults) => {
          if (subjectResults !== null) {
            this.noData = false;
            this.allSubjectFromFirebase = subjectResults;
            this.statuService.progressBarStatus = false;
          } else {
            //NO subject
            this.noData = true;
            this.statuService.progressBarStatus = false;
          }
        });
    }
  }

  showDays(value:any) {
    this.showSelectDay = true;
    this.subjectSelected = value;

    if(this.startArray.length !== 0){
      this.startArray = [];
      this.collisionResultsFromFirebase = undefined;
    }

    if(this.endArray.length !== 0){
      this.endArray = [];
      this.collisionResultsFromFirebase = undefined;

    }

    if(this.startArrayOther.length !== 0){
      this.startArrayOther = [];
      this.collisionResultsFromFirebase = undefined;

    }

    if(this.endArrayOther.length !== 0){
      this.endArrayOther = [];
      this.collisionResultsFromFirebase = undefined;

    }
  }

  setDayValue(value: any) {
    this.dayValue = value;
    this.statuService.progressBarStatus = true;

    if(this.startArray.length !== 0){
      this.startArray = [];
      this.collisionResultsFromFirebase = undefined;
    }

    if(this.endArray.length !== 0){
      this.endArray = [];
      this.collisionResultsFromFirebase = undefined;

    }

    if(this.startArrayOther.length !== 0){
      this.startArrayOther = [];
      this.collisionResultsFromFirebase = undefined;
    }

    if(this.endArrayOther.length !== 0){
      this.endArrayOther = [];
      this.collisionResultsFromFirebase = undefined;
    }

    this.firebaseService
      .getTimeCollisionSubject(this.university, this.course, this.dayValue, this.subjectSelected)
      .subscribe((datas) => {
        if (datas.length !== 0) {
          this.statuService.progressBarStatus = false;

          datas.forEach((results) => {
            if (
              !this.startArrayOther.includes(
                results.payload.doc.data()['start']
              )
            ) {
              this.startArrayOther.push(
                results.payload.doc.data()['start']
              );
            }

            if (
              !this.endArrayOther.includes(results.payload.doc.data()['end'])
            ) {
              this.endArrayOther.push(
                results.payload.doc.data()['end']
              );
            }

            this.showFullCollsion();
          });
        } else {
         this.statuService.progressBarStatus = false;

        }
      });
  }

  showFullCollsion() {
    this.statuService.progressBarStatus = true;

    if (this.statuService.courseName === null) {
      this.afAuth.authState.subscribe((userData) => {
        if (userData !== null) {
          this.showPleaseSelect = true;
          this.firebaseService
            .getUniversityCourse(userData.uid)
            .subscribe((data) => {
              if (data.length !== 0) {
                data.forEach((results) => {
                  this.courseMe = results.payload.doc.data()['course'];
                  this.universityMe = results.payload.doc.data()['university'];

                  if (this.course === this.courseMe){
                    //this.snack.open('You Cant Check Collision Of Your Own Course!', '', {duration: 4000});
                  }else{
                    this.firebaseService
                    .getTimeCollision(
                      this.universityMe,
                      this.courseMe,
                      this.dayValue
                    )
                    .subscribe((timeCollisionReults) => {
                      if (timeCollisionReults.length !== 0) {
                        timeCollisionReults.forEach((meResults) => {
                          if (
                            !this.startArray.includes(
                              {
                                documentId: meResults.payload.doc.id,
                                subjName: meResults.payload.doc.data()['subject'],
                                type: meResults.payload.doc.data()['type'],
                                location: meResults.payload.doc.data()['location'],
                                start: meResults.payload.doc.data()['start'],
                                end: meResults.payload.doc.data()['end']
                              }
                            )
                          ) {
                            this.startArray.push({
                              documentId: meResults.payload.doc.id,
                              subjName: meResults.payload.doc.data()['subject'],
                              type: meResults.payload.doc.data()['type'],
                              location: meResults.payload.doc.data()['location'],
                              start: meResults.payload.doc.data()['start'],
                              end: meResults.payload.doc.data()['end']
                            });
                          }

                          if (
                            !this.endArray.includes(
                              {
                                documentId: meResults.payload.doc.id,
                                subjName: meResults.payload.doc.data()['subject'],
                                type: meResults.payload.doc.data()['type'],
                                location: meResults.payload.doc.data()['location'],
                                start: meResults.payload.doc.data()['start'],
                                end: meResults.payload.doc.data()['end']
                              }
                            )
                          ) {
                            this.endArray.push({
                              documentId: meResults.payload.doc.id,
                              subjName: meResults.payload.doc.data()['subject'],
                              type: meResults.payload.doc.data()['type'],
                              location: meResults.payload.doc.data()['location'],
                              start: meResults.payload.doc.data()['start'],
                              end: meResults.payload.doc.data()['end']
                            });
                          }

                        });


                        for(let otherStartIndex = 0; otherStartIndex < this.startArrayOther.length; otherStartIndex++){
                          for(let meStartIndex = 0; meStartIndex < this.startArray.length; meStartIndex++){
                            if (
                              parseInt(this.startArray[meStartIndex].start.replace(':', '')) >= parseInt(this.startArrayOther[otherStartIndex].replace(':','')) &&
                              parseInt(this.startArray[meStartIndex].start.replace(':', '')) <= parseInt(this.endArrayOther[otherStartIndex].replace(':',''))
                            ) {
                              // this.snack.open(
                              //   'Start Time Has Collided!',
                              //   '',
                              //   this.noMatchConfig
                              // );
                              this.statuService.progressBarStatus = false;
                              this.startArrayStatus = false;
                              this.collisionResultsFromFirebase = this.startArray[meStartIndex];
                              this.startTimeOtherCollided = this.startArrayOther[otherStartIndex];

                            } else {
                              this.statuService.progressBarStatus = false;
                              this.startArrayStatus = true;
                              // this.snack.open(
                              //   'No Start Time Has Collided!',
                              //   '',
                              //   this.matchConfig
                              // );
                            }
                          }
                        }

                        for(let otherEndIndex = 0; otherEndIndex < this.endArrayOther.length; otherEndIndex++){
                          for(let meEndIndex = 0; meEndIndex < this.endArray.length; meEndIndex++){
                            if (
                              parseInt(this.endArray[meEndIndex].end.replace(':', '')) >= parseInt(this.startArrayOther[otherEndIndex].replace(':','')) &&
                              parseInt(this.endArray[meEndIndex].end.replace(':', '')) <= parseInt(this.endArrayOther[otherEndIndex].replace(':',''))
                            ) {
                              this.statuService.progressBarStatus = false;
                              // this.snack.open(
                              //   'End Time Has Collided!',
                              //   '',
                              //   this.noMatchConfig
                              // );
                              this.endArrayStatus = false;
                              this.collisionResultsFromFirebase = this.endArray[meEndIndex];
                              this.endTimeOtherCollided = this.endArrayOther[otherEndIndex];

                            } else {
                              this.statuService.progressBarStatus = false;
                              this.endArrayStatus = true;
                              // this.snack.open(
                              //   'No End Time Has Collided!',
                              //   '',
                              //   this.matchConfig
                              // );
                            }
                          }
                        }


                      }else{
                        this.showSelectSubject = true;
                        // this.snack.open(
                        //    'No Timetable On '+ this.dayValue,
                        //   '',
                        //   this.matchConfig
                        // );
                      }
                    });
                  }


                });
              }
              else {
                this.statuService.progressBarStatus = false;
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
    } else {
      this.showPleaseSelect = true;
      this.courseMe = this.statuService.courseName;
      this.universityMe = this.statuService.universityName;
      this.statuService.progressBarStatus = false;
    }
  }
}
