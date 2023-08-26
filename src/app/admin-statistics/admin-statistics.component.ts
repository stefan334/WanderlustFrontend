import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NavbarComponent } from '../navbar/navbar.component';
import { interval } from 'rxjs';

@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.css']
})
export class AdminStatisticsComponent implements OnInit {
  userStatistics: any;
  contentStatistics: any;
  activityStatistics: any;
  isAdmin = false; 
  totalPosts: number = 0;
  totalUsers: number = 0;
  averageLikesPerPost: number = 0;
  userWithMostPosts: any;
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit(): void {

    this.fetchTotalPosts();
    this.fetchTotalUsers();
    this.fetchAverageLikesPerPost();
    this.fetchUserWithMostPosts();
    const token = this.cookieService.get("token"); 
    const emailValue = NavbarComponent.getUserEmailFromToken(token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`http://localhost:8080/users/${emailValue}`, { headers }).subscribe(
      (user: any) => {
        console.log(user.role)
        this.isAdmin = "ADMIN" === user.role;
      },
      error => {
        console.error('Error fetching user:', error);
      }
    );
    interval(10000).subscribe(() => {
      this.fetchTotalPosts();
      this.fetchTotalUsers();
      this.fetchAverageLikesPerPost();
      this.fetchUserWithMostPosts();
    });
    
  }
  fetchTotalPosts() {
    const token = this.cookieService.get("token"); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<number>('http://localhost:8080/admin-statistics/total-posts', { headers }).subscribe((data: number) => {
      this.totalPosts = data;
    });
  }

  fetchTotalUsers() {
    const token = this.cookieService.get("token"); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<number>('http://localhost:8080/admin-statistics/total-users', { headers }).subscribe((data: number) => {
      this.totalUsers = data;
    });
  }

  fetchAverageLikesPerPost() {
    const token = this.cookieService.get("token");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<number>('http://localhost:8080/admin-statistics/average-likes-per-post', { headers }).subscribe((data: number) => {
      this.averageLikesPerPost = data;
    });
  }

  fetchUserWithMostPosts() {
    const token = this.cookieService.get("token");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>('http://localhost:8080/admin-statistics/user-with-most-posts', { headers }).subscribe((data: any) => {
      this.userWithMostPosts = data;
    });
  }
}
