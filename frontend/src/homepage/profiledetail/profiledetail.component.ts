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
  profile: any={};
  selectedFileName: string | null = null;
  role: 'JobKeeper' | 'JobSeeker' = 'JobSeeker';

  isEditing = false;

 
  constructor(private http:HttpClient){}

  ngOnInit():void{
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

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
        this.profile = res;
         // ✅ Format establishedDate
      if (res.establishedDate) {
        res.establishedDate = res.establishedDate.substring(0, 10);
      }

      // ✅ Format dob
      if (res.dob) {
        res.dob = res.dob.substring(0, 10);
      }
      },
      error:(err)=>{
        console.error('Failed to load profile data', err);
      }
    });
  }
  onEdit():void{
    this.isEditing = true;
  }

  onSave(): void{
    const token = localStorage.getItem('token');

    this.http.put<any>('http://localhost:5000/api/profile/update', this.profile, {
      headers:{
        Authorization :  `Bearer ${token}`
      }
    }).subscribe({
      next: (res) => {
         this.showToast('Profile updated successfully','success');
         this.isEditing= false;
      },
      error:(err) =>{
        this.showToast('Failed to update profile','error');
      }
    })
  }

  onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.selectedFileName = file.name;
    const formData = new FormData();
    formData.append('cv', file);

    // Call your backend API to upload the file
    this.http.post<{ fileUrl: string }>('YOUR_UPLOAD_ENDPOINT', formData)
      .subscribe({
        next: (res) => {
          // Save the returned file URL
          this.profile.cvUrl = res.fileUrl;
        },
        error: (err) => {
          console.error('Upload failed', err);
        }
      });
   } else{
    this.selectedFileName = null;
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
