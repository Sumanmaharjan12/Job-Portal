import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
 categories: any[] = [];
  displayedCategories: any[] = [];

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
}
