import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-postedjob',
  templateUrl: './postedjob.component.html',
  styleUrls: ['./postedjob.component.scss']
})
export class PostedjobComponent {
  jobs: any[] = [];

  toastMessage= '';
  toastClass= '';

  editModalVisible = false;
  editJobData: any = {};
  editJobOriginalSkills: string = '';

  constructor(private http: HttpClient){}

  ngOnInit():void{
    this.loadJob();
  }

  loadJob():void{
    const token = sessionStorage.getItem('token');
    this.http.get<any[]>('http://localhost:5000/api/jobs/get-job',{
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next:(res) =>{
        console.log('Fetched Jobs:', res);
        this.jobs = res;
      },
      error:(err)=>{
        console.error('err');
        this.showToast('Failed to load jobs', 'error');
      }
    });
  }
  // deleted job
  deleteJob(jobId: string): void {
    if (confirm('Are you sure you want to delete this job?')) {
      const token = sessionStorage.getItem('token') || '';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post('http://localhost:5000/api/jobs/delete-job', { jobId }, { headers }).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(job => job.jobId !== jobId);
          this.showToast('Job deleted successfully', 'success');
        },
        error: (err) => {
          console.error(err);
          this.showToast('Error deleting job', 'error');
        }
      });
    }
  }

   openEditModal(job: any): void {
    this.editModalVisible = true;
    // Clone the job object to avoid direct mutations
    this.editJobData = { ...job };
    // Convert skills array to comma-separated string for editing
  this.editJobData.skillsString = Array.isArray(this.editJobData.skills)
  ? this.editJobData.skills.join(', ')
  : this.editJobData.skills || '';
  }

  // Called when the skills input changes
 skillsChanged(value: string) {
  this.editJobData.skillsString = value;
  this.editJobData.skills = value.split(",").map(s => s.trim()).filter(s => s.length > 0);
}

  // Save the edited job
  saveJob(): void {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.skillsChanged(this.editJobData.skillsString);

    this.http.post('http://localhost:5000/api/jobs/update-job', this.editJobData, { headers }).subscribe({
      next: (res: any) => {
        this.showToast('Job updated successfully', 'success');
        this.editModalVisible = false;
        
        const index = this.jobs.findIndex(job => job.jobId === this.editJobData.jobId);
        if (index !== -1) {
          this.jobs[index] = { ...this.editJobData };
        }
      },
      error: (err) => {
        console.error(err);
        this.showToast('Failed to update job', 'error');
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
