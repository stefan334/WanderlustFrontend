import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient, public cookieService: CookieService) {}
  private toggleSubject = new Subject<void>();

  toggleNotifications() {
    this.toggleSubject.next();
  }

  getToggleObservable() {
    return this.toggleSubject.asObservable();
  }
  getNotifications(): Observable<any[]> {
    // Replace with the appropriate API endpoint to fetch notifications
    const username = this.cookieService.get("username")
    const token = this.cookieService.get('token'); // Retrieve the authentication token from cookie
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Set the token in request headers
    return this.http.get<any[]>('http://localhost:8080/getNotifications/' + username + "/unread", {headers});

    
  }
}
