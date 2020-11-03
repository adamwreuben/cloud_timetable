import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  switchLayoutType: 'home' | 'review' | 'ue' | 'collision'|'files'|'overview'|'stuff' = 'review';
  onlineStatus: any;
  status;

  hideButton;
  userProfileImg: any;
  showInvite: boolean = true;
  userName: any;
  noData;

  docIdSub: any;
  courseSub: any;
  universitySub: any;
  allCourseInitials: any;

  constructor(
    public statuService: StatusServeService,
    private afAuth: AngularFireAuth,
    private routers: Router,
    private notification: NzNotificationService,
    private fireService: FirebaseAllService,
  ) { }

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
          this.loadSubjects();
        } else {
          if (this.statuService.courseName === null) {
            this.routers.navigate(['/']);
          }
          this.hideButton = false;
        }
      });
    });
  }

  createNotification(){
    this.notification.create(
      'info',
      'Add Your Subjects First ( GO TO REVIEW SUBJECTS TAB )! 🤓',
      'You Have To Add All Subjects For Your Course Before Doing Anything!😊.',
      {
        nzDuration: 0,
        nzStyle: {
          width: '600px',
          marginLeft: '-265px'
        }
      }
    );
  }

  logOut(){
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
    this.statuService.progressBarStatus = true;
    this.afAuth.authState.subscribe((userData) => {
      if (userData !== null) {
        this.fireService
          .getUniversityCourse(userData.uid)
          .subscribe((data) => {
            if (data !== null) {
              this.statuService.progressBarStatus = false;
              this.noData = false;
              data.forEach((results) => {
                this.docIdSub = results.payload.doc.id;
                this.courseSub = results.payload.doc.data()['course'];
                this.universitySub = results.payload.doc.data()['university'];
                this.fireService
                  .getCourseLongAndShort(this.universitySub, this.courseSub)
                  .subscribe((datas) => {
                    if (datas.length !== 0){
                      this.noData = false;
                    }else{
                      this.noData = true;
                      this.createNotification();
                    }
                  });
              });
            } else {
              //No data
              this.noData = true;
            }
          });
      }
    });
  }
}
