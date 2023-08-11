import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router
@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent {
  searchUsername: string = "" ;
  searchResults: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  searchUsers() {
    this.http.get<any[]>('http://localhost:8080/users/search', { params: { username: this.searchUsername } })
      .subscribe((users) => {
        this.searchResults = users;
      });
  }

  // Trigger the searchUsers method whenever the search input value changes
  onSearchInputChange() {
    this.searchUsers();
  }

  goToUserProfile(username: string) {
    this.router.navigate(['/profile', username]); // Navigate to the profile page
  }
}
