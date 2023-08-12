import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.css']
})
export class UserFeedComponent implements OnInit {
  posts: any[] = [];

  constructor(private http: HttpClient, public cookieService: CookieService) {}

  ngOnInit(): void {
    this.getLatestPosts();
  }

  getLatestPosts(): void {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>('http://localhost:8080/getLatestPosts', { headers }).subscribe(posts => {
      this.posts = posts;
    });
  }

  likePost(post: any): void {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const userEmail = NavbarComponent.getUserEmailFromToken(token);
  
    // Make a POST request to like the post
    this.http.post(`http://localhost:8080/like/${post.id}?email=${userEmail}`, {}, { headers }).subscribe((response: any) => {
      // Update the likes count for the post
      console.log(response);
      post.likes = response.likes; // Update likes count from the server response
    });
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
}
