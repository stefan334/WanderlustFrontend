import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NavbarComponent } from '../navbar/navbar.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PostDetailModalComponent } from '../post-detail-modal/post-detail-modal.component';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.css']
})
export class UserFeedComponent implements OnInit {
  posts: any[] = [];
  userEmail: string = "";
  token: any;
  currentPage: number = 1;
  pageSize: number = 2;
  isFetchingPosts = false; 
  constructor(private http: HttpClient, public cookieService: CookieService,
    private modalService: BsModalService,
    private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getLatestPosts();
    this.token = this.cookieService.get('token');
    this.userEmail =  NavbarComponent.getUserEmailFromToken(this.token)!;
  }

  getLatestPosts(): void {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(`http://localhost:8080/getLatestPosts?page=${this.currentPage}&pageSize=${this.pageSize}`, { headers }).subscribe(posts => {
      this.posts = posts;
    });
  }

  likePost(post: any): void {

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  
    // Make a POST request to like the post
    this.http.post(`http://localhost:8080/like/${post.id}?email=${this.userEmail}`, {}, { headers }).subscribe((response: any) => {
      // Update the likes count for the post      post.likes = response.likes; // Update likes count from the server response
    });
  }
  openPostDetailModal(post: any, token: any, userEmail: any): void {
    token = this.token;
    userEmail = this.userEmail;
    const initialState = { post , token, userEmail};
    console.log(post);
    this.modalService.show(PostDetailModalComponent, { initialState });
  }

  addComment(post: any): void {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Make a POST request to add a comment to the post
    this.http.post(`http://localhost:8080/comment/${post.id}`, { text: 'Your comment here' }, { headers }).subscribe(response => {
      // Update the comments count for the post
      post.comments.length++;
    });
  }

  onCardScroll(event: any): void {
    const cardElement = event.target;
    const threshold = 50;

    if (
      !this.isFetchingPosts && // Check if posts are not currently being fetched
      cardElement.scrollHeight - cardElement.scrollTop <= cardElement.clientHeight + threshold
    ) {
      // Set the flag to indicate that posts are being fetched
      this.isFetchingPosts = true;

      // Load more posts
      this.currentPage++;
      this.getMorePosts();
    }
  }
  
  getMorePosts(): void {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8080/getLatestPosts?page=${this.currentPage}&pageSize=${this.pageSize}`;

    this.http.get<any[]>(url, { headers }).subscribe(posts => {
      this.posts = this.posts.concat(posts);
      console.log(posts)
      // Reset the flag after posts are fetched
      if(posts.length == 0)
      {
        this.isFetchingPosts = false;
      }
      // Manually trigger change detection
      this.cdRef.detectChanges();
    });
  }
  
  
  
}
