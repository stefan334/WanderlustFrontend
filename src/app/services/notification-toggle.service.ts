import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationToggleService {
  private toggleSubject = new Subject<void>();

  toggleNotifications() {
    console.log("Toggle in toggle service");
    this.toggleSubject.next();
  }

  getToggleObservable() {
    console.log("Observable in toggle service");
    return this.toggleSubject.asObservable();
  }
}
