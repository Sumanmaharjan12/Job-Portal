import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  currentStep = 1;

  // Preview
  imagePreview: string | ArrayBuffer | null = null;

  // Skills list
  skills: string[] = [];

  // File names
  cvFileName: string | null = null;

  // File references
  private imageFile: File | null = null;
  private cvFile: File | null = null;
 message = '';
  messageType: 'success' | 'error' | 'warning' = 'success';
  // Personal & professional info fields
  phone: string = '';
  location: string = '';
  gender: string = '';
  dob: string = '';
  qualification: string = '';
  experience: number | null = null;
  newSkill: string = '';

  // User name and email (readonly)
  userData = {
    name: '',
    email: ''
  };

  
  constructor(private authService: AuthService, private router: Router) {}
  

  ngOnInit() {
    const user = this.authService.getUserData();
    console.log('User data fetched from AuthService:', user);

    if (user) {
      this.userData.name = user.name;
      this.userData.email = user.email;
    } else {
      console.log('No user data found.');
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onCvSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type === 'application/pdf') {
      this.cvFile = file;
      this.cvFileName = file.name;
    } else {
      this.cvFile = null;
      this.cvFileName = null;
      alert('Please upload a valid PDF file.');
    }
  }

  goToNextStep() {
    this.currentStep = 2;
  }

  addSkill(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value && !this.skills.includes(value)) {
      this.skills.push(value);
    }
    input.value = '';
    event.preventDefault();
  }

  removeSkill(index: number) {
    this.skills.splice(index, 1);
  }

  submitForm() {
    const formData = new FormData();

    // Add personal info
    formData.append('name', this.userData.name);
    formData.append('email', this.userData.email);
    formData.append('phone', this.phone);
    formData.append('location', this.location);
    formData.append('gender', this.gender);
    formData.append('dob', this.dob);

    // Add professional info
    formData.append('qualification', this.qualification);
    formData.append('experience', this.experience?.toString() || '');
    formData.append('skills', JSON.stringify(this.skills));

    // Add files
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }
    if (this.cvFile) {
      formData.append('cv', this.cvFile);
    }
    console.log('submitForm() triggered');
    // Submit to API
    this.authService.updateProfile(formData).subscribe({
      next: (res) => {
        this.setMessage('Profile updated successfully!','success');
        console.log('Update response:', res);
        setTimeout(() => {
    this.router.navigate(['/home']); // 👈 Change '/home' to your actual route
  }, 1000); 
      },
      error: (err) => {
        alert('Failed to update profile.');
        console.error('Update error:', err);
      }
    });
  }
  setMessage(msg: string, type: 'success' | 'error' | 'warning') {
    this.message = msg;
    this.messageType = type;

    // Auto-hide after 4 seconds
    setTimeout(() => this.message = '', 4000);
  }

  clearMessage() {
    this.message = '';
  }
}
