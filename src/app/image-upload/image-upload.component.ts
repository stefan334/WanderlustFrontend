import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NavbarComponent } from '../navbar/navbar.component';
/// <reference types="@types/googlemaps" />
declare var google: any;


@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements AfterViewInit{
  selectedImage!: File;
  imageName: string = '';
  latitude: number | null = null;
  longitude: number | null = null;
  imageLocation: string = '';
  showSuccessMessage: boolean = false;
  @ViewChild('autocompleteInput') autocompleteInput!: ElementRef;

  constructor(private http: HttpClient, public cookieService: CookieService) {}


  ngAfterViewInit(): void {

    console.log('ngAfterViewInit called');
      const autocompleteInput = this.autocompleteInput.nativeElement;
      const autocompleteService = new google.maps.places.AutocompleteService();  
      const options = {
        types: ['geocode']
      };
  
    
      autocompleteInput.addEventListener('input', () => {
        const query = autocompleteInput.value;
        if (query.length > 0) {
          autocompleteService.getPlacePredictions({ input: query, ...options }, (predictions: any[], status: any) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              const suggestions = predictions.map((prediction) => prediction.description);
              autocompleteInput.setAttribute('list', 'suggestions-list');
              const datalist = document.getElementById('suggestions-list');
              if (datalist) {
                datalist.innerHTML = '';
                suggestions.forEach((suggestion) => {
                  const option = document.createElement('option');
                  option.value = suggestion;
                  datalist.appendChild(option);
                });
              }
            }
          });
        }
      });
    
  }
  
  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0] as File;
  }

  async getLocationCoordinates(location: string): Promise<any[]> {
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: location }, (results: any[], status: any) => {
        if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
          resolve(results);
        } else {
          reject(new Error('No results found for the provided location.'));
        }
      });
    });
  }

  async uploadImage() {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const userEmail = NavbarComponent.getUserEmailFromToken(token);

    if (this.imageLocation) {
      try {
        const geocodeResponse = await this.getLocationCoordinates(this.imageLocation);
        if (geocodeResponse.length > 0) {
          this.latitude = geocodeResponse[0].geometry.location.lat();
          this.longitude = geocodeResponse[0].geometry.location.lng();
        }
      } catch (error) {
        console.error('Failed to geocode location', error);
      }
    }
    console.log(this.latitude)
    const formData: FormData = new FormData();
    formData.append('email', userEmail!);
    formData.append('image', this.selectedImage);
    formData.append('name', this.imageName);
    formData.append('latitude', this.latitude?.toString() || '');
    formData.append('longitude', this.longitude?.toString() || '');
    formData.append('location', this.imageLocation);
    headers.append('Accept', 'application/json');

    this.http.post<boolean>('http://localhost:8080/uploadImage', formData, { headers }).subscribe(
      (response) => {
        if (response) {
          this.showSuccessMessage = true;
          console.log('Image uploaded successfully');
        } else {
          this.showSuccessMessage = false;
          console.error('Failed to upload image');
        }
      },
      (error) => {
        console.error('Failed to upload image', error);
      }
    );
  }
}
