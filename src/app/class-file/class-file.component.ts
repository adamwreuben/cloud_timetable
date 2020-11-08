import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
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
  styleUrls: ['./class-file.component.css'],
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
  docIdSub: string;
  docIdAdmin: string;
  adminType: any;

  constructor(
    private afAuth: AngularFireAuth,
    private statuService: StatusServeService,
    private router: Router,
    private notification: NzNotificationService,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private message: NzMessageService,
    private storageServ: StorageService,
    private firebaseService: FirebaseAllService
  ) {}

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
    const id = this.message.loading('Uploading Please Wait...', {
      nzDuration: 0,
    }).messageId;

    const storageRef = firebase.storage().ref();

    const docRef = storageRef.child(
      `${this.adminType === 'collaborate' ? this.statuService.universityNameService : this.universityName}/${this.adminType === 'collaborate' ? this.statuService.courseNameService : this.courseName}/${this.subjectSelected}/${new Date().getTime()}_${this.makeid(6)}_${this.fileName}`
    );

    docRef.put(this.docFileUrl).then(() => {
      docRef.getDownloadURL().then((url) => {
        this.docFileDownloadedUrl = url;

        this.storageServ
          .uploadDocuments(
            this.adminType === 'collaborate'
              ? this.statuService.universityNameService
              : this.universityName,
            this.adminType === 'collaborate'
              ? this.statuService.courseNameService
              : this.courseName,
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
            this.message.create('success', 'Successfully Uploaded', {
              nzDuration: 1000,
            });
            this.notification.create(
              'success',
              'Uploaded! 😁',
              'Successfully',
              {
                nzDuration: 2000,
                nzPlacement: 'bottomLeft',
              }
            );
            this.loadDocumentsAfterUpload(this.subjectSelected);
          });
      });
    });
  }
  cancel() {}

  subjectChange() {
    this.selectNow = true;
    this.loadDocuments();
  }

  loadDocuments() {
    if (this.listOfData.length !== 0) {
      this.listOfData = [];
      this.noData = false;
    }
    this.afAuth.user.subscribe((data) => {
      if (data !== null) {
        this.storageServ
          .getDocuments(
            this.adminType === 'collaborate'
              ? this.statuService.universityNameService
              : this.universityName,
            this.adminType === 'collaborate'
              ? this.statuService.courseNameService
              : this.courseName,
            this.subjectSelected
          )
          .subscribe((documentResults) => {
            if (documentResults !== null) {
              this.noData = false;
              documentResults.forEach((documentSingleData) => {
                this.listOfData.push({
                  documentFileId: documentSingleData.payload.doc.id,
                  // tslint:disable-next-line: no-string-literal
                  documentName: documentSingleData.payload.doc.data()['documentName'],
                  // tslint:disable-next-line: no-string-literal
                  dateUploaded: moment(documentSingleData.payload.doc.data()['dateUploaded'].seconds * 1000).format('llll'),
                  // tslint:disable-next-line: no-string-literal
                  documentSize: documentSingleData.payload.doc.data()['documentSize'],
                  // tslint:disable-next-line: no-string-literal
                  documentDownloadUrl: documentSingleData.payload.doc.data()['documentDownloadUrl']
                });
              });
            } else {
              // No Documents
              this.noData = true;
            }
          });
      }
    });
  }

  loadDocumentsAfterUpload(subjectNameAfter: any) {
    if (this.listOfData.length !== 0) {
      this.listOfData = [];
      this.noData = false;
    }
    this.afAuth.user.subscribe((data) => {
      if (data !== null) {
        this.storageServ
          .getDocuments(
            this.adminType === 'collaborate'
              ? this.statuService.universityNameService
              : this.universityName,
            this.adminType === 'collaborate'
              ? this.statuService.courseNameService
              : this.courseName,
            subjectNameAfter
          )
          .subscribe((documentResults) => {
            if (documentResults !== null) {
              this.noData = false;
              documentResults.forEach((documentSingleData) => {
                this.listOfData.push({
                  documentFileId: documentSingleData.payload.doc.id,
                  documentName: documentSingleData.payload.doc.data()
                    .documentName,
                  dateUploaded: moment(
                    documentSingleData.payload.doc.data().dateUploaded.seconds *
                      1000
                  ).format('llll'),
                  documentSize: documentSingleData.payload.doc.data()
                    .documentSize,
                  documentDownloadUrl: documentSingleData.payload.doc.data()
                    .documentDownloadUrl,
                });
              });
            } else {
              // No Documents
              this.noData = true;
            }
          });
      }
    });
  }

  deleteFile(docFilePath: any, docId: any) {
    this.statuService.progressBarStatus = true;
    this.storage.storage
      .refFromURL(docFilePath)
      .delete()
      .then(() => {
        this.db
          .collection('Class Files')
          .doc(
            this.adminType === 'collaborate'
              ? this.statuService.universityNameService
              : this.universityName
          )
          .collection(
            this.adminType === 'collaborate'
              ? this.statuService.courseNameService
              : this.courseName
          )
          .doc(this.subjectSelected)
          .collection('All', (ref) =>
            ref.where('documentDownloadUrl', '==', docFilePath)
          )
          .doc(docId)
          .delete()
          .then(() => {
            this.statuService.progressBarStatus = false;
            this.loadDocuments();
            this.notification.create('success', 'Deleted! 😔', 'Successfully', {
              nzDuration: 2000,
              nzPlacement: 'bottomLeft',
            });
          });
      });
  }

  loadCourses() {
    this.statuService.progressBarStatus = true;
    this.afAuth.authState.subscribe((userData) => {
      if (userData !== null) {
        this.firebaseService
          .checkAdminType(userData.email)
          .subscribe((data) => {
            if (data !== null) {
              this.statuService.progressBarStatus = false;
              this.noData = false;
              data.forEach((results) => {
                this.docIdSub = results.payload.doc.id;
                this.docIdAdmin = results.payload.doc.id;
                // tslint:disable-next-line: no-string-literal
                this.adminType = results.payload.doc.data()['type'];
                // tslint:disable-next-line: no-string-literal
                this.statuService.courseNameService = results.payload.doc.data()['course'];
                // tslint:disable-next-line: no-string-literal
                this.statuService.universityNameService = results.payload.doc.data()['university'];

                if (this.adminType === 'collaborate') {
                  this.loadSubject();
                } else {
                  this.firebaseService
                    .getUniversityCourse(userData.uid)
                    .subscribe((ogUserResults) => {
                      if (ogUserResults !== null) {
                        ogUserResults.forEach((ogResults) => {
                          this.docIdSub = ogResults.payload.doc.id;
                          // tslint:disable-next-line: no-string-literal
                          this.courseName = ogResults.payload.doc.data()[
                            'course'
                          ];
                          // tslint:disable-next-line: no-string-literal
                          this.universityName = ogResults.payload.doc.data()[
                            'university'
                          ];
                        });
                        this.loadSubject();
                      } else {
                        // No data
                      }
                    });
                }
              });
            } else {
              // No data
              this.noData = true;
            }
          });
      }
    });
  }

  loadSubject() {
    this.firebaseService
      .getCourseLongAndShort(
        this.adminType === 'collaborate'
          ? this.statuService.universityNameService
          : this.universityName,
        this.adminType === 'collaborate'
          ? this.statuService.courseNameService
          : this.courseName
      )
      .subscribe((datas) => {
        if (datas.length !== 0) {
          this.noData = false;
          this.allSubjectFromFirebase = datas;
        } else {
          this.noData = true;
        }
      });
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }

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
