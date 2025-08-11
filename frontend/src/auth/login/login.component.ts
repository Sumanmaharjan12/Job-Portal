import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
Router

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   message = '';
  messageType: 'success' | 'error' | 'warning' = 'success';
  isSignup = false;
  role= '';
  formData = {
    name :'',
    email: '',
    password: '',
    role: ''
  };
  
  constructor (private authService: AuthService,  private router: Router,  private route: ActivatedRoute){}
     ngOnInit(): void {
    // Check if '?signup=true' is in the URL
    this.route.queryParams.subscribe(params => {
      if (params['signup'] === 'true') {
        this.isSignup = true;
      } 
      const roleFromQuery = params['role'];
    if (roleFromQuery === 'JobKeeper' || roleFromQuery === 'JobSeeker') {
      this.isSignup = true;      // Ensure signup form shows
      this.role = roleFromQuery; // Preselect role
    }
    });
    
  }
  
  togglePanel(){
    this.isSignup = !this.isSignup;
  }
  selectrole(role:string){
    this.role = role;
  }
  onSubmit(form:NgForm){
    if (!form.valid) {
    this.setMessage('Please fill in all required fields.','warning');
    return;
  }

    const payload ={
      name : this.isSignup ? this.formData.name: undefined,
      email : this.formData.email.toLowerCase(),
      password : this.formData.password,
      role: this.isSignup? this.role : undefined
    };
    if (this.isSignup){
      if (!payload.name) {
      this.setMessage('Please enter your name', 'warning');
      return;
    }
    if(!payload.role){
      this.setMessage('Please select a role.','warning');
      return;
    }
      this.authService.signup(payload).subscribe({
        next: (res)=>{
          this.setMessage('Signup Success','success');
          this.togglePanel();
          this.resetForm(form); 
        },
        error: (err) => {
          const backendMsg = err.error?.message || 'Signup failed';
          this.setMessage(backendMsg, 'warning');
          this.resetForm(form);
        }
      });
    }else{
      this.authService.login(payload).subscribe({
        next: res =>{
          // this.setMessage('Login successful.', 'success');
          this.authService.setLoginStatus(true);
           this.authService.setUserRole(res.user.role);
           this.authService.setUserData({
          name: res.user.name,
          email: res.user.email
          });  // save role here
         console.log('Role saved:', sessionStorage.getItem('role'));
        console.log('User data saved:', sessionStorage.getItem('user'));

        if(res.user.role ==='Admin' || res.user.role === 'SuperAdmin'){
          this.router.navigate(['/dashboard/admindashboard']);
        }else{
           this.router.navigate(['/profile']);
        }
       },
        error : (err) => this.setMessage('Please check your email or password',err)
      });
    }
  }
  resetForm(form: NgForm) {
    this.formData = {
      name: '',
      email: '',
      password: '',
      role: ''
    };
    this.role = '';
    form.resetForm();
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
