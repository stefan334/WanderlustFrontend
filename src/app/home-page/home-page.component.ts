import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { CookieService } from 'ngx-cookie-service';

import 'leaflet.markercluster';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  username: string = "";

  constructor(public cookieService: CookieService) { }

  ngOnInit(): void {
    // Initialize the map
    const map = L.map('map', { scrollWheelZoom: false }).setView([0, 0], 2);

    // Add the tile layer to the map
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    // Create a custom icon for the marker
    const customIcon = L.icon({
      iconUrl: 'assets/explorer_satin.png', // Replace with the URL to your custom marker icon
      iconSize: [32, 32], // Set the size of the custom icon
      iconAnchor: [16, 32], // Set the anchor point of the custom icon
      popupAnchor: [0, -32], // Offset the popup
    });

    // Replace the latitude and longitude with the desired location of the marker
    const markerLatLng = L.latLng(35.6895, 139.6917);

    // Create the marker with the custom icon
    const marker = L.marker(markerLatLng).addTo(map);

    // Add a popup to the marker and make it always show
    marker.bindPopup('<div><img id="popup-image" src="assets/explorer_satin.png" alt="Image Popup" width="100"></div>').openPopup();
    
   
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
