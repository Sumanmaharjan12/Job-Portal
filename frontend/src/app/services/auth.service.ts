import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  // Keep your current flag but add BehaviorSubjects for reactivity
  private isLoggedIn = !!localStorage.getItem('isLoggedIn');
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn);
  private userRoleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient) {}

  signup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  setLoginStatus(status: boolean) {
    this.isLoggedIn = status;
    if (status) {
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem('isLoggedIn');
    }
    this.isLoggedInSubject.next(status);
  }

  getLoginStatus(): boolean {
    return this.isLoggedIn;
  }

  setUserRole(role: string) {
    localStorage.setItem('role', role);
    this.userRoleSubject.next(role);
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next(null);
    this.isLoggedIn = false;
  }
}
