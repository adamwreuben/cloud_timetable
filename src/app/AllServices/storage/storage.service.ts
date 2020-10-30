import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { DocumentUploadInterface } from './storage.model';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { StatusServeService } from '../status-serve.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private statusServ: StatusServeService,
    ) { }



  async uploadDocuments(university: any, courseName: any, data: DocumentUploadInterface, subjectName: any) {
    const user = await this.afAuth.currentUser;
    return this.db.collection('Class Files').doc(university).collection(courseName).doc(subjectName).collection('All').add({
      ...data,
      subject: subjectName,
      adminPhoto: user.photoURL,
      adminEmail: user.email,
      adminUid: user.uid
    }).catch((error) => {
      console.log(error);
    });
  }

  // deleteFile(university: any, courseName: any, subjectName: any, filePath: any, docId: any){
  //   this.statusServ.progressBarStatus = true;
  //   this.storage.storage.refFromURL(filePath)
  //   .delete().then(() => {
  //     this.db.collection('Class Files').doc(university).collection(courseName).doc(subjectName)
  //     .collection('All', ref => ref.where('documentDownloadUrl', '==', filePath))
  //     .doc(docId).delete().then(() => {
  //       this.statusServ.progressBarStatus = false;
  //       this.snackBar.open('File Deleted!', '', this.noMatchConfig);
  //     });

  //   });
  // }

  getDocuments(university: any, courseName: any, subjectName: any, userUid: any){
    return this.db.collection('Class Files').doc(university).collection(courseName).doc(subjectName)
    .collection('All', ref => ref.where('adminUid', '==', userUid).orderBy('dateUploaded', 'asc'))
    .snapshotChanges();
  }


}
