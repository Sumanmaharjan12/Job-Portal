import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-postajob',
  templateUrl: './postajob.component.html',
  styleUrls: ['./postajob.component.scss']
})
export class PostajobComponent {
 jobForm: FormGroup;
 toastMessage = '';
 toastClass= '';
 

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Initialize the form group with all fields and validators
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      type: ['', Validators.required],
      salary: [''],
      experience: ['', Validators.required],
      education: ['', Validators.required],
      skills: ['', Validators.required],
      language: [''],
      softSkills: ['']
    });
  }

  // Called when the form is submitted
  onSubmit() {
  if (this.jobForm.invalid) {
    this.showToast('Please fill out all required fields.','error');
    return;
  }

  const jobData = {...this.jobForm.value};

  if(jobData.skills && typeof jobData.skills ==='string'){
   jobData.skills = jobData.skills
  .split(',')
  .map((skill: string) => skill.trim())
  .filter((skill: string) => skill.length > 0);
  }
  else{
    jobData.skills=[];
  }
  console.log('Posting job data:', jobData);
  const token = sessionStorage.getItem('token'); 

  // Prepare headers with the token
  const headers = {
    Authorization: `Bearer ${token}`
  };
  this.http.post('http://localhost:5000/api/jobs/post-job', jobData, { headers }).subscribe({
    next: (res) => {
       console.log('✅ API hit successful, response:', res);
      this.showToast('Job posted successfully!','success');
      this.jobForm.reset();
    },
    error: (err) => {
      console.error('Error while posting job:', err);
      this.showToast('Failed to post job. Please try again.','error');
    }
  });
}

showToast(message: string, type: 'success' | 'error'){
  this.toastMessage = message;
  this.toastClass= type==='success'?'toast-success':'toast-error';
  
  setTimeout(() => {
    this.toastMessage='';
    this.toastClass='';
  }, 3000);
}

}
