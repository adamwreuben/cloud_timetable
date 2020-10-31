import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAllService } from 'src/app/AllServices/firebase-all.service';
import { StatusServeService } from 'src/app/AllServices/status-serve.service';

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
    this.afAuth.authState.subscribe(userData=>{
      if(userData !== null){
        this.firebaseService.getUniversityCourse(userData.uid).subscribe(data=>{
          if(data.length != 0){
            this.statuService.progressBarStatus = false;
            data.forEach(results=>{
              this.course = results.payload.doc.data()['course'];
              this.university = results.payload.doc.data()['university'];

              this.firebaseService.getTimetable(this.university, this.course, 'Wednesday').subscribe(wednesday=>{

                if(wednesday.length != 0){
                  this.noData = false;

                  this.timeWednesdayObjectFromFirebase = wednesday;
                  this.statuService.progressBarStatus = false;
                }else{
                  //No data
                  this.noData = true;
                  this.statuService.progressBarStatus = false;

                }

              });
            })
          }else{
            //No data
            //this.snack.open("Set Your University and Your Course Class","",{duration:2000})

          }

        });
      }else{
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
