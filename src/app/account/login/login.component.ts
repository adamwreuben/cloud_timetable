import { Route } from '@angular/compiler/src/core';
import { Component, OnInit, DoCheck } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FirebaseAllService } from 'src/app/AllServices/firebase-all.service';
import { StatusServeService } from 'src/app/AllServices/status-serve.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, DoCheck {
  allCourseFromFirebase: any;
  constructor(
    public afAuths: AngularFireAuth,
    public statusServ: StatusServeService,
    private fireService: FirebaseAllService,
    private router: Router,
    private message: NzMessageService
  ) {}

  selectedCourse;
  chooseUniversity;
  chooseCourse;
  startYear;
  endYear;

  changeImageVerifiation = false;
  needsVerification = false;
  statusVerification;

  isVisibleMiddle = false;
  isVisibleMiddleVerification = false;
  isVisibleMiddleCreate = false;

  ngOnInit(): void {
    this.statusServ.checkOnlineStatus$().subscribe((isOnline) => {
      if (isOnline === true) {
        this.statusServ.progressBarStatus = true;
        this.afAuths.authState.subscribe((data) => {
          if (data !== null) {
            // this.snack.open('Please Wait...', '', { duration: 2000 });
            if (data.email === 'adamreuben66@gmail.com') {
              this.statusServ.progressBarStatus = false;
              this.router.navigate(['/']);
              //this.router.navigate(['/me']);
            } else {
              this.statusServ.progressBarStatus = false;
              this.loadVerification(data.uid, data.email);
            }
          } else {
            this.message.create('warning', 'Please Sign In!', {
              nzDuration: 2000,
            });
            this.statusServ.progressBarStatus = false;
            this.router.navigate(['/']);
          }
        });
      } else {
        this.message.create('error', 'Check Your Internet Connection!', {
          nzDuration: 4000,
        });
      }
    });
  }

  ngDoCheck() {
    if (this.needsVerification === true) {
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

  onSubmitRequest() {}
  onSubmitSet() {
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
        this.message.create('success', 'Successful Added!', {
          nzDuration: 2000,
        });
      });
  }

  loadVerification(uid: any, email: any) {
    const id = this.message.loading('Checking User...', { nzDuration: 0 })
      .messageId;
    this.fireService.getUserVerification(uid).subscribe((datas) => {
      if (datas.length !== 0) {
        this.changeImageVerifiation = true;
        this.statusServ.progressBarStatus = false;
        datas.forEach((results) => {
          // tslint:disable-next-line: no-string-literal
          this.statusVerification = results.payload.doc.data()['status'];
          if (this.statusVerification === 'verified') {
            this.fireService.getUniversityCourse(uid).subscribe((universityData) => {
              if (universityData.length !== 0) {
                this.message.remove(id);
                this.message.success('Welcom Back!', { nzDuration: 2000 });
                this.statusServ.progressBarStatus = false;
                this.router.navigate(['/home']);
              } else {
                this.message.remove(id);
                this.showModalMiddleCreate();
              }
            });
          } else {
            this.message.remove(id);
            this.needsVerification = true;
            this.showModalMiddle();
          }
        });
      } else {
        this.fireService
          .checkAdminPresent(email)
          .subscribe((adminPresentsData) => {
            if (adminPresentsData.length !== 0) {
              adminPresentsData.forEach((forResults) => {
                // tslint:disable-next-line: no-string-literal
                this.statusVerification = forResults.payload.doc.data()[
                  'status'
                ];
                // tslint:disable-next-line: no-string-literal
                this.statusServ.universityNameService = forResults.payload.doc.data()[
                  'university'
                ];
                // tslint:disable-next-line: no-string-literal
                this.statusServ.courseNameService = forResults.payload.doc.data()[
                  'course'
                ];
              });

              if (this.statusVerification === 'verified') {
                this.message.remove(id);
                this.message.success('Welcom!', {
                  nzDuration: 2000,
                });
                this.statusServ.progressBarStatus = false;
                this.router.navigate(['/home']);
              } else {
                this.message.remove(id);
                this.needsVerification = true;
                this.showModalMiddle();
              }

            } else {
              this.message.remove(id);
              this.changeImageVerifiation = false;
              this.statusServ.progressBarStatus = false;
              this.needsVerification = true;
              this.showModalMiddle();
            }
          });
      }
    });
  }

  requestVerifiation() {
    this.statusServ.progressBarStatus = true;
    this.afAuths.authState.subscribe((userData) => {
      this.fireService
        .getUserVerification(userData.uid)
        .subscribe((userVerificationData) => {
          if (userVerificationData.length !== 0) {
            userVerificationData.forEach((results) => {
              // tslint:disable-next-line: no-string-literal
              this.statusVerification = results.payload.doc.data()['status'];
              if (this.statusVerification === 'verified') {
                this.fireService
                  .getUniversityCourse(userData.uid)
                  .subscribe((data) => {
                    if (data !== null) {
                      this.router.navigate(['/home']);
                    } else {
                      this.showModalMiddleCreate();
                    }
                  });
              } else {
                this.message.create('error', 'Not Verified!', {
                  nzDuration: 2000,
                });
                this.needsVerification = true;
                this.showModalMiddle();
              }
            });
          } else {
            this.fireService
              .verifyAdmins(userData.displayName, userData.email, userData.uid)
              .then(() => {
                this.statusServ.progressBarStatus = false;
                this.message.create('success', 'Requested!', {
                  nzDuration: 2000,
                });
              });
          }
        });
    });
  }
}
