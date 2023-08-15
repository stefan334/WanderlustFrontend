import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { UserFeedComponent } from './user-feed/user-feed.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminStatisticsComponent } from './admin-statistics/admin-statistics.component';

const routes: Routes = [{ path: '', component: HomePageComponent },
{ path: 'profile/:username', component: ProfileComponent },
{ path: 'user-feed', component: UserFeedComponent },
{path: 'admin', component: AdminPanelComponent},
{ path: 'admin-statistics', component: AdminStatisticsComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
})
export class AppRoutingModule { }
