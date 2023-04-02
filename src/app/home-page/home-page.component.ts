import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { CookieService } from 'ngx-cookie-service';


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
    const map = L.map('map', {scrollWheelZoom:false}).setView([0,0], 2);



  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 20}).addTo(map);

  }

}
