import { Route } from '@angular/compiler/src/core';
import { Component, OnInit, DoCheck } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAllService } from 'src/app/AllServices/firebase-all.service';
import { StatusServeService } from 'src/app/AllServices/status-serve.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, DoCheck {



  constructor(
    public afAuths: AngularFireAuth,
    public statusServ: StatusServeService,
    private fireService: FirebaseAllService,
    private router: Router,
  ) { }

  selectedCourse;
  chooseUniversity;
  chooseCourse;
  startYear;
  endYear;


  changeImageVerifiation: boolean = false;
  needsVerification = false;
  statusVerification;

  isVisibleMiddle = false;
  isVisibleMiddleVerification = false;
  isVisibleMiddleCreate = false;

  // setAccountFormGroup = new FormGroup({
  //   universityChooseFormControl: new FormControl('', [Validators.required]),
  //   courseNameFormControl: new FormControl('', [Validators.required]),
  //   startYearFormControl: new FormControl('', [Validators.required]),
  //   endYearFormControl: new FormControl('', [Validators.required])
  // });



  ngOnInit(): void {
    this.statusServ.progressBarStatus = true;
    this.afAuths.authState.subscribe((data) => {
      if (data !== null) {
        //this.snack.open('Please Wait...', '', { duration: 2000 });
        if (data.email === 'adamreuben66@gmail.com') {
          this.statusServ.progressBarStatus = false;
          this.router.navigate(['/me']);
        } else {
          this.statusServ.progressBarStatus = false;
          this.loadVerification(data.uid);
        }
      } else {
        this.statusServ.progressBarStatus = false;
        this.router.navigate(['/']);
      }
    });

  }

  ngDoCheck(){
    if (this.needsVerification === true){
      this.showModalMiddle();
    }
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

  handleOkMiddleCreate(): void {
    this.isVisibleMiddleCreate = false;
  }

  handleCancelMiddleCreate(): void {
    this.isVisibleMiddleCreate = false;
  }

  showModalMiddleCreate(): void {
    this.isVisibleMiddleCreate = true;
  }

  handleOkMiddleVerification(): void {
    this.isVisibleMiddleVerification = false;
  }

  handleCancelMiddleVerification(): void {
    this.isVisibleMiddleVerification = false;
  }

  showModalMiddleVerification(): void {
    this.isVisibleMiddleVerification = true;
  }

  onSubmitRequest(){

  }
  onSubmitSet(){
    this.statusServ.progressBarStatus = true;
    this.fireService
      .uploadUniversityCourse({
        university: this.chooseUniversity,
        course: this.chooseCourse,
        start: this.startYear,
        end: this.endYear,
      })
      .then(() => {
        this.statusServ.progressBarStatus = false;
        this.chooseUniversity = '';
        this.chooseCourse = '';
        this.startYear = '';
        this.endYear = '';
        this.router.navigate(['/home']);
        //this.snack.open('Successful Added', '', { duration: 2000 });
      });
  }

  loadVerification(uid: any) {
    this.statusServ.progressBarStatus = true;
    this.fireService.getUserVerification(uid).subscribe((datas) => {
      if (datas.length !== 0) {
        this.changeImageVerifiation = true;
        this.statusServ.progressBarStatus = false;
        //this.snack.open('Wait For Verification!', '', { duration: 2000 });
        datas.forEach((results) => {
          this.statusVerification = results.payload.doc.data()['status'];
          if (this.statusVerification === 'verified') {
            console.log('Verified!');
            this.showModalMiddleCreate();
            //this.router.navigate(['/home']);
          } else {
            console.log('no verified!');
            this.needsVerification = true;
            this.showModalMiddle();
          }
        });
      } else {
        this.changeImageVerifiation = false;
        this.statusServ.progressBarStatus = false;
        this.needsVerification = true;
        this.showModalMiddle();
      }
    });
  }

  requestVerifiation() {
    this.statusServ.progressBarStatus = true;
    this.afAuths.authState.subscribe((userData) => {
      this.fireService
        .verifyAdmins(userData.displayName, userData.email, userData.uid)
        .then(() => {
          this.statusServ.progressBarStatus = false;
          //this.snack.open('Requested', '', { duration: 2000 });
        });
    });
  }


}
