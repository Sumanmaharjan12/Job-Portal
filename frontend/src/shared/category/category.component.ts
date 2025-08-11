import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  categories: any[] = [];
  iconMap: { [key: string]: string } = {
    'Digital Marketing': 'fa-bullhorn',
    'Graphic & Design': 'fa-paint-brush',
    'Programming & Tech': 'fa-laptop-code',
    'Writing & Translation': 'fa-pen-nib',
    'Business & Consulting': 'fa-briefcase',
    // Add more as needed
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>('/api/jobs/categories', { headers }).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }
  getIconClass(categoryName: string): string {
    
    return this.iconMap[categoryName] || 'fa-briefcase';
  }
}
