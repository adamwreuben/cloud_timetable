import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  current = 0;
  selectedCourse;
  
  chooseUniversity;
  chooseCourse;
  startYear;
  endYear;

  changeImageVerifiation: boolean = false;

  isVisibleMiddle = false;
  isVisibleMiddleVerification = false
  isVisibleMiddleCreate = false


  index: any = 0;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }


  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    this.router.navigate(['/home']);
    console.log('done');
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 0;
        break;
      }
      case 1: {
        this.index = 1;
        break;
      }
      case 2: {
        this.index = 2;
        break;
      }
      default: {
        this.index = 0;
      }
    }

  }

  handleOkMiddle(): void {
    this.isVisibleMiddle = false;
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }

  handleOkMiddleCreate(): void {
    this.isVisibleMiddleCreate = false;
  }

  handleCancelMiddleCreate(): void {
    this.isVisibleMiddleCreate = false;
  }

  showModalMiddleCreate(): void {
    this.isVisibleMiddleCreate = true;
  }

  handleOkMiddleVerification(): void {
    this.isVisibleMiddleVerification = false;
  }

  handleCancelMiddleVerification(): void {
    this.isVisibleMiddleVerification = false;
  }

  showModalMiddleVerification(): void {
    this.isVisibleMiddleVerification = true;
  }

  onSubmit(){

  }

  loadVerification(uid: any) {
    // this.statusServ.progressBarStatus = true;
    // this.fireService.getUserVerification(uid).subscribe((datas) => {
    //   if (datas.length != 0) {
    //     this.changeImageVerifiation = true;
    //     this.statusServ.progressBarStatus = false;
    //     this.snack.open('Wait For Verification!', '', { duration: 2000 });
    //     datas.forEach((results) => {
    //       this.status = results.payload.doc.data()['status'];
    //       if (this.status == 'verified') {
    //         this.routes.navigate(['/home']);
    //       } else {
    //         this.routes.navigate(['/verify']);
    //       }
    //     });
    //   } else {
    //     this.changeImageVerifiation = false;
    //     this.statusServ.progressBarStatus = false;
    //   }
    // });
  }

  requestVerifiation() {
    // this.statusServ.progressBarStatus = true;
    // this.afAuth.authState.subscribe((userData) => {
    //   this.fireService
    //     .verifyAdmins(userData.displayName, userData.email, userData.uid)
    //     .then(() => {
    //       this.statusServ.progressBarStatus = false;
    //       this.snack.open('Requested', '', { duration: 2000 });
    //     });
    // });
  }


}
