import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  pageSize: number = 10;
  isFetchingPosts = false; 
  showFollowingPosts: boolean = false; 

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
    const endpoint = this.showFollowingPosts ? '/getFollowingPosts' : '/getLatestPosts';
    const params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('pageSize', this.pageSize.toString());
  
    this.http.get<any[]>(`http://localhost:8080${endpoint}?userEmail=${this.userEmail}`, { headers, params }).subscribe(posts => {
      this.posts = posts;
    });
  }
  
  

  likePost(post: any): void {

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.post(`http://localhost:8080/like/${post.id}?email=${this.userEmail}`, {}, { headers }).subscribe((response: any) => {
      post.likes = response.likes;
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
    
    this.http.post(`http://localhost:8080/comment/${post.id}`, { text: 'Your comment here' }, { headers }).subscribe(response => {
      post.comments.length++;
    });
  }

  onCardScroll(event: any): void {
    const cardElement = event.target;
    const threshold = 50;

    if (
      !this.isFetchingPosts &&
      cardElement.scrollHeight - cardElement.scrollTop <= cardElement.clientHeight + threshold
    ) {
      this.isFetchingPosts = true;
      this.currentPage++;
      this.getMorePosts();
    }
  }
  
  getMorePosts(): void {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const endpoint = this.showFollowingPosts ? '/getFollowingPosts' : '/getLatestPosts';
  
    const params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('pageSize', this.pageSize.toString());
  
    const url = `http://localhost:8080${endpoint}?userEmail=${this.userEmail}`;
    
    this.http.get<any[]>(url, { headers, params }).subscribe(posts => {
      this.posts = this.posts.concat(posts);
      
      if (posts.length === 0) {
        this.isFetchingPosts = false;
      }
      
      this.cdRef.detectChanges();
    });
  }
  
  toggleView(): void {
    this.showFollowingPosts = !this.showFollowingPosts;
    this.currentPage = 1;
    this.getLatestPosts(); 
  }
  
  isPostLiked(post: any): boolean {
    return post.likes.some((like: any) => like.user.email === this.userEmail);
  }
  
}
