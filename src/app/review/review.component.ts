import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FirebaseAllService } from '../AllServices/firebase-all.service';
import { StatusServeService } from '../AllServices/status-serve.service';
import { AutogenerateService } from '../AllServices/autogenerate.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  // GENERATE PARAMETER
  ncodes = new FormControl('');
  showButton: any;
  showRows = false;
  showPopup = true;
  error!: any;
  errors: any[] = [];
  errPopup = false;
  codes!: any[];
  isShown = false;
  rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  days!: any[];
  loading: any;
  // END GENERATE PARAMETER


  isOkLoading = false;
  isVisibleMiddle = false;

  university: any;
  course: any;

  dayValue;
  subjectValue;
  typeValue;
  locationValue;
  startTimeValue;
  endTimeValue;

  allCourseInitials: any;

  showSpinner = false;
  comment = 'No Info';

  // Arrays--->
  startArray = [];
  endArray = [];

  startArrayStatus = false;
  endArrayStatus = false;
  docIdSub: string;
  docIdAdmin: string;
  adminType: any;


  constructor(
    public statusServ: StatusServeService,
    public servFirebase: FirebaseAllService,
    private notification: NzNotificationService,
    private auth: AngularFireAuth,
    private timetableGeneratorService: AutogenerateService,
    private fb: FormBuilder
  ) { }

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
                this.loadSubjects();
              }else{
                this.servFirebase.getUniversityCourse(userData.uid).subscribe(ogUserData => {
                  if (ogUserData.length !== 0){
                    ogUserData.forEach(ogTypeEachData => {
                      // tslint:disable-next-line: no-string-literal
                      this.course = ogTypeEachData.payload.doc.data()['course'];
                      // tslint:disable-next-line: no-string-literal
                      this.university = ogTypeEachData.payload.doc.data()['university'];
                    });
                    this.loadSubjects();
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

  // **** GENEREATE CODES FROM CELCAT ********

  get formrows() {
    return this.codesForm.get('formrows') as FormArray;
  }

  codesForm = this.fb.group({
    formrows: this.fb.array([
      this.fb.control('')
    ])
  });

  addRow() {
    this.formrows.push(this.fb.control(''));
  }

  delete(index: any){
    this.formrows.removeAt(Number(index));
  }

  updateForm(code: any) {
    this.showButton = this.formrows.valid;
    //console.log(code);
    this.check(code);
  }

  nCodes(n: any) {
    this.formrows.clear();
    if (n !== ''){
      this.showRows = true;
      const x = Number(n);
      for (let i = 1; i <= x; i++) {
        this.addRow();
      }
    }

    if (n === '') {
      this.formrows.clear();
      this.showRows = false;
    }
  }

  gotCodes() {
    this.showPopup = false;
    //console.log(this.codesForm.value);
  }

  create() {
    this.showPopup = true;
  }

  close() {
    this.showPopup = false;
  }

  re_enter() {
    this.errPopup = false;
    this.showPopup = true;
  }

  makeT(){
    this.showPopup = false;

    let dt: any;
    const _this = this;
    this.loading = true;

    var ss: any[] = [];

    for (var i = 0; i < this.codesForm.value['formrows'].length; i++) {
      let code = this.codesForm.value['formrows'][i];
      this.timetableGeneratorService.checkCode(code).subscribe(data => {
        let msg = data.message;
        if (msg !== 'exists') {
          ss.push(msg);
          this.errPopup = true;
        }
      });
    }

    this.errors = ss;

    this.timetableGeneratorService.getData(this.codesForm.value).subscribe(data => {
      this.loading = false;
      if (data) {
         console.log('all Data');
         console.log(data.data);
         data.data.array.forEach(elementResults => {
          
         });
      }
    });
  }

  check(code: any) {
    let msg = '';
    if (code) {
      this.timetableGeneratorService.checkCode(code).subscribe(data => {
        let ms = data.message;
        if ( ms === 'exists') {
          this.error = '';
        }
        if (ms !== 'exists') {
          this.error = ms;
          //this.showButton = false;
          msg = ms;
        }
      });
    }
  }

  // **** END OF GENERATE *********


  handleOkMiddle(): void {
    this.isVisibleMiddle = false;
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;

  }

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }





  onSubmitAdd(){

    if (this.startTimeValue >= this.endTimeValue) {

      this.notification.create(
        'warning',
        'Something is Wrong😡',
        'Start Time can\'t Exceed End Time! Or Be Equal',
        {
          nzDuration: 2000,
          nzPlacement: 'bottomLeft'
        }
      );
    } else {
      if (this.endTimeValue <= this.startTimeValue) {

        this.notification.create(
          'warning',
          'Something is Wrong😡',
          'End Time can\'t be Less than Start Time Or Be Equal!',
          {
            nzDuration: 2000,
            nzPlacement: 'bottomLeft'
          }
        );
      } else {
        this.servFirebase
          .getTimeCollision(
            this.adminType === 'collaborate' ? this.statusServ.universityNameService : this.university,
            this.adminType === 'collaborate' ? this.statusServ.courseNameService : this.course,
             this.dayValue)
          .subscribe((datas) => {
            if (datas.length !== 0) {
              datas.forEach((results) => {
                if (
                  !this.startArray.includes(results.payload.doc.data().start)
                ) {
                  this.startArray.push(
                    parseInt(
                      results.payload.doc.data().start.replace(':', '')
                    )
                  );
                }

                if (
                  !this.endArray.includes(results.payload.doc.data().end)
                ) {
                  this.endArray.push(
                    parseInt(results.payload.doc.data().end.replace(':', ''))
                  );
                }
              });

              for (let i = 0; i < this.startArray.length; i++) {
                if (
                  parseInt(this.startTimeValue.replace(':', '')) >=
                    this.startArray[i] &&
                  parseInt(this.startTimeValue.replace(':', '')) <=
                    this.endArray[i]
                ) {
                  this.notification.create(
                    'warning',
                    'Something is Wrong😡',
                    'Start time already exist!',
                    {
                      nzDuration: 2000,
                      nzPlacement: 'bottomLeft'
                    }
                  );
                  this.startArrayStatus = false;
                } else {
                  this.startArrayStatus = true;
                }
              }

              for (let i = 0; i < this.endArray.length; i++) {
                if (
                  parseInt(this.endTimeValue.replace(':', '')) >=
                    this.startArray[i] &&
                  parseInt(this.endTimeValue.replace(':', '')) <=
                    this.endArray[i]
                ) {
                  this.notification.create(
                    'warning',
                    'Something is Wrong😡',
                    'End time already exist!',
                    {
                      nzDuration: 2000,
                      nzPlacement: 'bottomLeft'
                    }
                  );
                  this.endArrayStatus = false;
                } else {
                  this.endArrayStatus = true;
                }
              }

              if (
                this.startArrayStatus === true &&
                this.endArrayStatus === true
              ) {
                this.servFirebase
                  .uploadTimetable(
                    {
                      dayName: this.dayValue,
                      subjName: this.subjectValue,
                      type: this.typeValue,
                      location: this.locationValue,
                      start: this.startTimeValue,
                      end: this.endTimeValue,
                      comment: this.comment,
                    },
                    this.adminType === 'collaborate' ? this.statusServ.universityNameService : this.university,
                    this.adminType === 'collaborate' ? this.statusServ.courseNameService : this.course
                  )
                  .then(() => {
                    this.dayValue = '';
                    this.subjectValue = '';
                    this.startTimeValue = '';
                    this.typeValue = '';
                    this.locationValue = '';
                    this.startTimeValue = '';
                    this.endTimeValue = '';
                    this.startArray = [];
                    this.endArray = [];
                    this.startArrayStatus = false;
                    this.endArrayStatus = false;
                    this.notification.create(
                      'success',
                      'Everything Looks Fine😁',
                      'Timetable is Added!',
                      {
                        nzDuration: 2000,
                        nzPlacement: 'bottomLeft'
                      }
                    );
                  }).catch(error => {
                    console.log(error);
                  });
              }
            } else {
              // No data So user can just post timetable.
              this.servFirebase
                .uploadTimetable(
                  {
                    dayName: this.dayValue,
                    subjName: this.subjectValue,
                    type: this.typeValue,
                    location: this.locationValue,
                    start: this.startTimeValue,
                    end: this.endTimeValue,
                    comment: this.comment,
                  },
                  this.adminType === 'collaborate' ? this.statusServ.universityNameService : this.university,
                  this.adminType === 'collaborate' ? this.statusServ.courseNameService : this.course
                )
                .then(() => {
                  this.dayValue = '';
                  this.subjectValue = '';
                  this.startTimeValue = '';
                  this.typeValue = '';
                  this.locationValue = '';
                  this.startTimeValue = '';
                  this.endTimeValue = '';
                  this.startArray = [];
                  this.endArray = [];
                  this.startArrayStatus = false;
                  this.endArrayStatus = false;

                  this.notification.create(
                    'success',
                    'Everything Looks Fine😁',
                    'Timetable is Added!',
                    {
                      nzDuration: 2000,
                      nzPlacement: 'bottomLeft'
                    }
                  );
                });
            }
          });
      }
    }
  }

  loadSubjects() {
    this.statusServ.progressBarStatus = true;
    this.servFirebase.getCourseLongAndShort(
      this.adminType === 'collaborate' ? this.statusServ.universityNameService : this.university,
      this.adminType === 'collaborate' ? this.statusServ.courseNameService : this.course)
     .subscribe((datas) => {
       if (datas.length !== 0){
         // this.noData = false;
         this.allCourseInitials = datas;
         this.statusServ.subjectInitialForAll = datas;
        }else{
          // this.noData = true;
        }
      });
  }

}
