import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification-service';
import { NotificationToggleService } from '../services/notification-toggle.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  showNotifications: boolean = false;

  constructor(private notificationService: NotificationService,
    private notificationToggleService: NotificationToggleService) {}

  ngOnInit(): void {
    this.fetchNotifications();

    // Subscribe to the toggle event
    this.notificationToggleService.getToggleObservable().subscribe(() => {
      this.toggleNotifications();
    });
  }

  toggleNotifications(): void {
    console.log("Toggle in notification");
    this.showNotifications = !this.showNotifications;
  }

  fetchNotifications(): void {

    console.log("fetching nothing")
    // Call the notification service to fetch notifications
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
