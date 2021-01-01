import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
})
export class VerifyComponent implements OnInit {
  data: any[] = [];
  courseName: any;
  noData: boolean;
  noDataVerified: boolean;
  showSkeleton: boolean;
  showSkeletonVerified: boolean;
  allVerifiedPost: any;
  allUnverifiedPost: any;
  adminType: any;
  courseSub: any;
  universitySub: any;

  constructor(
    public firebaseService: FirebaseAllService,
    public statuService: StatusServeService,
    private auth: AngularFireAuth,
    private routers: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.auth.authState.subscribe((data) => {
      if (data !== null) {
        this.statuService.progressBarStatus = false;
        this.firebaseService
          .checkAdminType(data.email)
          .subscribe((userVerificationType) => {
            if (userVerificationType.length !== 0) {
              userVerificationType.forEach((resultsTypes) => {
                // tslint:disable-next-line: no-string-literal
                this.adminType = resultsTypes.payload.doc.data()['type'];
                // tslint:disable-next-line: no-string-literal
                this.statuService.courseNameService = resultsTypes.payload.doc.data()[
                  'course'
                ];
                // tslint:disable-next-line: no-string-literal
                this.statuService.universityNameService = resultsTypes.payload.doc.data()[
                  'university'
                ];

                if (this.adminType === 'collaborate') {
                  this.loadUnVerified();
                } else {
                  this.firebaseService
                    .getUniversityCourse(data.uid)
                    .subscribe((ogUserResults) => {
                      if (ogUserResults !== null) {
                        ogUserResults.forEach((ogResults) => {
                          // tslint:disable-next-line: no-string-literal
                          this.courseSub = ogResults.payload.doc.data()[
                            'course'
                          ];
                          // tslint:disable-next-line: no-string-literal
                          this.universitySub = ogResults.payload.doc.data()[
                            'university'
                          ];
                          // tslint:disable-next-line: no-string-literal
                          this.statuService.courseNameService = ogResults.payload.doc.data()[
                            'course'
                          ];
                          // tslint:disable-next-line: no-string-literal
                          this.statuService.universityNameService = resultsTypes.payload.doc.data()[
                            'university'
                          ];
                        });
                        this.loadUnVerified();
                      } else {
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
      }
    });
  }

  verify(docId: any) {
    //this.adminType === 'collaborate' ? this.statusServ.courseNameService : this.course,
    this.firebaseService.updatePostVerification(
      docId,
      this.adminType === 'collaborate'
        ? this.statuService.courseNameService
        : this.courseSub
    );
    this.loadUnVerified();
  }
  cancel() {}

  deletePost() {}

  changeTabs(tabIndex: any) {
    switch (tabIndex) {
      case 0:
        this.loadUnVerified();
        break;
      case 1:
        this.loadVerified();
        break;
      default:
        return null;
    }
  }

  viewPostUrl(url){
    window.open(url,'_blank');
  }

  loadUnVerified() {
    this.showSkeleton = true;
    this.firebaseService
      .getUnVerifiedPost(
        this.adminType === 'collaborate'
          ? this.statuService.courseNameService
          : this.courseSub
      )
      .subscribe((datas) => {
        if (datas.length !== 0) {
          this.noData = false;
          this.showSkeleton = false;
          this.allUnverifiedPost = datas;
        } else {
          this.noData = true;
        }
      });
  }

  loadVerified() {
    this.showSkeletonVerified = true;
    this.firebaseService
      .getVerifiedPost(
        this.adminType === 'collaborate'
          ? this.statuService.courseNameService
          : this.courseSub
      )
      .subscribe((datasVerified) => {
        if (datasVerified.length !== 0) {
          this.noDataVerified = false;
          this.showSkeletonVerified = false;
          this.allVerifiedPost = datasVerified;
        } else {
          this.noDataVerified = true;
        }
      });
  }
}
