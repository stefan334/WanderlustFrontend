import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import 'leaflet.markercluster';



import 'leaflet.markercluster';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  username: string = "";
  images: any[] = [];

  constructor(private http: HttpClient,
    public cookieService: CookieService) { }

    ngOnInit(): void {
      // Initialize the map
      const map = L.map('map', { scrollWheelZoom: false }).setView([0, 0], 2);
    
      // Add the tile layer to the map
      L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(map);
      var markers = L.markerClusterGroup();
      this.http.get('http://localhost:8080/getAllImages').subscribe((images) => {
        console.log("Response:")
        console.log(images)
        this.images = images as any[];
        
        // Create markers for each image
        for(const image of this.images){
          if(image.latitude != null && image.longitude != null){
          const markerLatLng = L.latLng(image.latitude, image.longitude);
          const marker = L.marker(markerLatLng);
          marker.bindPopup(`<div><img id="popup-image" src="${image.filePath}" alt="${image.name}" width="100"></div>`).openPopup();
          // Event listener to handle the popupopen event
          marker.on('popupopen', () => {
            // Get the image element from the popup
            const imageElement = document.getElementById('popup-image') as HTMLImageElement;
        
            // Add a click event listener to open the modal on image click
            imageElement.addEventListener('click', () => {
              this.openModal(imageElement.src);
            });
          });
        
          // Event listener to handle the popupclose event
          marker.on('popupclose', () => {
            // Get the image element from the popup
            const imageElement = document.getElementById('popup-image') as HTMLImageElement;
        
            // Remove the click event listener to prevent multiple event bindings
            imageElement.removeEventListener('click', () => {});
          });
          
          markers.addLayer(marker);
        }
      }
      });
      map.addLayer(markers);
      
      // Event listener to handle the map click event to close the modal
      map.on('click', () => {
        const modal = document.getElementById('imageModal')!;
        modal.style.display = 'none';
      });
    }
    


   openModal(imageUrl: string) {
    const modal = document.getElementById('imageModal')!;
    const modalImage = document.getElementById('modalImage') as HTMLImageElement;
    modalImage.src = imageUrl;
    modal.style.display = 'block';

    // Add a click event listener to close the modal when the close button is clicked
    const closeButton = document.getElementsByClassName('close')[0];
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

}
