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

  dayValue;
  subjectValue;
  locationValue;
  startTimeValue;
  endTimeValue;
  comment;

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
    this.statuService.checkOnlineStatus$().subscribe((isOnline) => {
      this.onlineStatus = isOnline;
    });
  }

  ngDoCheck(){
    if(this.statuService.weekSelected !== this.currentWeek){
      this.loadDatabase();
      this.currentWeek = this.statuService.weekSelected;
    }
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


  loadDatabase(){
    this.afAuth.authState.subscribe(userData=>{
      this.firebaseService.getUniversityCourse(userData.uid).subscribe(data=>{
        if(data.length != 0){
          this.statuService.progressBarStatus = false;

          data.forEach(results=>{
            this.course = results.payload.doc.data()['course'];
            this.university = results.payload.doc.data()['university'];

            this.firebaseService.getTimetableUe(this.university,this.course, this.statuService.weekSelected, 'Friday').subscribe(friday=>{

              if(friday.length != 0){
                this.noData = false;
                this.timeFridayObjectFromFirebase = friday;
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
    });
  }

}
