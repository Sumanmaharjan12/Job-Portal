import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-postedjob',
  templateUrl: './postedjob.component.html',
  styleUrls: ['./postedjob.component.scss']
})
export class PostedjobComponent {
  jobs: any[] = [];
  filteredJobs: any[] = [];
  uniqueCategories: string[] = [];
  selectedCategory: string = 'all';
   categories: any[] = [];

  toastMessage= '';
  toastClass= '';

  editModalVisible = false;
  editJobData: any = {};
  editJobOriginalSkills: string = '';

  constructor(private http: HttpClient){}

  ngOnInit():void{
    this.loadJob();
     this.loadCategories();
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
          this.filteredJobs = this.jobs;

       
        this.uniqueCategories = [
          ...new Set(
            this.jobs
              .map(job => job.category?.name) 
              .filter(Boolean)                
          )
        ];
      },
      error:(err)=>{
        console.error('err');
        this.showToast('Failed to load jobs', 'error');
      }
    });
  }
   applyFilter(): void {
    if (this.selectedCategory === 'all') {
      this.filteredJobs = this.jobs;
    } else {
      this.filteredJobs = this.jobs.filter(
        job => job.category?.name === this.selectedCategory
      );
    }
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
 this.editJobData.category = job.category?._id || job.category || '';
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
          this.jobs[index] = res.job;
        }
      },
      error: (err) => {
        console.error(err);
        this.showToast('Failed to update job', 'error');
      }
    });
  }
   
  loadCategories(): void {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('http://localhost:5000/api/jobcategory/getcategories', { headers }).subscribe({
      next: res => this.categories = res.categories || res,
      error: err => this.showToast('Failed to load categories', 'error')
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
