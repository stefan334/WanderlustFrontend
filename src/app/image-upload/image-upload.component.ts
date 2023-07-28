import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  selectedImage!: File;
  imageName: string = '';
  imageLocation: string = '';

  constructor(private http: HttpClient, public cookieService: CookieService) {}

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0] as File;
  }

  uploadImage() {
     // Replace with the user's email
     const token = this.cookieService.get('token');
     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
     const userEmail = NavbarComponent.getUserEmailFromToken(token);
    const formData: FormData = new FormData();
    formData.append('email', userEmail!);
    formData.append('image', this.selectedImage);
    formData.append('name', this.imageName);
    formData.append('location', this.imageLocation);


    headers.append('Accept', 'application/json');

    this.http.post<boolean>('http://localhost:8080/uploadImage', formData, { headers }).subscribe(
      (response) => {
        if (response) {
          console.log('Image uploaded successfully');
        } else {
          console.error('Failed to upload image');
        }
      },
      (error) => {
        console.error('Failed to upload image', error);
      }
    );
  }
}
