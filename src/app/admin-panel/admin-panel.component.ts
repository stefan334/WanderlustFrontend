import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  adminForm!: FormGroup;

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
  }
  updateUser() {
    const userId = this.adminForm.get('userId')!.value;
    const updatedUser = this.adminForm.get('updatedUser')!.value;
    const token = this.cookieService.get("token"); // Get the user token from your authentication service

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(`/admin/updateUser/${userId}`, updatedUser, { headers }).subscribe(
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

  deletePost() {
    const postId = this.adminForm.get('postId')!.value;
    const token = this.cookieService.get("token"); // Get the user token from your authentication service

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.delete(`/admin/deletePost/${postId}`, { headers }).subscribe(
      () => {
        console.log('Post deleted successfully.');
        // Handle success
      },
      error => {
        console.error('Error deleting post:', error);
        // Handle error
      }
    );
  }

  deleteImage() {
    const imageId = this.adminForm.get('imageId')!.value;
    const token = this.cookieService.get("token"); // Get the user token from your authentication service

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.delete(`/admin/deleteImage/${imageId}`, { headers }).subscribe(
      () => {
        console.log('Image deleted successfully.');
        // Handle success
      },
      error => {
        console.error('Error deleting image:', error);
        // Handle error
      }
    );
  }

  // Add methods for admin actions here

}
