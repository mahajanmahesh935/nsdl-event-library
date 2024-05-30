import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { EventLibraryModule } from "../../projects/event-library/src/lib/event-library.module";

import { HomeComponent } from "./home/home.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UserListComponent } from "./user-list/user-list.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { UserFomComponent } from "./user-fom/user-fom.component";
// import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import * as configData from "../environments/urlConfig";

// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { DemoComponent } from "./demo/demo.component";
import { EventDetailComponent } from "./event-detail/event-detail.component";
import { EnrollUsersComponent } from "./enroll-users/enroll-users.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserListComponent,
    UserDetailComponent,
    UserFomComponent,
    DemoComponent,
    EventDetailComponent,
    EnrollUsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EventLibraryModule.forChild(configData.urlConfig),
    BrowserAnimationsModule,
    HttpClientModule,
    // NgMultiSelectDropDownModule.forRoot(),
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: httpTranslateLoader,
    //     deps: [HttpClient]
    //   }
    // })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function httpTranslateLoader(http: HttpClient) {
  // return new TranslateHttpLoader(http, './assets/language/', '.json');
}
