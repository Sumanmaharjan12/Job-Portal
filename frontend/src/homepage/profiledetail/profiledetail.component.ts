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
   isValidating: boolean = false;
  isSaving: boolean = false;

 
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
      
        
         // Format establishedDate
      if (res.establishedDate) {
        res.establishedDate = res.establishedDate.substring(0, 10);
      }

      // Format dob
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
  if (!token) {
    this.showToast('You are not logged in', 'error');
    return;
  }

  const saveProfile = () => {
    const formData = new FormData();
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
    formData.append('name', this.profile.name || '');
    formData.append('email', this.profile.email || '');
    formData.append('skills', Array.isArray(this.profile.skills) ? JSON.stringify(this.profile.skills) : (this.profile.skills || ''));
    if (this.selectedFile) formData.append('cv', this.selectedFile);

    this.isSaving = true;

    this.http.put<any>('http://localhost:5000/api/profile/update', formData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.showToast('Profile updated successfully', 'success');
        this.isEditing = false;
        this.selectedFile = null;
        this.selectedFileName = null;
        this.profile = {
          ...this.profile,
          ...res.profile,
          name: res.user?.name || this.profile.name,
          email: res.user?.email || this.profile.email
        };
      },
      error: (err) => {
        console.error(err);
        this.showToast('Failed to update profile', 'error');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  };

  if (this.selectedFile) {
  const validationData = new FormData();
  validationData.append('file', this.selectedFile);

  this.isValidating = true;

  this.http.post<{
    is_valid: boolean;
    confidence: number;
    keywords_found: string[];
    message: string;
  }>(
    'http://127.0.0.1:5001/validate-cv',
    validationData
  ).subscribe({
    next: (res) => {
      console.log('CV validation response:', res);

      // Ensure keywords_found is an array
      const keywordsFound = Array.isArray(res.keywords_found) ? res.keywords_found : [];

      // Accept CV if ML says valid OR at least 3 keywords found
      const keywordAcceptance = keywordsFound.length >= 3;
      const isValid = res.is_valid === true || keywordAcceptance;

      if (isValid) {
        this.showToast(
          `CV accepted ✅ | Confidence: ${res.confidence} | Keywords: ${keywordsFound.join(', ')}`,
          'success'
        );
        saveProfile();
      } else {
        this.showToast(
          `CV rejected ❌: ${res.message || 'Not a valid CV'} | Keywords: ${keywordsFound.join(', ')}`,
          'error'
        );
      }
    },
    error: (err) => {
      console.error('CV validation failed', err);
      this.showToast('Failed to validate CV. Try again.', 'error');
    },
    complete: () => {
      this.isValidating = false;
    }
  });
} else {
  saveProfile();
}
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
