import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profiledetail',
  templateUrl: './profiledetail.component.html',
  styleUrls: ['./profiledetail.component.scss']
})
export class ProfiledetailComponent {
   toastMessage = '';
 toastClass= '';
  profile: any={
    cvUrl: ''
  };
  selectedFileName: string| null=null;
  selectedFile: File | null = null;
 
  role: 'JobKeeper' | 'JobSeeker' = 'JobSeeker';

  isEditing = false;

 
  constructor(private http:HttpClient){}

  ngOnInit():void{
    const token = sessionStorage.getItem('token');
    const savedRole = sessionStorage.getItem('role');

    if(savedRole==='JobKeeper' || savedRole === 'JobSeeker'){
      this.role = savedRole;
    }

    this.http.get<any>('http://localhost:5000/api/profile/details',{
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next:(res)=>{
        console.log('profile data:',res);
        if (this.role === 'JobSeeker') {
      delete res.issues;
      delete res.riskLevel;
    }
      
        
         // ✅ Format establishedDate
      if (res.establishedDate) {
        res.establishedDate = res.establishedDate.substring(0, 10);
      }

      // ✅ Format dob
      if (res.dob) {
        res.dob = res.dob.substring(0, 10);
      }
        this.profile = res;
      },
      error:(err)=>{
        console.error('Failed to load profile data', err);
      }
      
    });
  }
  onEdit():void{
    this.isEditing = true;
  }

 

  onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if(extension !=='pdf'){
      this.showToast('Please select a PDF file only','error');
      this.selectedFileName = null;
      this.selectedFile= null;
      return;
    }
    this.selectedFileName = file.name;
    this.selectedFile= file;
  
    } else {
      this.selectedFileName = null;
      this.selectedFile = null;
    }
  }

 onSave(): void {
  const token = sessionStorage.getItem('token');
  const formData = new FormData();

  // ✅ Append known fields
  formData.append('role', this.profile.role || '');
  formData.append('phone', this.profile.phone || '');
  formData.append('location', this.profile.location || '');
  formData.append('gender', this.profile.gender || '');
  formData.append('dob', this.profile.dob || '');
  formData.append('qualification', this.profile.qualification || '');
  formData.append('experience', this.profile.experience || '');
  formData.append('companyName', this.profile.companyName || '');
  formData.append('companyAddress', this.profile.companyAddress || '');
  formData.append('companyWebsite', this.profile.companyWebsite || '');
  formData.append('establishedDate', this.profile.establishedDate || '');
  formData.append('jobOpenings', this.profile.jobOpenings || '');

  // ✅ Make sure name & email are plain strings
  formData.append('name', this.profile.name ? String(this.profile.name) : '');
  formData.append('email', this.profile.email ? String(this.profile.email) : '');

  // ✅ skills may be array → stringify only this
  if (Array.isArray(this.profile.skills)) {
    formData.append('skills', JSON.stringify(this.profile.skills));
  } else {
    formData.append('skills', this.profile.skills || '');
  }

  // ✅ Append file if selected
  if (this.selectedFile) {
    formData.append('cv', this.selectedFile);
  }

  this.http.put<any>('http://localhost:5000/api/profile/update', formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe({
    next: (res) => {
      this.showToast('Profile updated successfully', 'success');
      this.isEditing = false;
      this.selectedFileName = null;
      this.selectedFile = null;
      this.profile ={
        ...this.profile,
        ...res.profile,
        name: res.user?.name || this.profile.name,
        email: res.user?.email || this.profile.email,
      };
    },
    error: (err) => {
      this.showToast('Failed to update profile', 'error');
      console.error(err);
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
