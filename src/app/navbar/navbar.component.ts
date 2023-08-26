import { Component, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { NavigationService } from '../user-search/navigation-service';
import { NotificationToggleService } from '../services/notification-toggle.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  modalRef: BsModalRef;
  showLogin = true;
  quizModalRef: BsModalRef;
  currentQuestionIndex = 0;
  selectedAnswer: string = "";
  submitted = false;
  locations : string= "";
  username:string="";
  
  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private modalService: BsModalService,
    private http: HttpClient,
    public cookieService: CookieService,
    private notificationToggleService: NotificationToggleService
  ) {
    this.modalRef = new BsModalRef();
    this.quizModalRef = new BsModalRef();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  toggleNotifications() {
    console.log("Toggle in navbar");
    this.notificationToggleService.toggleNotifications();
  }


  toggleLoginRegister() {
    this.showLogin = !this.showLogin;
  }
  
  navigateToProfile() {
    
    this.navigationService.navigateToProfile(this.cookieService.get("username"));
  }

  navigateToUserFeed(): void {
    this.router.navigate(['/user-feed']); 
  }

  static getUserEmailFromToken(token: any) {
    try {
      const decodedToken: any = jwt_decode(token);
  
      const userEmail: string = decodedToken.sub;
      return userEmail;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  openImageUploadModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  
submitForm() {
  const token = this.cookieService.get('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const email = NavbarComponent.getUserEmailFromToken(token);

  const locationsArray = this.locations.split(',').map(location => location.trim());

  this.http.post('http://localhost:8080/user/locations', { email, locations: locationsArray }, {headers}).subscribe(
    () => {
      console.log('Locations added successfully');
      this.modalRef.hide();
    },
    error => {
      console.error('Error adding locations', error);
    }
  );
}


}
