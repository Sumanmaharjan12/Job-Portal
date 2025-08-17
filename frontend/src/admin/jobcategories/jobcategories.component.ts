import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-jobcategories',
  templateUrl: './jobcategories.component.html',
  styleUrls: ['./jobcategories.component.scss']
})
export class JobcategoriesComponent {
  categories: any[] = [];
  displayedCategories: any[] = [];
  newCategory = {name: ''};
  message = '';
 messageType: 'success' | 'error' | 'warning' = 'success';

currentPage = 1;
itemsPerPage =8;
totalPages =1;
  constructor(private http: HttpClient){}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Load existing categories from backend
  loadCategories(): void {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('/api/jobcategory/getcategories', { headers }).subscribe({
      next: res => {
        this.categories = res || [],
      this.totalPages = Math.ceil(this.categories.length / this.itemsPerPage);
      this.updateDisplayedCategories();
      },
      error: err => this.setMessage('Failed to load categories', 'error')
    });
  }
    updateDisplayedCategories(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedCategories = this.categories.slice(start, end);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedCategories();
  }

  // Add a new category
  addCategory(): void {
    if (!this.newCategory.name) {
    alert("Category name is required!");
    return;
  }
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<any>('/api/jobcategory/addcategory', { name: this.newCategory.name }, { headers }).subscribe({
      next: (res) => {
        this.setMessage('Category added successfully', 'success');
         this.newCategory = { name: ''}; 
        this.loadCategories(); // Reload dropdown
      },
      error: err => this.setMessage(err.error?.message || 'Failed to add category', 'error')
    });
  }

   setMessage(msg: string, type: 'success' | 'error' | 'warning') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 4000);
  }

  clearMessage() {
    this.message = '';
  }
}
