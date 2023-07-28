import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  images: any[] = [];

  constructor(private http: HttpClient, public cookieService: CookieService) { }

  ngOnInit() {
    // Fetch user data from the backend

    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const email = NavbarComponent.getUserEmailFromToken(token);
  
    this.http.get('http://localhost:8080/users/' +  email, {headers}).subscribe((userData: any) => {
      console.log(userData)
      this.user = userData;


    });

    // Fetch uploaded images from the backend
    this.http.get('http://localhost:8080/getImages/' +  email, {headers}).subscribe((images) => {
      console.log("Response:")
      console.log(images)
      this.images = images as any[]; 
    });
    
  }
}