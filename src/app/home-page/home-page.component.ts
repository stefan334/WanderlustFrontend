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
      const map = L.map('map', { scrollWheelZoom: false }).setView([0, 0], 2);
    
      L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(map);
      var markers = L.markerClusterGroup();
      this.http.get('http://localhost:8080/getAllImages').subscribe((images) => {
        console.log("Response:")
        console.log(images)
        this.images = images as any[];
        
        for(const image of this.images){
          if(image.latitude != null && image.longitude != null){
          const markerLatLng = L.latLng(image.latitude, image.longitude);
          const marker = L.marker(markerLatLng);
          marker.bindPopup(`<div><img id="popup-image" src="${image.filePath}" alt="${image.name}" width="100"></div>`).openPopup();
          marker.on('popupopen', () => {
            const imageElement = document.getElementById('popup-image') as HTMLImageElement;
        
            imageElement.addEventListener('click', () => {
              this.openModal(imageElement.src);
            });
          });
        
          marker.on('popupclose', () => {
            const imageElement = document.getElementById('popup-image') as HTMLImageElement;
        
            imageElement.removeEventListener('click', () => {});
          });
          
          markers.addLayer(marker);
        }
      }
      });
      map.addLayer(markers);
      
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
    const closeButton = document.getElementsByClassName('close')[0];
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

}
