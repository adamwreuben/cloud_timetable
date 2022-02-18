import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './account/login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GoogleSignDirective } from './DirectiveForder/google-sign.directive';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ReviewComponent } from './review/review.component';
import { ReviewUeComponent } from './review-ue/review-ue.component';
import { CollisionComponent } from './collision/collision.component';
import { ClassFileComponent } from './class-file/class-file.component';
import { HomeComponent } from './home/home.component';
import { MondayComponent } from './days/monday/monday.component';
import { TuesdayComponent } from './days/tuesday/tuesday.component';
import { WednesdayComponent } from './days/wednesday/wednesday.component';
import { ThursdayComponent } from './days/thursday/thursday.component';
import { FridayComponent } from './days/friday/friday.component';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { MyStuffComponent } from './my-stuff/my-stuff.component';


import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { FridayUeComponent } from './ue-day/friday-ue/friday-ue.component';
import { MondayUeComponent } from './ue-day/monday-ue/monday-ue.component';
import { ThursdayUeComponent } from './ue-day/thursday-ue/thursday-ue.component';
import { TuesdayUeComponent } from './ue-day/tuesday-ue/tuesday-ue.component';
import { WednesdayUeComponent } from './ue-day/wednesday-ue/wednesday-ue.component';
import { NopageComponent } from './nopage/nopage.component';
import { YahooDirective } from './yahoo.directive';
import { VerifyComponent } from './verify/verify.component';

import { LettersAvatarModule } from "ngx-letters-avatar";
import { TimeMomentPipe } from './pipes/time-moment.pipe';
import { AllComponent } from './all/all.component';
import { CollegeComponent } from './college/college.component';
import { ViewkanbanComponent } from './viewkanban/viewkanban.component';

registerLocaleData(en);

const avatarColors =
[
  "#FF1744",
  "#F50057",
  "#D500F9",
  "#651FFF",
  "#3D5AFE",
  "#2979FF",
  "#00B0FF",
  "#00E5FF",
  "#1DE9B6",
  "#00E676",
  "#76FF03",
  "#C6FF00",
  "#FFEA00",
  "#FFC400",
  "#FF9100",
  "#FF3D00",
  "#3E2723",
  "#212121",
  "#263238"
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GoogleSignDirective,
    SidebarComponent,
    ReviewComponent,
    ReviewUeComponent,
    CollisionComponent,
    ClassFileComponent,
    HomeComponent,
    MondayComponent,
    TuesdayComponent,
    WednesdayComponent,
    ThursdayComponent,
    FridayComponent,
    OverviewPageComponent,
    MyStuffComponent,
    NopageComponent,

    MondayUeComponent,
    TuesdayUeComponent,
    WednesdayUeComponent,
    ThursdayUeComponent,
    FridayUeComponent,
    YahooDirective,
    VerifyComponent,
    TimeMomentPipe,
    AllComponent,
    CollegeComponent,
    ViewkanbanComponent,

  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule,// storage
    LettersAvatarModule
  ],

  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
