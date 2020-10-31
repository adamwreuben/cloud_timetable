import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';

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
  userName:any;


  constructor(
    public statuService: StatusServeService,
    private afAuth: AngularFireAuth,
    private routers: Router,
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
        } else {
          if (this.statuService.courseName === null) {
            this.routers.navigate(['/']);
          }
          this.hideButton = false;
        }
      });
    });
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
      if (datas.length != 0) {
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
}
