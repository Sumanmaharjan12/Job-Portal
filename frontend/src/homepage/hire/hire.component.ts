import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hire',
  templateUrl: './hire.component.html',
  styleUrls: ['./hire.component.scss']
})
export class HireComponent implements OnInit {
  applications: any[] = [];
  filteredApplications: any[] = [];
  uniqueJobTitles: string[] = [];
  selectedJob: string = 'all';
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
        this.uniqueJobTitles = [...new Set(data.map(app => app.jobTitle))];
        this.applyFilter();
      },
      error: () => this.showToast('Failed to load applications', 'error')
    });
  }

  applyFilter(): void {
    if (this.selectedJob === 'all') {
      // Shuffle randomly for "all"
      this.filteredApplications = [...this.applications].sort(() => Math.random() - 0.5);
      // Remove rank
      this.filteredApplications.forEach(app => delete app.rank);
    } else {
      // Filter by job title and sort by score
      const filtered = this.applications
        .filter(app => app.jobTitle === this.selectedJob)
        .sort((a, b) => (b.score || 0) - (a.score || 0));
      // Add rank
      this.filteredApplications = filtered.map((app, index) => ({ ...app, rank: index + 1 }));
    }
  }

  onStatusChange(app: any, newStatus: string): void {
    if (newStatus === 'accepted') {
      this.openOverlay(app);
    } else {
      this.updateStatus(app._id, newStatus);
    }
  }

  updateStatus(applicationId: string, status: string, interviewDate?: string): void {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body: any = { status };
    if (interviewDate) body.interviewDate = interviewDate;

    this.http.put(`/api/applications/update-status/${applicationId}`, body, { headers }).subscribe({
      next: () => {
        this.showToast('Status updated successfully', 'success');
        this.showOverlay = false;
        this.loadApplications();
      },
      error: () => this.showToast('Failed to update status', 'error')
    });
  }

  openOverlay(app: any): void {
    this.selectedApplication = { ...app };
    this.showOverlay = true;
  }

  closeOverlay(): void {
    this.showOverlay = false;
    this.selectedApplication = null;
  }

  saveInterviewDate(): void {
    if (!this.selectedApplication?.interviewDate) {
      this.showToast('Please select interview date', 'error');
      return;
    }
    this.updateStatus(this.selectedApplication._id, 'accepted', this.selectedApplication.interviewDate);
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastClass = type === 'success' ? 'toast-success' : 'toast-error';
    setTimeout(() => {
      this.toastMessage = '';
      this.toastClass = '';
    }, 3000);
  }
}
