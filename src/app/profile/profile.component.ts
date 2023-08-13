import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NavbarComponent } from '../navbar/navbar.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PostDetailModalComponent } from '../post-detail-modal/post-detail-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = "";
  user: any;
  images: any[] = [];
  locations: any[] = [];
  currentUser: any;
  followers: any[] = [];
  following: any[] = [];
  currentUserFollowing: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public cookieService: CookieService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    // Get the username from the route
    this.username = this.route.snapshot.paramMap.get('username') as any;
    
    // Fetch user data from the backend
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const username = this.username; 
    this.http.get('http://localhost:8080/users/' + username).subscribe((userData: any) => {
    
      this.user = userData;
    });

    // Fetch uploaded images from the backend
    this.http.get('http://localhost:8080/getImages/' + username).subscribe((images) => {
      this.images = images as any[];
      console.log(images);
    });


    this.http.get<any[]>('http://localhost:8080/recommendation', { params: { username: this.username } })
    .subscribe((locations) => {
      this.locations = locations;
   
    });
    const currentUserUsername = this.cookieService.get('username');
    this.http.get('http://localhost:8080/users/' + currentUserUsername, { headers }).subscribe((userData: any) => {
      console.log("result");
      console.log(userData)
      this.currentUser = userData;
    });
    
    console.log("Current userusername " + currentUserUsername)
    this.http.get('http://localhost:8080/getFollowing/' + currentUserUsername, { headers }).subscribe((userData: any) => {
      console.log("This user following:");
      console.log(userData)
      this.currentUserFollowing = userData;
    });

    this.http.get('http://localhost:8080/getFollowing/' + username, { headers }).subscribe((userData: any) => {
   
      this.following = userData;
    });

    this.http.get('http://localhost:8080/getFollowers/' + username, { headers }).subscribe((userData: any) => {
   
    this.followers = userData;
  });




  }



  isCurrentUserProfile(): boolean {
    const currentUserEmail = this.cookieService.get('userEmail'); // Replace with the actual cookie name
    return this.user && this.user.email === currentUserEmail;
  }

  isFollowingUser(): boolean {
    if (!this.user || !this.currentUserFollowing) {
      return false; // Return false if user or currentUserFollowing is not defined
    }
  
    return this.currentUserFollowing.some(item => item.username === this.user.username);
  }

// Method to handle the follow action
followUser(): void {
  const token = this.cookieService.get('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const currentUserEmail = NavbarComponent.getUserEmailFromToken(token)!;// Replace with the actual cookie name
  const userEmailToFollow = this.user.email;

  const params = new HttpParams()
    .set('userEmailToFollow', userEmailToFollow)
    .set('currentUserEmail', currentUserEmail);

  this.http.post('http://localhost:8080/follow', null, { headers, params })
    .subscribe(() => {
      // Refresh the user data after following
      this.ngOnInit();
    });
}

// Method to handle the unfollow action
unfollowUser(): void {
  const token = this.cookieService.get('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const currentUserEmail = NavbarComponent.getUserEmailFromToken(token)!; // Replace with the actual cookie name
  const userEmailToUnfollow = this.user.email;

  const params = new HttpParams()
    .set('userEmailToUnfollow', userEmailToUnfollow)
    .set('currentUserEmail', currentUserEmail);

  this.http.post('http://localhost:8080/unfollow', null, { headers, params })
    .subscribe(() => {
      // Refresh the user data after unfollowing
      this.ngOnInit();
    });
}

openImageModal(image: any): void {

  var token = this.cookieService.get('token');
  var post;
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.get('http://localhost:8080/getPostDetailsFromImage/' + image.image_id, { headers }).subscribe((postData: any) => {

    post = postData;
    console.log("post is")
    console.log(post)
    var userEmail = NavbarComponent.getUserEmailFromToken(token);
    const initialState = { post , token, userEmail};
  
    this.modalService.show(PostDetailModalComponent, { initialState });
  });

}

}
