import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-adminjobs',
  templateUrl: './adminjobs.component.html',
  styleUrls: ['./adminjobs.component.scss']
})
export class AdminjobsComponent {
jobs: any[] = [];
status = ['pending','posted','rejected'];
loading = false;
toastMessage = '';
toastClass = '';

constructor(private http: HttpClient){}

ngOnInit(): void{
  this.fetchJobs();
}
fetchJobs():void{
  this.loading =true;
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.get<any>('/api/admin/jobs',{headers}).subscribe({
    next:(res) =>{
      this.jobs = res;
      this.loading = false;
    },
    error: () =>{
      this.showToast('Failde to load jobs' , 'error');
      this.loading = false;
    }
  });
}
 changeStatus(jobId: string, newStatus: string): void {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(`/api/admin/jobs/${jobId}/status`, { status: newStatus }, { headers }).subscribe({
      next: () => {
        this.showToast('Job status updated successfully', 'success');
        this.fetchJobs();
      },
      error: () => {
        this.showToast('Failed to update job status', 'error');
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
