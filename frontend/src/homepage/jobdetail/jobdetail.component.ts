import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-jobdetail',
  templateUrl: './jobdetail.component.html',
  styleUrls: ['./jobdetail.component.scss']
})
export class JobdetailComponent {
  applications: any[] = [];
  toastMessage: string = '';
  toastClass: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('/api/applications/getApplications', { headers }).subscribe({
      next: (data) => {
        this.applications = data;
      },
      error: (err) => {
        console.error('Failed to load applications', err);
        this.showToast('Failed to load applications', 'error');
      }
    });
  }
  // deleteapplication
deleteApplication(applicationId: string): void {
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  if (!confirm('Are you sure you want to delete this application?')) {
    return;
  }
   this.http.delete(`/api/applications/delete-application/${applicationId}`, { headers }).subscribe({
    next: () => {
      this.showToast('Application deleted successfully', 'success');
      this.applications = this.applications.filter(app => app._id !== applicationId);
    },
    error: (err) => {
      console.error('Failed to delete application', err);
      this.showToast('Failed to delete application', 'error');
    }
  });
}


  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastClass = type;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }

}
