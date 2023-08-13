import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  navigateToProfile(username: string): void {
    this.router.navigate(['/profile', username]);
  }
}
