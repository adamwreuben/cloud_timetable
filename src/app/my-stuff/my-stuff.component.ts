import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';

@Component({
  selector: 'app-my-stuff',
  templateUrl: './my-stuff.component.html',
  styleUrls: ['./my-stuff.component.css'],
})
export class MyStuffComponent implements OnInit {
  adminEmail = undefined;
  isVisibleMiddle: boolean;
  allAdminRequests: any;
  noData: any;
  showSkeleton: boolean;
  docIdSub: string;
  docIdAdmin: string;
  adminType: any;
  course: any;
  university: any;

  constructor(
    public statusServ: StatusServeService,
    public servFirebase: FirebaseAllService,
    private notification: NzNotificationService,
    private auth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.auth.user.subscribe(userData => {
      if (userData !== null){
        this.servFirebase.checkAdminType(userData.email).subscribe(adminTypeDdata => {
          if (adminTypeDdata !== null){
            adminTypeDdata.forEach(typeResults => {
              this.docIdSub = typeResults.payload.doc.id;
              this.docIdAdmin = typeResults.payload.doc.id;
              // tslint:disable-next-line: no-string-literal
              this.adminType = typeResults.payload.doc.data()['type'];
              // tslint:disable-next-line: no-string-literal
              this.statusServ.courseNameService = typeResults.payload.doc.data()['course'];
              // tslint:disable-next-line: no-string-literal
              this.statusServ.universityNameService = typeResults.payload.doc.data()['university'];

              if (this.adminType === 'collaborate'){
                this.loadAllAdmin();
              }else{
                this.servFirebase.getUniversityCourse(userData.uid).subscribe(ogUserData => {
                  if (ogUserData.length !== 0){
                    ogUserData.forEach(ogTypeEachData => {
                      // tslint:disable-next-line: no-string-literal
                      this.course = ogTypeEachData.payload.doc.data()['course'];
                      // tslint:disable-next-line: no-string-literal
                      this.university = ogTypeEachData.payload.doc.data()['university'];
                    });
                    this.loadAllAdmin();
                  }else{
                    //No data
                  }
                });
              }


            });
          }
        });
      }
    });
  }

  loadAllAdmin() {
    this.showSkeleton = true;
    this.servFirebase
      .getUserVerifiedCrOnlySpecificCourse(this.adminType === 'collaborate' ? this.statusServ.courseNameService : this.course)
      .subscribe((requestsData) => {
        if (requestsData.length !== 0) {
          this.noData = false;
          this.showSkeleton = false;
          this.allAdminRequests = requestsData;
        } else {
          this.noData = true;
        }
      });
  }

  onSubmitAdminRequest() {
    if (this.adminEmail !== undefined) {
      this.servFirebase
        .checkAdminPresent(this.adminEmail)
        .subscribe((adminRequestData) => {
          if (adminRequestData.length !== 0) {
            this.notification.create(
              'warning',
              'Already In Used!',
              'This Email is already Used',
              {
                nzDuration: 2000,
                nzPlacement: 'bottomLeft',
              }
            );
          } else {
            this.servFirebase
              .verifyAdminsForSpecificCourse(
                this.adminEmail,
                this.statusServ.universityNameService,
                this.statusServ.courseNameService
              )
              .then(() => {
                this.notification.create(
                  'success',
                  'Requested! 😁',
                  'Successfully',
                  {
                    nzDuration: 2000,
                    nzPlacement: 'bottomLeft',
                  }
                );
              });
          }
        });
    } else {
      this.notification.create(
        'warning',
        'Email cant be empty!',
        'Enter Email!',
        {
          nzDuration: 2000,
          nzPlacement: 'bottomLeft',
        }
      );
    }
  }

  removeAdmin(docId: any) {
    this.servFirebase.deleteAdminOnCourse(docId);
    this.loadAllAdmin();
  }

  handleOkMiddle(): void {
    this.isVisibleMiddle = false;
    this.onSubmitAdminRequest();
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }
}
