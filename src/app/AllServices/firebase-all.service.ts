import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { TimeTableForAti } from '../review/time.model';
import { UniversityCourse } from '../account/login/unicourse.model';
import { SubjectShortLongForm } from '../home/add.course.model';
import { CollisionModel } from '../collision/collision.model';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAllService {
  inviteDocId: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private notification: NzNotificationService,

  ) {}

  // Add invite code..
  async setInviteCode(uid: any, invitationCode: any, course, university: any) {
    const user = await this.afAuth.currentUser;
    if (user !== null) {
      this.db
        .collection('InvitationCodes')
        .add({
          userUid: uid,
          code: invitationCode,
          course,
          university,
        })
        .then(() => {
          // this.matSnack.open('Successfully added!', '', { duration: 2000 });
        });
    }
  }

  // Set Timetable
  async uploadTimetable(data: TimeTableForAti, university: any, course: any) {
    this.afAuth.user.subscribe((user) => {
      if (user !== null) {
        this.db
          .collection('TimeTable')
          .doc(university)
          .collection('All')
          .doc(course)
          .collection(data.dayName)
          .add({
            day: data.dayName,
            subject: data.subjName,
            type: data.type,
            location: data.location,
            start: data.start,
            end: data.end,
            comment: data.comment,
            university,
            course,
            adminName: user.displayName,
            adminPhoto: user.photoURL,
            email: user.email
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.db
          .collection('TimeTable')
          .doc(university)
          .collection('All')
          .doc(course)
          .collection(data.dayName)
          .add({
            day: data.dayName,
            subject: data.subjName,
            type: data.type,
            location: data.location,
            start: data.start,
            end: data.end,
            comment: data.comment,
            university,
            course,
            adminName: 'Guest',
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  // Set UE Timetable
  async uploadUeTimetable(
    data: TimeTableForAti,
    university: any,
    course: any,
    week
  ) {
    const user = await this.afAuth.currentUser;
    if (user !== null) {
      this.db
        .collection('UE')
        .doc(university)
        .collection('All')
        .doc(course)
        .collection('All')
        .doc(week)
        .collection(data.dayName)
        .add({
          day: data.dayName,
          subject: data.subjName,
          location: data.location,
          start: data.start,
          end: data.end,
          university,
          course,
          adminName: user.displayName,
          adminPhoto: user.photoURL,
          email: user.email,
          week,
          date: data.dateUe,
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.db
        .collection('UE')
        .doc(university)
        .collection('All')
        .doc(course)
        .collection('All')
        .doc(week)
        .collection(data.dayName)
        .add({
          day: data.dayName,
          subject: data.subjName,
          location: data.location,
          start: data.start,
          end: data.end,
          university,
          course,
          adminName: 'Guest',
          week,
          date: data.dateUe,
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  // Upload University And Course Data
  async uploadUniversityCourse(data: UniversityCourse) {
    const user = await this.afAuth.currentUser;
    if (user !== null) {
      this.db
        .collection('University')
        .add({
          university: data.university,
          course: data.course + ' From ' + data.start + ' To ' + data.end,
          start: data.start,
          end: data.end,
          userUid: user.uid,
          adminName: user.displayName,
          adminPhoto: user.photoURL,
          email: user.email
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.db
        .collection('University')
        .add({
          university: data.university,
          course: data.course + ' From ' + data.start + ' To ' + data.end,
          start: data.start,
          end: data.end,
          adminName: 'Guest',
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  // Upload Course short and long form
  async uploadShortAndLongForm(
    university: any,
    course: any,
    data: SubjectShortLongForm
  ) {
    const user = await this.afAuth.currentUser;
    if (user !== null) {
      this.db
        .collection('Course')
        .doc(university)
        .collection('All')
        .doc(course)
        .collection('My Course')
        .add({
          subjectLong: data.subjectLong,
          subjectShort: data.subjectShort,
          university,
          course,
          teacherName:
            data.teacherName == null ? 'Please Add' : data.teacherName,
          teacherEmail:
            data.teacherEmail == null ? 'Please Add' : data.teacherEmail,
          teacherPhoneNo:
            data.teacherPhone == null ? 'Please Add' : data.teacherPhone,
          teacherRoom:
            data.teacherRoom == null ? 'Please Add' : data.teacherRoom,
          adminName: user.displayName,
          adminPhoto: user.photoURL,
          adminEmail: user.email
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.db
        .collection('Course')
        .doc(university)
        .collection('All')
        .doc(course)
        .collection('My Course')
        .add({
          subjectLong: data.subjectLong,
          subjectShort: data.subjectShort,
          university,
          course,
          teacherName:
            data.teacherName == null ? 'Please Add' : data.teacherName,
          teacherEmail:
            data.teacherEmail == null ? 'Please Add' : data.teacherEmail,
          teacherPhoneNo:
            data.teacherPhone == null ? 'Please Add' : data.teacherPhone,
          teacherRoom:
            data.teacherRoom == null ? 'Please Add' : data.teacherRoom,
          adminName: 'Guest',
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }




  // Get University And Course
  getUniversityCourse(userUid: any) {
    return this.db
      .collection('University', (ref) => ref.where('userUid', '==', userUid))
      .snapshotChanges();
  }

  getUniversityCourseOnly() {
    return this.db.collection('University')
    .snapshotChanges();
  }
  // ******* END OF GET ALL TIMETABLE ********

  // GET COURSE INITIAL AND LONG FORM
  getCourseLongAndShort(university: any, course: any) {
    return this.db
      .collection('Course')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('My Course')
      .snapshotChanges();
  }

  // GET COLLISIONS

  // ---NORMAL TIMETABLE
  getTimeCollision(universityName: any, course: any, day: any) {
    return this.db
      .collection('TimeTable')
      .doc(universityName)
      .collection('All')
      .doc(course)
      .collection(day)
      .snapshotChanges();
  }

  getTimeCollisionSubject(universityName: any, course: any, day: any, subject: any) {
    return this.db
      .collection('TimeTable')
      .doc(universityName)
      .collection('All')
      .doc(course)
      .collection(day, ref => ref.where('subject', '==', subject))
      .snapshotChanges();
  }

  // ----UE

  getTimeCollisionUE(university: any, course: any, day: any, week: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc(week)
      .collection(day)
      .snapshotChanges();
  }

  // END OF COLLISIONS

  // Get All TimeTable
  getTimetable(university: any, course: any, day: any) {
    return this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection(day, (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }


  // ******END OF GET TIMETABLE FOR EACH DAY */

  // ***TIMETABLE FOR UE WEEK 1*/
  getTimetableUe(university: any, course: any, week: any, day: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc(week)
      .collection(day, (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  // ***END OF UE TIMETABLE WEEK 3*/

  // DELETE TIMETABLES
  deleteTimetableForDay(docId: any, university: any, course: any, day: any) {
    this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection(day)
      .doc(docId)
      .delete()
      .then(() => {
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
  }



  // ********** END OF DELETE **********

  // DELETE UE TIMETABLE WEEK 1****
  deleteTimetableUe(docId: any, university: any, course: any, week: any, day: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc(week)
      .collection(day)
      .doc(docId)
      .delete()
      .then(() => {
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
  }

  // END OF DELETE UE TIMETABLE WEEK 3****

  // UPDATE TIMETABLE
  updateTimeTable(
    docId: any,
    university: any,
    course: any,
    day: any,
    subject: any,
    type: any,
    location: any,
    start: any,
    end: any,
    comment: any
  ) {
    this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection(day)
      .doc(docId)
      .update({
        subject,
        type,
        location,
        start,
        end,
        comment,
      })
      .then(() => {
        this.notification.create(
          'success',
          'Updated! 😁',
          'Successfully',
          {
            nzDuration: 2000,
            nzPlacement: 'bottomLeft'
          }
        );
      });
  }


  updateCollisionValue(docId: any, university: any, course: any, day: any, collisionCourse: CollisionModel[]){
    this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection(day)
      .doc(docId)
      .update({
        collision: 'yes',
        collidedCourse: collisionCourse
      })
      .then(() => {
        // this.matSnack.open('Collision Detected is Added !', '', { duration: 2000 });
      });
  }

  // *****END OF UPDATE */

  // **UPDATE UE TIMETABLE */
  updateUeTimeTable(
    docId: any,
    university: any,
    course: any,
    day: any,
    subject: any,
    location: any,
    start: any,
    end: any,
    week: any,
    date: any
  ) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc(week)
      .collection(day)
      .doc(docId)
      .update({
        subject,
        location,
        start,
        end,
        date,
      })
      .then(() => {
        this.notification.create(
          'success',
          'Updated! 😁',
          'Successfully',
          {
            nzDuration: 2000,
            nzPlacement: 'bottomLeft'
          }
        );
      });
  }
  // **END UE UPDATE TIMETABLE */

  updateCourseInitial(
    docId: any,
    university: any,
    course: any,
    subjectShort: any,
    subjectLong: any,
    teacherName: any,
    teacherEmail: any,
    teacherPhone: any,
    teacherRoom: any
  ) {
    this.db
      .collection('Course')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('My Course')
      .doc(docId)
      .update({
        subjectShort,
        subjectLong,
        teacherName,
        teacherEmail,
        teacherPhoneNo: teacherPhone,
        teacherRoom,
      })
      .then(() => {
        this.notification.create(
          'success',
          'Updated! 😁',
          'Successfully',
          {
            nzDuration: 2000,
            nzPlacement: 'bottomLeft'
          }
        );
      });
  }

  deleteCourseInitial(docId: any, university: any, course: any) {
    this.db
      .collection('Course')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('My Course')
      .doc(docId)
      .delete()
      .then(() => {
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
  }

  // *****END About updating course short and Long form */

  updateUniversityDetail(docId: any, universityData: any, courseData: any) {
    this.db
      .collection('University')
      .doc(docId)
      .update({
        university: universityData,
        course: courseData,
      })
      .then(() => {
        this.notification.create(
          'success',
          'Updated! 😁',
          'Successfully',
          {
            nzDuration: 2000,
            nzPlacement: 'bottomLeft'
          }
        );
      });
  }

  deleteUniversityDetail(docId: any) {
    this.db
      .collection('University')
      .doc(docId)
      .delete()
      .then(() => {
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
  }

  // ALL ABOUT ADMINS HERE
  // Set Timetable
  async verifyAdmins(adminName: string, adminEmail: string, adminUid: any) {
    this.db
      .collection('All_Admins')
      .add({
        name: adminName,
        email: adminEmail,
        uid: adminUid,
        status: 'not',
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getAllAdmins() {
    return this.db
      .collection('All_Admins', (ref) => ref.where('status', '==', 'verified'))
      .snapshotChanges();
  }

  getUserVerification(userUid: any) {
    return this.db
      .collection('All_Admins', (ref) => ref.where('uid', '==', userUid))
      .snapshotChanges();
  }

  getUserVerifiedCrOnly() {
    return this.db
      .collection('All_Admins', (ref) => ref.where('status', '==', 'verified'))
      .snapshotChanges();
  }

  getUserVerifiedCrOnlySpecificCourse(course: any) {
    return this.db
      .collection('All_Admins', (ref) => ref.where('status', '==', 'verified').where('course', '==', course))
      .snapshotChanges();
  }

  getAllAdminsRequest() {
    return this.db
      .collection('All_Admins', (ref) => ref.where('status', '==', 'not'))
      .snapshotChanges();
  }

  updateUserVerification(docId: any) {
    this.db
      .collection('All_Admins')
      .doc(docId)
      .update({
        status: 'verified',
      })
      .then(() => {
        this.notification.create(
          'success',
          'Updated! 😁',
          'Successfully',
          {
            nzDuration: 2000,
            nzPlacement: 'bottomLeft'
          }
        );
      });
  }
}
