import { HttpClient } from '@angular/common/http';
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
   showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastClass = type === 'success' ? 'toast-success' : 'toast-error';

    setTimeout(() => {
      this.toastMessage = '';
      this.toastClass = '';
    }, 3000);
  }
}
