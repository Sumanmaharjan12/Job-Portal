import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
dropdownOpen = false;
role: string | null = null;


constructor(private authservice: AuthService, private router: Router){}
ngOnInit() {
    this.role = this.authservice.getUserRole();
  }

  logout() {
    this.authservice.logout();
     this.router.navigate(['/login']);
  }
toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}
}
