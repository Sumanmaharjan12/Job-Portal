import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-adminjobseeker',
  templateUrl: './adminjobseeker.component.html',
  styleUrls: ['./adminjobseeker.component.scss']
})
export class AdminjobseekerComponent {
jobSeekers: any[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' | 'warning' = 'success';

  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchJobSeekers();
  }

  fetchJobSeekers(): void {
    this.loading = true;
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('/api/admin/jobseekers', { headers }).subscribe({
      next: (res) => {
        this.jobSeekers = res.jobSeekers;
        this.loading = false;
      },
      error: () => {
        this.setMessage('Failed to load job seekers', 'error');
        this.loading = false;
      }
    });
  }

  deleteJobSeeker(userId: string): void {
    if (!confirm('Are you sure you want to delete this job seeker?')) return;

   const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);


    this.http.delete(`/api/admin/users/${userId}`, { headers }).subscribe({
      next: () => {
        this.setMessage('Job seeker deleted successfully', 'success');
        this.fetchJobSeekers();
      },
      error: () => {
        this.setMessage('Failed to delete job seeker', 'error');
      }
    });
  }

  setMessage(msg: string, type: 'success' | 'error' | 'warning') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 4000);
  }

  clearMessage() {
    this.message = '';
  }
}
