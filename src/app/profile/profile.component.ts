import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = "";
  user: any;
  images: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public cookieService: CookieService
  ) { }

  ngOnInit() {
    // Get the username from the route
    this.username = this.route.snapshot.paramMap.get('username') as any;

    // Fetch user data from the backend
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const username = this.username; // Use this.username as the email since you want to fetch the profile based on the username
    this.http.get('http://localhost:8080/users/' + username).subscribe((userData: any) => {
      console.log(userData)
      this.user = userData;
    });

    // Fetch uploaded images from the backend
    this.http.get('http://localhost:8080/getImages/' + username).subscribe((images) => {
      console.log("Response:")
      console.log(images)
      this.images = images as any[];
    });
  }
}
