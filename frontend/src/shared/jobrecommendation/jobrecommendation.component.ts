import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-jobrecommendation',
  templateUrl: './jobrecommendation.component.html',
  styleUrls: ['./jobrecommendation.component.scss']
})
export class JobrecommendationComponent {
 recommendedJobs: any[] = [];
  selectedJob: any = null;


  toastMessage = '';
  toastClass = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadRecommendedJobs();
  }
     getFirst50Words(text: string): string {
  if (!text) return '';
  const words = text.split(/\s+/); // split by any whitespace
  if (words.length <= 60) {
    return text;
  }
  return words.slice(0, 60).join(' ') + '...';
}

  openJobDetails(job: any): void{
    this.selectedJob = job;
  }

  closeJobDetail(): void{
    this.selectedJob = null;
  }
  
getDaysAgo(dateString: string): string {
  if (!dateString) return '';

  const now = new Date();
  const date = new Date(dateString);
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return '1 day ago';
  } else {
    return `${diffDays} days ago`;
  }
}

  loadRecommendedJobs(): void {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('http://localhost:5000/api/recommendations/:userId', { headers }).subscribe({
      next: (res) => {
        console.log('Recommended Jobs:', res);
        this.recommendedJobs = res.recommendations || [];
      },
      error: (err) => {
        console.error(err);
        this.showToast('Failed to load recommended jobs', 'error');
      }
    });
  }

  // Optional: View job details
  viewJob(job: any): void {
    alert(`Job: ${job.title}\nCompany: ${job.postedBy?.companyName}\nMatched Skills: ${job._matchedSkills.join(', ')}`);
  }

  applyJob(jobId: string) {
  const token = sessionStorage.getItem('token') || '';

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.post<{ message: string }>('/api/applications/applyjob', { jobId }, { headers }).subscribe({
    next: (res) => {
      this.showToast(res.message || 'Application submitted successfully', 'success');
      this.closeJobDetail();
    },
    error: (err) => {
      console.error('Failed to apply for job', err);
      const errorMsg = err.error?.message || 'Failed to send application';
      this.showToast(errorMsg, 'error');  // Show backend message here
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
