import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ProfileComponent } from './profile/profile.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { SearchModalComponent } from './search-modal/search-modal.component';
import { UserFeedComponent } from './user-feed/user-feed.component';
import { PostDetailModalComponent } from './post-detail-modal/post-detail-modal.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminStatisticsComponent } from './admin-statistics/admin-statistics.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ImageUploadComponent,
    ProfileComponent,
    UserSearchComponent,
    SearchModalComponent,
    UserFeedComponent,
    PostDetailModalComponent,
    NotificationsComponent,
    AdminPanelComponent,
    AdminStatisticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    ReactiveFormsModule
  ],
  exports: [ReactiveFormsModule],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
