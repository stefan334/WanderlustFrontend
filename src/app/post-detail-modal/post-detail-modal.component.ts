import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NavigationService } from '../user-search/navigation-service';

@Component({
  selector: 'app-post-detail-modal',
  templateUrl: './post-detail-modal.component.html',
  styleUrls: ['./post-detail-modal.component.css']
})
export class PostDetailModalComponent {
  @Input() post: any;
  @Input() userEmail:any;
  @Input() token: any;
  newComment: string = '';

  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpClient,
    public cookieService: CookieService,
    private navigationService: NavigationService
  ) {
    console.log("post is in modal:")
    console.log(this.post);
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  publishComment(): void {
    if (this.newComment.trim() !== '') {
      
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

      // Make a POST request to add a comment to the post
      this.http.post(`http://localhost:8080/comment/${this.post.id}?email=${this.userEmail}`, { text: this.newComment }, { headers })
      .subscribe((response: any) => { 
        // Update comments from the response
        this.post.comments = response.comments; // Assuming the response contains updated comments
    
        this.newComment = ''; // Clear the input field
      });
    
    }
  }

  navigateToUserProfile(username: string): void {
    this.navigationService.navigateToProfile(username);
  }
  
}
