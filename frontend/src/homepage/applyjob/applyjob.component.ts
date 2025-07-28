import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-applyjob',
  templateUrl: './applyjob.component.html',
  styleUrls: ['./applyjob.component.scss']
})
export class ApplyjobComponent implements OnInit{
    jobs: {
    title: string;
    description: string;
    category: string;
    type: string;
    createdAt: string;
    skills: string[];
    postedBy: {
      companyName: string;
      imageUrl?: string;
    };
  }[] = [];
  selectedJob: any = null;
  toastMessage= '';
  toastClass = '';

  constructor(private http:HttpClient){}
   ngOnInit(): void {
    this.loadJob();  // <-- call your API loader here
  }

  loadJob():void{
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>('/api/jobs/get-all',{headers}).subscribe({
      next:(data) =>{
        this.jobs = data;
      },
      error: (err) => {
        console.error('Failed to load Jobs',err);
      }
    });
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
 
getProfileImage(job: any): string {
  if (!job.postedBy?.imageUrl) {
    return 'assets/images/default-profile.png';
  }
  let filename = job.postedBy.imageUrl;

  // Remove leading 'uploads/' if present
  if (filename.startsWith('uploads/')) {
    filename = filename.substring('uploads/'.length);
  }

  return `http://localhost:5000/${filename}`;
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

// applied job
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
