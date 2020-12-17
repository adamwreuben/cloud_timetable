import { Directive, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
@Directive({
  selector: '[appYahoo]'
})
export class YahooDirective {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  @HostListener('click')
  onclick() {
    this.afAuth.signInWithRedirect(new firebase.auth.OAuthProvider('yahoo.com'));
  }
}
