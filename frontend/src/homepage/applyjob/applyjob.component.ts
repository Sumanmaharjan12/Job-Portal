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
    postedBy: {
      companyName: string;
      imageUrl?: string;
    };
  }[] = [];
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
  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastClass = type === 'success' ? 'toast-success' : 'toast-error';

    setTimeout(() => {
      this.toastMessage = '';
      this.toastClass = '';
    }, 3000);
  }
}
