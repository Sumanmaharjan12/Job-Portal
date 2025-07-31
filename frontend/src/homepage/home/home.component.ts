import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
userRole: string | null = null;
  private roleSubscription!: Subscription;

  constructor(public authService: AuthService) {
    this.roleSubscription = this.authService.userRole$.subscribe((role) => {
      this.userRole = role;
    });
  }

  ngOnDestroy() {
    this.roleSubscription.unsubscribe();
  }
}
