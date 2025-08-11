import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.scss']
})
export class AdmindashboardComponent {
 loading = true;
 toastMessage = '';
toastClass = '';
  errorMessage = '';
  selectedTab: 'jobs' | 'registered' | 'applied' = 'jobs';

  totalUsers = 0;
  totalJobs = 0;
  totalApplications = 0;
  pendingJobs = 0;

  recentJobs: any[] = [];
  recentUsers: any[] = [];
 recentApplications: any[] = [];

  admins: any[]=[];
  showAddAdminModal=false;

  // post admin
  newAdmin={
  name : '',
  email : '',
  password : '',
  };

  constructor(private http: HttpClient) {}


   addAdmin() {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<any>('/api/admin/add', this.newAdmin, { headers }).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Admin added successfully', 'success');
        this.loadAdmins();
        this.closeAddAdminModal();
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to add admin';
        this.showToast(msg, 'error');
      }
    });
  }
    loadAdmins() {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('/api/admin/list', { headers }).subscribe({
      next: (admins) => {
        this.admins = admins;
      },
      error: () => {
        this.showToast('Failed to load admins', 'error');
      }
    });
  }

  openAddAdminModal() {
    this.showAddAdminModal = true;
    this.newAdmin = { name: '', email: '', password: '' };
  }

  closeAddAdminModal() {
    this.showAddAdminModal = false;
  }

  ngOnInit(): void {
    this.fetchDashboardStats();
    this.loadAdmins();
  }
  selectTab(tab: 'jobs' | 'registered' | 'applied') {
  this.selectedTab = tab;
}

  fetchDashboardStats() {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('/api/admin/dashboard', { headers }).subscribe({
      next: (data) => {
        this.totalUsers = data.totalUsers;
        this.totalJobs = data.totalJobs;
        this.totalApplications = data.totalApplications;
        this.pendingJobs = data.pendingJobs;
        this.recentJobs = data.recentJobs;
        this.recentUsers = data.recentUsers;
         this.recentApplications = data.recentApplications;

        this.loading = false;
      },
      error: () => {
        this.showToast('Failed to load dashboard stats', 'error');
        this.loading = false;
      }
    });
  }

  getDaysAgo(dateString: string): string {
    if (!dateString) return '';

    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return '1 day ago';
    } else {
      return `${diffDays} days ago`;
    }
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

