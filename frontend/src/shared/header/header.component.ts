import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  
  profileImageUrl: string = '';

  constructor(private router: Router, public authService: AuthService, private http:HttpClient) {}
  
 ngOnInit(): void {
  const token = sessionStorage.getItem('token'); // Ensure token is stored after login

  this.http.get<any>('http://localhost:5000/api/profile/check', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe({
    next: (res) => {
      if (res.imageUrl) {
        this.profileImageUrl = 'http://localhost:5000/' + res.imageUrl;
       console.log('Profile Image URL:', this.profileImageUrl);
      }
    },
    error: (err) => {
      console.error('Failed to load profile image', err);
    }
  });
}


  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToSignup(): void {
    this.router.navigate(['/login'], { queryParams: { signup: true } });
  }

  goToProfile(): void {
    console.log('Navigating to profile...');
    this.router.navigate(['/profiledetail']);
  }

  logout(): void {
    this.authService.setLoginStatus(false);
    localStorage.removeItem('role');  // also clear role on logout
    this.router.navigate(['/home']);
  }

  // Getters with debugging to check values in console
  get isLoggedIn(): boolean {
    const loggedIn = this.authService.getLoginStatus();
    console.log('HeaderComponent isLoggedIn:', loggedIn);
    return loggedIn;
  }

  get userRole(): string | null {
    const role = this.authService.getUserRole();
    console.log('HeaderComponent userRole:', role);
    return role;
  }

  isJobSeeker(): boolean {
    return this.isLoggedIn && this.userRole === 'JobSeeker';
  }

  isJobKeeper(): boolean {
    return this.isLoggedIn && this.userRole === 'JobKeeper';
  }

  isPublic(): boolean {
    return !this.isLoggedIn;
  }
  
}
