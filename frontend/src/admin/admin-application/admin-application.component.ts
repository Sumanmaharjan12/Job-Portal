import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-application',
  templateUrl: './admin-application.component.html',
  styleUrls: ['./admin-application.component.scss']
})
export class AdminApplicationComponent {
 applications: any[] = [];
  displayedApplications: any[] = [];
  categories: string[] = [];
  filters = {
    company: '',
    category: '',
    sortBy: ''
  };
  loading = false;
  message = '';
  messageType: 'success' | 'error' | 'warning' = 'success';

  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  // Load applications from backend with filters
  loadApplications(): void {
    this.loading = true;
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
      .set('company', this.filters.company)
      .set('category', this.filters.category)
      .set('sortBy', this.filters.sortBy)
      .set('page', this.currentPage.toString())
      .set('limit', this.itemsPerPage.toString());

    this.http.get<any>('api/adminapplication/getapplications', { headers, params }).subscribe({
      next: res => {
        this.applications = res?.data || [];

        // Extract unique categories dynamically (filter null/undefined)
        this.categories = Array.from(new Set(this.applications.map(a => a.JobCategory).filter(Boolean)));

        this.totalPages = Math.ceil(res.total / this.itemsPerPage);

        // Apply sorting after data load
        this.applySorting();

        this.updateDisplayedApplications();
        this.loading = false;
      },
      error: err => {
        this.setMessage('Failed to load applications', 'error');
        this.loading = false;
      }
    });
  }

  // Update displayed page
  updateDisplayedApplications(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedApplications = this.applications.slice(start, end);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadApplications();
  }

  // Apply filters
  applyFilters(): void {
    this.currentPage = 1;
    this.loadApplications();
  }

  // Apply sorting by company, category, or date
  applySorting(): void {
    if (!this.filters.sortBy) return;

    this.applications.sort((a, b) => {
      if (this.filters.sortBy === 'company') {
        return a.CompanyName.localeCompare(b.CompanyName);
      } else if (this.filters.sortBy === 'category') {
        return a.JobCategory.localeCompare(b.JobCategory);
      } else if (this.filters.sortBy === 'date') {
        return new Date(b.AppliedAt).getTime() - new Date(a.AppliedAt).getTime();
      }
      return 0;
    });
  }

  // Export CSV or Excel
  exportData(type: 'csv' | 'excel'): void {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
      .set('exportType', type)
      .set('company', this.filters.company)
      .set('category', this.filters.category)
      .set('sortBy', this.filters.sortBy);

    this.http.get(`api/adminapplication/getapplications`, { headers, params, responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = type === 'csv' ? 'applications.csv' : 'applications.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => this.setMessage('Failed to export data', 'error')
    });
  }

  // Toast message handler
  setMessage(msg: string, type: 'success' | 'error' | 'warning') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 4000);
  }

  clearMessage() {
    this.message = '';
  }
}
