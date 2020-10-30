import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { TimeTableForAti } from '../review/time.model';
import { UniversityCourse } from '../account/login/unicourse.model';
import { SubjectShortLongForm } from '../home/add.course.model';
import { CollisionModel } from '../collision/collision.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAllService {
  inviteDocId: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
  ) {}

  //Add invite code..
  async setInviteCode(uid: any, invitationCode: any, course, university: any) {
    const user = await this.afAuth.currentUser;
    if (user !== null) {
      this.db
        .collection('InvitationCodes')
        .add({
          userUid: uid,
          code: invitationCode,
          course: course,
          university: university,
        })
        .then(() => {
          //this.matSnack.open('Successfully added!', '', { duration: 2000 });
        });
    }
  }

  //Set Timetable
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
            university: university,
            course: course,
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
            university: university,
            course: course,
            adminName: 'Guest',
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  //Set UE Timetable
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
          university: university,
          course: course,
          adminName: user.displayName,
          adminPhoto: user.photoURL,
          email: user.email,
          week: week,
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
          university: university,
          course: course,
          adminName: 'Guest',
          week: week,
          date: data.dateUe,
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  //Upload University And Course Data
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

  //Upload Course short and long form
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
          university: university,
          course: course,
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
          university: university,
          course: course,
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

  //Get code
  getCheckInviteCode(userUid) {
    return this.db
      .collection('InvitationCodes', (ref) =>
        ref.where('userUid', '==', userUid)
      )
      .snapshotChanges();
  }

  getInviteCode(inviteCode: any) {
    return this.db
      .collection('InvitationCodes', (ref) =>
        ref.where('code', '==', inviteCode)
      )
      .snapshotChanges();
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

  getTimeCollisionSubject(universityName: any, course: any, day: any,subject:any) {
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
  getTimetableMonday(university: any, course: any) {
    return this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('Monday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableTuesday(university: any, course: any) {
    return this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('Tuesday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableWednesday(university: any, course: any) {
    return this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('Wednesday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableThursday(university: any, course: any) {
    return this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('Thursday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableFriday(university: any, course: any) {
    return this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('Friday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  //******END OF GET TIMETABLE FOR EACH DAY */

  //***TIMETABLE FOR UE WEEK 1*/
  getTimetableUeMonday(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 1')
      .collection('Monday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableUeTuesday(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 1')
      .collection('Tuesday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableUeWednesday(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 1')
      .collection('Wednesday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableUeThursday(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 1')
      .collection('Thursday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableUeFriday(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 1')
      .collection('Friday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  //***END OF UE TIMETABLE WEEK 1*/

  //***TIMETABLE FOR UE WEEK 2*/
  getTimetableUeMondayWeek2(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 2')
      .collection('Monday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableUeTuesdayWeek2(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 2')
      .collection('Tuesday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableUeWednesdayWeek2(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 2')
      .collection('Wednesday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableUeThursdayWeek2(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 2')
      .collection('Thursday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableUeFridayWeek2(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 2')
      .collection('Friday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  //***END OF UE TIMETABLE WEEK 2*/

  //***TIMETABLE FOR UE WEEK 2*/
  getTimetableUeMondayWeek3(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 3')
      .collection('Monday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableUeTuesdayWeek3(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 3')
      .collection('Tuesday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableUeWednesdayWeek3(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 3')
      .collection('Wednesday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableUeThursdayWeek3(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 3')
      .collection('Thursday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  getTimetableUeFridayWeek3(university: any, course: any) {
    return this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 3')
      .collection('Friday', (ref) => ref.orderBy('start'))
      .snapshotChanges();
  }

  //***END OF UE TIMETABLE WEEK 3*/

  //DELETE TIMETABLES
  deleteTimetableMonday(docId: any, university: any, course: any) {
    this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('Monday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableTuesday(docId: any, university: any, course: any) {
    this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('Tuesday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableWednesday(docId: any, university: any, course: any) {
    this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('Wednesday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableThursday(docId: any, university: any, course: any) {
    this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('Thursday')
      .doc(docId)
      .delete()
      .then(() => {
       // this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableFriday(docId: any, university: any, course: any) {
    this.db
      .collection('TimeTable')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('Friday')
      .doc(docId)
      .delete()
      .then(() => {
       // this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  // ********** END OF DELETE **********

  //DELETE UE TIMETABLE WEEK 1****
  deleteTimetableUeMonday(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 1')
      .collection('Monday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableUeTuesday(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 1')
      .collection('Tuesday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableUeWednesday(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 1')
      .collection('Wednesday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableUeThursday(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 1')
      .collection('Thursday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableUeFriday(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 1')
      .collection('Friday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }
  //END OF DELETE UE TIMETABLE WEEK 1****

  //DELETE UE TIMETABLE WEEK 2****
  deleteTimetableUeMondayWeek2(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 2')
      .collection('Monday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableUeTuesdayWeek2(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 2')
      .collection('Tuesday')
      .doc(docId)
      .delete()
      .then(() => {
       // this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableUeWednesdayWeek2(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 2')
      .collection('Wednesday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableUeThursdayWeek2(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 2')
      .collection('Thursday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableUeFridayWeek2(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 2')
      .collection('Friday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }
  //END OF DELETE UE TIMETABLE WEEK 2****

  //DELETE UE TIMETABLE WEEK 3****
  deleteTimetableUeMondayWeek3(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 3')
      .collection('Monday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableUeTuesdayWeek3(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 3')
      .collection('Tuesday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableUeWednesdayWeek3(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 3')
      .collection('Wednesday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableUeThursdayWeek3(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 3')
      .collection('Thursday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  deleteTimetableUeFridayWeek3(docId: any, university: any, course: any) {
    this.db
      .collection('UE')
      .doc(university)
      .collection('All')
      .doc(course)
      .collection('All')
      .doc('Week 3')
      .collection('Friday')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }
  //END OF DELETE UE TIMETABLE WEEK 3****

  //UPDATE TIMETABLE
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
        subject: subject,
        type: type,
        location: location,
        start: start,
        end: end,
        comment: comment,
      })
      .then(() => {
        //this.matSnack.open('Updated', '', { duration: 2000 });
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
        //this.matSnack.open('Collision Detected is Added !', '', { duration: 2000 });
      });
  }

  //*****END OF UPDATE */

  //**UPDATE UE TIMETABLE */
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
        subject: subject,
        location: location,
        start: start,
        end: end,
        date: date,
      })
      .then(() => {
        //this.matSnack.open('Updated', '', { duration: 2000 });
      });
  }
  //**END UE UPDATE TIMETABLE */

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
        subjectShort: subjectShort,
        subjectLong: subjectLong,
        teacherName: teacherName,
        teacherEmail: teacherEmail,
        teacherPhoneNo: teacherPhone,
        teacherRoom: teacherRoom,
      })
      .then(() => {
        //this.matSnack.open('Updated', '', { duration: 2000 });
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
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  //*****END About updating course short and Long form */

  updateUniversityDetail(docId: any, universityData: any, courseData: any) {
    this.db
      .collection('University')
      .doc(docId)
      .update({
        university: universityData,
        course: courseData,
      })
      .then(() => {
        //this.matSnack.open('Updated', '', { duration: 2000 });
      });
  }

  deleteUniversityDetail(docId: any) {
    this.db
      .collection('University')
      .doc(docId)
      .delete()
      .then(() => {
        //this.matSnack.open('Deleted', '', { duration: 2000 });
      });
  }

  //ALL ABOUT ADMINS HERE
  //Set Timetable
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
        //this.matSnack.open('Verified', '', { duration: 2000 });
      });
  }
}
