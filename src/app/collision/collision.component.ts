import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';
import { CollisionModel } from './collision.model';

@Component({
  selector: 'app-collision',
  templateUrl: './collision.component.html',
  styleUrls: ['./collision.component.css']
})
export class CollisionComponent implements OnInit {

  selectedCourse = undefined;

  courseMe: any;
  universityMe: any;

  collisionTime: any;

  noData: any;
  onlineStatus: any;

  showSelectSubject = false;
  showSelectDay = false;
  showPleaseSelect = false;

  allCourseFromFirebase: any;
  allSubjectFromFirebase: any;

  subjectSelected: any;

  // Arrays--->
  startArray: CollisionModel[] = [];
  startArrayOther: CollisionModel[] = [];
  endArray: CollisionModel[] = [];
  endArrayOther: CollisionModel[] = [];
  collisionResultsFromFirebase: CollisionModel[] = [];

  allCollideTimeOther: CollisionModel[] = [];

  startTimeOtherCollided: any;
  endTimeOtherCollided: any;


  startArrayStatus = false;
  endArrayStatus = false;

  dayValue;
  subjectValue;
  typeValue;
  locationValue;
  startTimeValue;
  endTimeValue;
  userUid: any;
  userEmail: any;

  comment = 'No Info';
  docIdSub: string;
  docIdAdmin: string;
  adminType: any;
  course: any;
  university: any;

  constructor(
    private afAuth: AngularFireAuth,
    private statuService: StatusServeService,
    private router: Router,
    private notification: NzNotificationService,
    private firebaseService: FirebaseAllService
  ) {}



