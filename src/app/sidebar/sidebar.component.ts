import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  switchLayoutType:
    | 'home'
    | 'review'
    | 'ue'
    | 'collision'
    | 'files'
    | 'overview'
    | 'stuff' = 'review';
  onlineStatus: any;
  status;

  hideButton;
  userProfileImg: any;
  showInvite = true;
  userName: any;
  noData;

  docIdSub: any;
  courseSub: any;
  universitySub: any;
  allCourseInitials: any;
  docIdAdmin: any;

  adminType: any;

  constructor(
    public statuService: StatusServeService,
    private afAuth: AngularFireAuth,
    private routers: Router,
    private notification: NzNotificationService,
    private fireService: FirebaseAllService
  ) {}

  ngOnInit(): void {
    this.statuService.checkOnlineStatus$().subscribe((isOnline) => {
      this.onlineStatus = isOnline;
      this.statuService.progressBarStatus = true;
      this.afAuth.authState.subscribe((data) => {
        if (data !== null) {
          this.statuService.progressBarStatus = false;
          this.loadVerification(data.uid);
          this.hideButton = true;
          this.userProfileImg = data.photoURL;
          this.userName = data.displayName;
          this.fireService
            .checkAdminType(data.email)
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
                    this.fireService.updateAdminAdded(
                      this.docIdAdmin,
                      data.displayName,
                      data.uid
                    );
                    this.loadSubjects();
                  } else {
                    this.fireService.getUniversityCourse(data.uid).subscribe(ogUserResults => {
                      if (ogUserResults !== null){
                        ogUserResults.forEach(ogResults => {
                          this.docIdSub = ogResults.payload.doc.id;
                          // tslint:disable-next-line: no-string-literal
                          this.courseSub = ogResults.payload.doc.data()['course'];
                          // tslint:disable-next-line: no-string-literal
                          this.universitySub = ogResults.payload.doc.data()['university'];
                          // tslint:disable-next-line: no-string-literal
                          this.statuService.courseNameService = ogResults.payload.doc.data()['course'];
                          // tslint:disable-next-line: no-string-literal
                          this.statuService.universityNameService = resultsTypes.payload.doc.data()['university'];

                        });
                        this.loadSubjects();
                      }else{
                        // No data
                      }
                    });
                  }
                });
              } else {
                this.routers.navigate(['/']);
              }
            });
        } else {
          this.routers.navigate(['/']);
          this.hideButton = false;
        }
      });
    });
  }

  createNotification() {
    this.notification.create(
      'info',
      'Add Your Subjects First ( GO TO REVIEW SUBJECTS TAB )! 🤓',
      'You Have To Add All Subjects For Your Course Before Doing Anything!😊.',
      {
        nzDuration: 0,
        nzStyle: {
          width: '600px',
          marginLeft: '-265px',
        },
      }
    );
  }

  logOut() {
    this.afAuth.signOut().then(() => {
      this.routers.navigate(['/']);
    });
  }

  changeLayoutDesign(status) {
    this.switchLayoutType = status;
  }

  loadVerification(uid: any) {
    this.fireService.getUserVerification(uid).subscribe((datas) => {
      if (datas.length !== 0) {
        datas.forEach((results) => {
          // tslint:disable-next-line: no-string-literal
          this.status = results.payload.doc.data()['status'];
          if (this.status === 'verified') {
            this.routers.navigate(['/home']);
          } else {
            this.routers.navigate(['/verify']);
          }
        });
      } else {
      }
    });
  }

  loadSubjects() {
    this.fireService.getCourseLongAndShort(
      this.adminType === 'collaborate' ? this.statuService.universityNameService : this.universitySub,
      this.adminType === 'collaborate' ? this.statuService.courseNameService : this.courseSub)
    .subscribe((datas) => {
      if (datas.length !== 0) {
        this.noData = false;
      } else {
        this.noData = true;
        this.createNotification();
      }
    });
  }
}
