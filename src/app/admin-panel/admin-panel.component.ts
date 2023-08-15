import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  adminForm!: FormGroup;
  isAdmin = false; 
  userDataLoaded = false;
  username = "";
  posts: any[] = [];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      userId: ['', Validators.required],
      updatedUser: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', Validators.required]
      }),
      postId: ['', Validators.required],
      imageId: ['', Validators.required]
    });
    const token = this.cookieService.get("token"); // Get the user token from your authentication service
    const emailValue = NavbarComponent.getUserEmailFromToken(token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`http://localhost:8080/users/${emailValue}`, { headers }).subscribe(
      (user: any) => {
        console.log(user.role)
        this.isAdmin = "ADMIN" === user.role;
      },
      error => {
        console.error('Error fetching user:', error);
        // Handle error
      }
    );

  }
  updateUser() {
    const userId = this.adminForm.get('userId')!.value;
    const updatedUser = this.adminForm.get('updatedUser')!.value;
    const token = this.cookieService.get("token"); // Get the user token from your authentication service

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(`http://localhost:8080/admin/updateUser/${userId}`, updatedUser, { headers }).subscribe(
      () => {
        console.log('User updated successfully.');
        // Handle success, e.g., display a success message
      },
      error => {
        console.error('Error updating user:', error);
        // Handle error, e.g., display an error message
      }
    );
  }



  deletePost(postId: number) {
    const token = this.cookieService.get("token");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`http://localhost:8080/admin/deletePost/${postId}`, { headers }).subscribe(
      () => {
        console.log('Post deleted successfully.');
        // Remove the deleted post from the posts array
        this.posts = this.posts.filter(post => post.id !== postId);
      },
      error => {
        console.error('Error deleting post:', error);
        // Handle error
      }
    );
  }

  

  // Add methods for admin actions here

  getUserByUsername() {
    const token = this.cookieService.get("token");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    var userid = -1;
    this.http.get(`http://localhost:8080/users/${this.username}`, { headers }).subscribe(
      (user: any) => {
        // Update the form values with user data
        this.adminForm.patchValue({
          userId: user.id,
          updatedUser: {
            name: user.name,
            email: user.email,
            username: user.username,
            password: user.password
            // Add other fields here
          }
        });
        userid = user.id;
        this.userDataLoaded = true;
        this.http.get<any[]>(`http://localhost:8080/getPostsOfUser/${userid}`, { headers })
        .subscribe(
          (posts: any[]) => {
            this.posts = posts;
          },
          error => {
            console.error('Error fetching posts:', error);
            // Handle error
          }
        );
      },
      error => {
        console.error('Error fetching user:', error);
        // Handle error
      }
    );


  }
  
}

