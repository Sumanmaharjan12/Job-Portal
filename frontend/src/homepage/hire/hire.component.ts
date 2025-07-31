import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hire',
  templateUrl: './hire.component.html',
  styleUrls: ['./hire.component.scss']
})
export class HireComponent {
applications: any[] = [];
toastMessage = '';
toastClass = '';

constructor(private http:HttpClient){}

ngOnInit():void{
  this.loadApplications();
}
loadApplications():void{
   const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('/api/applications/getApplications', { headers }).subscribe({
      next: (data) => {
        this.applications = data;
      },
      error: (err) => {
        console.error('Failed to load applications', err);
        this.showToast('Failed to load applications', 'error');
      }
    });
  }
  updateStatus(applicationId:string, newStatus:string):void{
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.put(`/api/applications/update-status/${applicationId}`, { status: newStatus }, { headers })
      .subscribe({
         next: (res) => {
      console.log('Status updated successfully:', res);
      this.showToast('Status updated!', 'success'); 
    },
    error: (err) => {
      console.error('Failed to update status', err);
      this.showToast('Failed to update status', 'error'); 
    }
      })

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

