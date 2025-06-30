import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-filler',
  templateUrl: './filler.component.html',
  styleUrls: ['./filler.component.scss']
})
export class FillerComponent {
 selectedRole: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedRole = params['role'] || null;

      // Optionally auto-fill a form control or variable
      console.log('Auto-selected role:', this.selectedRole);
    });
  }
}
