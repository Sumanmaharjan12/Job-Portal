import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hire',
  templateUrl: './hire.component.html',
  styleUrls: ['./hire.component.scss']
})
export class HireComponent {
applications: any[] = [];
  filteredApplications: any[] = [];
  selectedJob: string = 'all';
  uniqueJobTitles: string[] = [];
  toastMessage = '';
  toastClass = '';
  showOverlay = false;
  selectedApplication: any = null;

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
        this.filteredApplications = this.applications;
        this.uniqueJobTitles = [...new Set(this.applications.map(app => app.jobTitle))];
      },
      error: () => {
        this.showToast('Failed to load applications', 'error');
      }
    });
  }

  applyFilter() {
    if (this.selectedJob === 'all') {
      this.filteredApplications = this.applications;
    } else {
      this.filteredApplications = this.applications.filter(app => app.jobTitle === this.selectedJob);
    }
  }
  onStatusChange(application: any, newStatus: string) {
    if (newStatus === 'accepted') {
      // Open overlay to select interview date first
      this.openOverlay(application);
    } else {
      // Directly update pending/rejected status
      this.updateStatus(application._id, newStatus);
    }
  }

  updateStatus(applicationId: string, newStatus: string): void {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.put(`/api/applications/update-status/${applicationId}`, { status: newStatus }, { headers })
      .subscribe({
        next: () => {
          this.showToast('Status updated!', 'success');
           this.loadApplications();

        },
        error: () => {
          this.showToast('Failed to update status', 'error');
        }
      });
  }

  openOverlay(application: any) {
    this.selectedApplication = { ...application };
    this.showOverlay = true;
  }

  closeOverlay() {
    this.showOverlay = false;
    this.selectedApplication = null;
  }

  saveInterviewDate() {
    if (!this.selectedApplication) return;
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(`/api/applications/update-status/${this.selectedApplication._id}`, {
      status: 'accepted',
      interviewDate: this.selectedApplication.interviewDate
    }, { headers }).subscribe({
      next: () => {
        this.showToast('Interview date saved & email sent!', 'success');
        this.showOverlay = false;
        this.loadApplications();
      },
      error: () => {
        this.showToast('Failed to save interview date', 'error');
      }
    });
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastClass = type === 'success' ? 'toast-success' : 'toast-error';
    setTimeout(() => {
      this.toastMessage = '';
      this.toastClass = '';
    }, 3000);
  }
}

