import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router, public authService: AuthService) {}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToSignup(): void {
    this.router.navigate(['/login'], { queryParams: { signup: true } });
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
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