  ngOnInit(): void {
    this.afAuth.user.subscribe(userData => {
      if (userData !== null){
        this.userUid = userData.uid;
        this.userEmail = userData.email;
        this.loadCourses();
      }else{
        this.router.navigate(['/']);
      }
    });

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
        this.firebaseService.checkAdminType(this.userEmail).subscribe(adminTypeDdata => {
          if (adminTypeDdata !== null){
            adminTypeDdata.forEach(typeResults => {
              this.docIdSub = typeResults.payload.doc.id;
              this.docIdAdmin = typeResults.payload.doc.id;
              // tslint:disable-next-line: no-string-literal
              this.adminType = typeResults.payload.doc.data()['type'];
              // tslint:disable-next-line: no-string-literal
              this.statuService.courseNameService = typeResults.payload.doc.data()['course'];
              // tslint:disable-next-line: no-string-literal
              this.statuService.universityNameService = typeResults.payload.doc.data()['university'];

              if (this.adminType !== 'collaborate'){
                this.firebaseService.getUniversityCourse(this.userUid).subscribe(ogUserData => {
                  if (ogUserData.length !== 0){
                    ogUserData.forEach(ogTypeEachData => {
                      // tslint:disable-next-line: no-string-literal
                      this.course = ogTypeEachData.payload.doc.data()['course'];
                      // tslint:disable-next-line: no-string-literal
                      this.university = ogTypeEachData.payload.doc.data()['university'];
                    });
                  }else{
                    //No data
                  }
                });
              }
            });
          }
        });

      } else {
        // No COURSES
      }
    });
  }


  setDayValue() {

    this.statuService.progressBarStatus = true;

    if (this.startArrayOther.length !== 0){
      this.startArrayOther = [];
      this.startArray = [];
      this.endArray = [];

    }
    this.firebaseService
      .getTimeCollision(
        this.adminType === 'collaborate' ? this.statuService.universityNameService : this.university,
        this.selectedCourse,
        this.dayValue)
      .subscribe((datas) => {
        if (datas.length !== 0) {

          this.statuService.progressBarStatus = false;

          datas.forEach((results) => {

            if (
              !this.startArrayOther.includes(
                {
                  documentId: results.payload.doc.id,
                  subjName: results.payload.doc.data().subject,
                  type: results.payload.doc.data().type,
                  location: results.payload.doc.data().location,
                  start: results.payload.doc.data().start,
                  end: results.payload.doc.data().end
                }
              )
            ) {
              this.startArrayOther.push(
                {
                  documentId: results.payload.doc.id,
                  subjName: results.payload.doc.data().subject,
                  type: results.payload.doc.data().type,
                  location: results.payload.doc.data().location,
                  start: results.payload.doc.data().start,
                  end: results.payload.doc.data().end
                }
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
    this.afAuth.authState.subscribe((userData) => {
      if (userData !== null) {
        this.showPleaseSelect = true;

        if (this.selectedCourse === this.statuService.courseNameService){
          this.notification.create(
            'warning',
            'What! 😳',
            'You Can\'t Check Collision Of Your Own Course!',
            {
              nzDuration: 2000,
              nzPlacement: 'bottomLeft'
            }
          );
        }else{
          this.firebaseService
          .getTimeCollision(
            this.adminType === 'collaborate' ? this.statuService.universityNameService : this.university,
            this.adminType === 'collaborate' ? this.statuService.courseNameService : this.course,
            this.dayValue
          )
          .subscribe((timeCollisionReults) => {
            if (timeCollisionReults.length !== 0) {
              this.noData = false;
              timeCollisionReults.forEach((meResults) => {
                if (
                  !this.startArray.includes(
                    {
                      documentId: meResults.payload.doc.id,
                      subjName: meResults.payload.doc.data().subject,
                      type: meResults.payload.doc.data().type,
                      location: meResults.payload.doc.data().location,
                      start: meResults.payload.doc.data().start,
                      end: meResults.payload.doc.data().end
                    }
                  )
                ) {
                  this.startArray.push({
                    documentId: meResults.payload.doc.id,
                    subjName: meResults.payload.doc.data().subject,
                    type: meResults.payload.doc.data().type,
                    location: meResults.payload.doc.data().location,
                    start: meResults.payload.doc.data().start,
                    end: meResults.payload.doc.data().end
                  });
                }

                if (
                  !this.endArray.includes(
                    {
                      documentId: meResults.payload.doc.id,
                      subjName: meResults.payload.doc.data().subject,
                      type: meResults.payload.doc.data().type,
                      location: meResults.payload.doc.data().location,
                      start: meResults.payload.doc.data().start,
                      end: meResults.payload.doc.data().end
                    }
                  )
                ) {
                  this.endArray.push({
                    documentId: meResults.payload.doc.id,
                    subjName: meResults.payload.doc.data().subject,
                    type: meResults.payload.doc.data().type,
                    location: meResults.payload.doc.data().location,
                    start: meResults.payload.doc.data().start,
                    end: meResults.payload.doc.data().end
                  });
                }

              });


              for (let otherStartIndex = 0; otherStartIndex < this.startArrayOther.length; otherStartIndex++){
                for (let meStartIndex = 0; meStartIndex < this.startArray.length; meStartIndex++){
                  if (

                    (
                    parseInt(this.startArray[meStartIndex].start.replace(':', '')) >= parseInt(this.startArrayOther[otherStartIndex].start.replace(':', ''))
                    &&
                    parseInt(this.startArray[meStartIndex].start.replace(':', '')) <= parseInt(this.startArrayOther[otherStartIndex].end.replace(':', ''))
                    )

                    ||

                    (
                      parseInt(this.startArray[meStartIndex].end.replace(':', '')) >= parseInt(this.startArrayOther[otherStartIndex].end.replace(':', ''))
                      &&
                      parseInt(this.startArray[meStartIndex].end.replace(':', '')) <= parseInt(this.startArrayOther[otherStartIndex].end.replace(':', ''))
                    )

                  ) {

                    this.statuService.progressBarStatus = false;
                    this.startArrayStatus = false;
                    this.startTimeOtherCollided = this.startArrayOther[otherStartIndex];

                    if (!this.allCollideTimeOther.includes(
                      this.startArrayOther[otherStartIndex]
                    )){
                      this.allCollideTimeOther.push(this.startArrayOther[otherStartIndex]);
                    }

                    this.notification.create(
                      'warning',
                      'Collsion! 😬',
                      'Detected!',
                      {
                        nzDuration: 1000,
                        nzPlacement: 'bottomLeft'
                      }
                    );

                  } else {
                    this.statuService.progressBarStatus = false;
                    this.startArrayStatus = true;

                  }
                }
              }

              // for (let otherEndIndex = 0; otherEndIndex < this.endArrayOther.length; otherEndIndex++){
              //   for (let meEndIndex = 0; meEndIndex < this.endArray.length; meEndIndex++){
              //     if (
              //       parseInt(this.endArray[meEndIndex].end.replace(':', '')) >= parseInt(this.startArrayOther[otherEndIndex].start.replace(':', '')) &&
              //       parseInt(this.endArray[meEndIndex].end.replace(':', '')) <= parseInt(this.endArrayOther[otherEndIndex].end.replace(':', ''))
              //     ) {
              //       this.statuService.progressBarStatus = false;

              //       this.notification.create(
              //         'warning',
              //         'Collsion! 😬',
              //         'End Time Has Collided!',
              //         {
              //           nzDuration: 2000,
              //           nzPlacement: 'bottomLeft'
              //         }
              //       );
              //       this.endArrayStatus = false;
              //       this.collisionResultsFromFirebase = this.endArray[meEndIndex];
              //       this.endTimeOtherCollided = this.endArrayOther[otherEndIndex];
              //       if (!this.allCollideTimeOther.includes(
              //         this.endArrayOther[otherEndIndex]
              //       )){
              //         this.allCollideTimeOther.push(this.endArrayOther[otherEndIndex]);
              //       }

              //     } else {
              //       this.statuService.progressBarStatus = false;
              //       this.endArrayStatus = true;
              //       // No end Collision

              //     }
              //   }
              // }


            }else{
              this.showSelectSubject = true;
              this.noData =  true;
            }
          });
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
