import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAllService } from 'src/app/AllServices/firebase-all.service';
import { StatusServeService } from 'src/app/AllServices/status-serve.service';

@Component({
  selector: 'app-monday',
  templateUrl: './monday.component.html',
  styleUrls: ['./monday.component.css']
})
export class MondayComponent implements OnInit {

  isVisibleMiddle = false;
  timeMondayObjectFromFirebase: any;
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
    this.statuService.checkOnlineStatus$().subscribe((isOnline) => {
      this.onlineStatus = isOnline;
    });
  }

  deleteData(docId: any, university: any, course: any) {
    this.loadDatabase();
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

  loadDatabase() {
    this.afAuth.authState.subscribe((userData) => {
      if (userData !== null) {
        this.firebaseService
          .getUniversityCourse(userData.uid)
          .subscribe((data) => {
            if (data.length != 0) {
              data.forEach((results) => {
                this.course = results.payload.doc.data()['course'];
                this.university = results.payload.doc.data()['university'];

                this.firebaseService
                  .getTimetable(this.university, this.course, 'Monday')
                  .subscribe((monday) => {
                    if (monday.length != 0) {
                      this.noData = false;
                      this.timeMondayObjectFromFirebase = monday;
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
