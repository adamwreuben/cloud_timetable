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
import * as firebase from 'firebase';
import { NzMessageService } from 'ng-zorro-antd/message';
import { concatMap } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';



@Component({
  selector: 'app-class-file',
  templateUrl: './class-file.component.html',
  styleUrls: ['./class-file.component.css']
})
export class ClassFileComponent implements OnInit {

  universityName: any;
  courseName: any;


  fileName: any = undefined;
  docFileUrl: File = null;
  docName: any;
  docSize: any;
  docFileDownloadedUrl: any;

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
    private notification: NzNotificationService,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private message: NzMessageService,
    private storageServ: StorageService,
    private firebaseService: FirebaseAllService,
  ) { }

  ngOnInit(): void {
    this.loadCourses();
    this.statuService.checkOnlineStatus$().subscribe((isOnline) => {
      this.onlineStatus = isOnline;
    });
  }

  uploadDoc(event) {
    this.docFileUrl = event.target.files[0];
    this.docSize = this.formatBytes(event.target.files[0].size, 2);
    this.fileName = this.docFileUrl.name;

    this.onSubmit();
  }

  onSubmit() {
    this.statuService.progressBarStatus = true;
    const id = this.message.loading('Uploading Please Wait...', { nzDuration: 0 }).messageId;

    const storageRef = firebase.storage().ref();

    const docRef = storageRef.child(
      `${this.universityName}/${this.courseName}/${
        this.subjectSelected
      }/${new Date().getTime()}_${this.makeid(6)}_${this.fileName}`
    );

    docRef.put(this.docFileUrl).then(() => {
      docRef.getDownloadURL().then((url) => {
        this.docFileDownloadedUrl = url;

        this.storageServ
          .uploadDocuments(
            this.universityName,
            this.courseName,
            {
              documentName: this.fileName,
              dateUploaded: firebase.firestore.FieldValue.serverTimestamp(),
              documentSize: this.docSize,
              documentDownloadUrl: this.docFileDownloadedUrl,
            },
            this.subjectSelected
          )
          .then(() => {
            this.statuService.progressBarStatus = false;
            this.message.remove(id);
            this.docFileUrl = null;
            this.message.create('success', 'Successfully Uploaded', {nzDuration: 1000});
            this.loadDocumentsAfterUpload(this.subjectSelected);
          });
      });
    });
  }


  subjectChange(){
    this.selectNow = true;
    this.loadDocuments();
  }

  loadDocuments() {
    if (this.listOfData.length !== 0){
      this.listOfData = [];
      this.noData = false;
    }
    this.afAuth.user.subscribe((data) => {
      if (data !== null) {
        this.storageServ
          .getDocuments(
            this.universityName,
            this.courseName,
            this.subjectSelected,
            data.uid
          )
          .subscribe((documentResults) => {
            if (documentResults !== null){
              this.noData = false;
              documentResults.forEach(documentSingleData => {
                this.listOfData.push({
                  documentFileId: documentSingleData.payload.doc.id,
                  documentName: documentSingleData.payload.doc.data().documentName,
                  dateUploaded: moment(documentSingleData.payload.doc.data().dateUploaded.seconds * 1000).format('llll'),
                  documentSize: documentSingleData.payload.doc.data().documentSize,
                  documentDownloadUrl: documentSingleData.payload.doc.data().documentDownloadUrl
                });

              });

            }else{
              // No Documents
              this.noData = true;
            }

          });
      }
    });
  }

  loadDocumentsAfterUpload(subjectNameAfter: any) {
    if (this.listOfData.length !== 0){
      this.listOfData = [];
      this.noData = false;
    }
    this.afAuth.user.subscribe((data) => {
      if (data !== null) {
        this.storageServ
          .getDocuments(
            this.universityName,
            this.courseName,
            subjectNameAfter,
            data.uid
          )
          .subscribe((documentResults) => {
            if (documentResults !== null){
              this.noData = false;
              documentResults.forEach(documentSingleData => {
                this.listOfData.push({
                  documentFileId: documentSingleData.payload.doc.id,
                  documentName: documentSingleData.payload.doc.data().documentName,
                  dateUploaded: moment(documentSingleData.payload.doc.data().dateUploaded.seconds * 1000).format('llll'),
                  documentSize: documentSingleData.payload.doc.data().documentSize,
                  documentDownloadUrl: documentSingleData.payload.doc.data().documentDownloadUrl
                });

              });

            }else{
              // No Documents
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
      this.db.collection('Class Files')
      .doc(this.universityName)
      .collection(this.courseName)
      .doc(this.subjectSelected)
      .collection('All', ref => ref.where('documentDownloadUrl', '==', docFilePath))
      .doc(docId).delete().then(() => {
        this.statuService.progressBarStatus = false;
        this.loadDocuments();
        this.notification.create(
          'success',
          'Deleted! 😔',
          'Successfully',
          {
            nzDuration: 2000,
            nzPlacement: 'bottomLeft'
          }
        );
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
            if (data.length !== 0) {
              this.statuService.progressBarStatus = false;
              data.forEach((results) => {
                // tslint:disable-next-line: no-string-literal
                this.universityName = results.payload.doc.data()['university'];
                // tslint:disable-next-line: no-string-literal
                this.courseName = results.payload.doc.data()['course'];
                this.firebaseService
                  .getCourseLongAndShort(this.universityName, this.courseName)
                  .subscribe((subjectResults) => {
                    if (subjectResults !== null) {
                      this.noDataCourses = false;
                      this.allSubjectFromFirebase = subjectResults;
                      this.statuService.progressBarStatus = false;
                    } else {
                      // NO subject
                      this.noDataCourses = true;
                      this.statuService.progressBarStatus = false;
                    }
                  });
              });
            } else {
              // No data
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

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) { return '0 Bytes'; }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  makeid(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
