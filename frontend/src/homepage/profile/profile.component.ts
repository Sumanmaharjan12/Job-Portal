import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
  experience: string = '';
  newSkill: string = '';
  phoneExists: boolean = false;
  companyName = '';
companyAddress = '';
companyWebsite = '';
establishedDate: string = '';
jobOpenings: number | null = null;
  // User name and email (readonly)
  userData = {
    name: '',
    email: ''
  };

    userRole: string = '';

  
  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}
  

  ngOnInit() {
  this.userRole = sessionStorage.getItem('role') || ''; // 'seeker' or 'hirer'
    const user = this.authService.getUserData();
   

    if (user) {
    this.userData.name = user.name;
    this.userData.email = user.email;

    // Check if profile exists
    this.authService.checkProfileExists().subscribe({
      next: (res: { exists: boolean }) => {
        if (res.exists) {
             this.router.navigate(['/home']); // ⬅️ Redirect to homepage
        }
      },
      error: (err) => {
        console.error('Profile check failed:', err);
      }
    });
  }
  }
  prefillProfileData() {
    this.authService.getProfileDetails().subscribe({
      next: (res) => {
        this.phone = res.phone || '';
        this.location = res.location || '';
        this.gender = res.gender || '';
        this.dob = res.dob || '';
        this.qualification = res.qualification || '';
        this.experience = res.experience || '';
        this.skills = res.skills || [];

        // Optionally handle image preview and CV file info here
      },
      error: (err) => {
        console.error('Failed to load profile details', err);
      }
    });
  }
  // 'seeker' or 'hirer'
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
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  const maxSize = 2 * 1024 * 1024; // 2 MB

  // Reset previous file
  this.cvFile = null;
  this.cvFileName = null;

  if (!file) return;

  // Check file type
  if (file.type.toLowerCase() !== 'application/pdf') {
    this.setMessage('Only PDF files are allowed.', 'error');
    input.value = '';
    return;
  }

  // Check file size
  if (file.size > maxSize) {
    this.setMessage('File size must be less than 2 MB.', 'error');
    input.value = '';
    return;
  }

  // Prepare FormData
  const formData = new FormData();
  formData.append('file', file);

  // Send to backend for CV validation
  this.http.post<{
    is_valid: boolean;
    confidence: number;
    keywords_found: string[];
    message: string;
  }>('http://127.0.0.1:5001/validate-cv', formData)
  .subscribe({
    next: (res) => {
      console.log('[DEBUG] CV validation response:', res);

      const keywordsFound = Array.isArray(res.keywords_found) ? res.keywords_found : [];
      const MIN_KEYWORDS = 3;

      // ✅ Accept if ML model says valid OR enough keywords are present
      const keywordAcceptance = keywordsFound.length >= MIN_KEYWORDS;
      const isValid = (res.is_valid === true) || keywordAcceptance;

      console.log(`[DEBUG] Keyword acceptance: ${keywordAcceptance}, Final isValid: ${isValid}`);

      if (isValid) {
        this.cvFile = file;
        this.cvFileName = file.name;

        this.setMessage(
          `CV accepted ✅ | Confidence: ${res.confidence} | Keywords found: ${keywordsFound.join(', ')}`,
          'success'
        );
      } else {
        this.setMessage(
          `CV rejected : ${res.message} | Keywords found: ${keywordsFound.join(', ')}`,
          'error'
        );
        input.value = ''; // reset file input
      }
    },
    error: (err) => {
      console.error('[ERROR] CV validation failed:', err);
      this.setMessage('Failed to validate CV. Please try again.', 'error');
      input.value = '';
    }
  });
}






  goToNextStep() {
  if (!this.isAgeValid()) {
    this.setMessage('You must be at least 18 years old.', 'error');
    return;
  }
  
  if (!this.phone) {
    this.setMessage('Phone number is required.', 'error');
    return;
  }
  
  // Check phone existence asynchronously
  this.authService.checkPhoneExists(this.phone).subscribe({
    next: (res) => {
      if (res.exists) {
        this.setMessage('Phone number already in use.', 'error');
        this.phoneExists = true;
      } else {
        this.phoneExists = false;
        this.clearMessage();
        this.currentStep = 2;  // Proceed only if phone not exists
      }
    },
    error: (err) => {
      console.error('Phone check error:', err);
      this.setMessage('Phone number is already registered.', 'error');
    }
  });
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
  
isAgeValid(): boolean {
  // Skip validation if role is JobKeeper
  if (this.userRole === 'JobKeeper') return true;

  if (!this.dob) return false;

  const [year, month, day] = this.dob.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
}


  submitForm() {
    const formData = new FormData();
    formData.append('role', this.userRole);
    formData.append('name', this.userData.name);
    formData.append('email', this.userData.email);
    formData.append('phone', this.phone);
    formData.append('location', this.location);
    formData.append('gender', this.gender);
    formData.append('dob', this.dob);

    if (this.userRole === 'JobSeeker') {
      formData.append('qualification', this.qualification);
      formData.append('experience', this.experience);
      formData.append('skills', JSON.stringify(this.skills));
      if (this.cvFile) formData.append('cv', this.cvFile);
    } else if (this.userRole === 'JobKeeper') {
      formData.append('companyName', this.companyName);
      formData.append('companyAddress', this.companyAddress);
      formData.append('companyWebsite', this.companyWebsite);
      formData.append('establishedDate', this.establishedDate);
      formData.append('jobOpenings', this.jobOpenings?.toString() || '');
    }

    if (this.imageFile) formData.append('image', this.imageFile);

    this.authService.updateProfile(formData).subscribe({
      next: (res) => {
        this.setMessage('Profile updated successfully!', 'success');
        setTimeout(() => this.router.navigate(['/home']), 1000);
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
