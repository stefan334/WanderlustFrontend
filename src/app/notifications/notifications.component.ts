import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification-service';
import { NotificationToggleService } from '../services/notification-toggle.service';
import { interval } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  showNotifications: boolean = false;

  constructor(private notificationService: NotificationService,
    private notificationToggleService: NotificationToggleService,
    private cookieService: CookieService) {}

  ngOnInit(): void {
    this.fetchNotifications();

    // Subscribe to the toggle event
    this.notificationToggleService.getToggleObservable().subscribe(() => {
      this.toggleNotifications();
    });
    
      interval(5000).subscribe(() => {
        if(this.cookieService.get("token") != ""){
        this.fetchNotifications();
      }
      });
   
 
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  fetchNotifications(): void {

    this.notificationService.getNotifications().subscribe(
      (notifications: any[]) => {
        this.notifications = notifications;
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  
}
