import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';
import { StorageService } from '../AllServices/storage/storage.service';
import { DocumentUploadInterface } from '../AllServices/storage/storage.model';
import * as moment from 'moment';



@Component({
  selector: 'app-class-file',
  templateUrl: './class-file.component.html',
  styleUrls: ['./class-file.component.css']
})
export class ClassFileComponent implements OnInit {
  course: any;
  university: any;
  showTable: boolean = false;

  listOfData: DocumentUploadInterface[] = [];

  subjectSelected: any = undefined;

  allSubjectFromFirebase: any = undefined;

  noData: any;
  noDataCourses: any;
  selectNow = false;
  onlineStatus: any;

  constructor(
    private afAuth: AngularFireAuth,
    private statuService: StatusServeService,
    private router: Router,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private storageServ: StorageService,
    private firebaseService: FirebaseAllService,
  ) { }

  ngOnInit(): void {
    this.loadCourses();
    this.statuService.checkOnlineStatus$().subscribe((isOnline) => {
      this.onlineStatus = isOnline;
    });
  }



  subjectChange(){
    this.selectNow = true;
    this.loadDocuments();
  }

  loadDocuments() {
    if(this.listOfData.length !== 0){
      this.listOfData = [];
      this.noData = false;
    }
    this.afAuth.user.subscribe((data) => {
      if (data !== null) {
        this.storageServ
          .getDocuments(
            this.university,
            this.course,
            this.subjectSelected,
            data.uid
          )
          .subscribe((documentResults) => {
            if(documentResults !== null){
              this.noData = false;
              documentResults.forEach(documentSingleData => {
                this.listOfData.push({
                  documentFileId: documentSingleData.payload.doc.id,
                  documentName: documentSingleData.payload.doc.data()['documentName'],
                  dateUploaded: moment(documentSingleData.payload.doc.data()['dateUploaded'].seconds * 1000).format('llll'),
                  documentSize: documentSingleData.payload.doc.data()['documentSize'],
                  documentDownloadUrl: documentSingleData.payload.doc.data()['documentDownloadUrl']
                });

              });

            }else{
              //No Documents
              this.noData = true;
            }

          });
      }
    });
  }

  deleteFile(docFilePath: any, docId: any){
    this.statuService.progressBarStatus = true;
    this.storage.storage.refFromURL(docFilePath)
    .delete().then(() => {
      this.db.collection('Class Files').doc(this.university).collection(this.course).doc(this.subjectSelected)
      .collection('All', ref => ref.where('documentDownloadUrl', '==', docFilePath))
      .doc(docId).delete().then(() => {
        this.statuService.progressBarStatus = false;
        this.loadDocuments();
        //this.snackBar.open('File Deleted!', '', this.noMatchConfig);
      });

    });
  }

  loadCourses() {
    this.statuService.progressBarStatus = true;
    this.afAuth.authState.subscribe((userData) => {
      if (userData !== null) {
        this.firebaseService
          .getUniversityCourse(userData.uid)
          .subscribe((data) => {
            if (data.length != 0) {
              this.statuService.progressBarStatus = false;
              data.forEach((results) => {
                this.university = results.payload.doc.data()['university'];
                this.course = results.payload.doc.data()['course'];
                this.firebaseService
                  .getCourseLongAndShort(this.university, this.course)
                  .subscribe((subjectResults) => {
                    if (subjectResults !== null) {
                      this.noDataCourses = false;
                      this.allSubjectFromFirebase = subjectResults;
                      this.statuService.progressBarStatus = false;
                    } else {
                      //NO subject
                      this.noDataCourses = true;
                      this.statuService.progressBarStatus = false;
                    }
                  });
              });
            } else {
              //No data
              this.statuService.progressBarStatus = false;

              // this.snack.open('Set Your University and Your Course Class', '', {
              //   duration: 2000,
              // });
            }
          });
      } else {
        this.router.navigate(['/']);
      }
    });
  }

}
