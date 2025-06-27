import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";

export interface ProfileType {
  phone: string;
  location: string;
  gender: string;
  dob: string;
  qualification: string;
  experience: number;
  skills: string[];
  imageUrl?: string;
  cvUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  // Login and role
  private isLoggedIn = !!localStorage.getItem('isLoggedIn');
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn);
  private userRoleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  // 🔽 New: User data
  private userDataSubject = new BehaviorSubject<any | null>(this.getUserFromStorage());
  userData$ = this.userDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  // --- API Calls ---
  signup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }
 login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        // Assuming your backend sends { token, user, role, ... }
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('role', response.role);

          this.isLoggedInSubject.next(true);
          this.userDataSubject.next(response.user);
          this.userRoleSubject.next(response.role);
          this.isLoggedIn = true;
        }
      })
    );
  }

updateProfile(data: FormData): Observable<any> {
  console.log('updateProfile called');

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.post('http://localhost:5000/api/profile', data, { headers });
}
checkProfileExists() {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`
  };

  return this.http.get<{ exists: boolean }>(
    `http://localhost:5000/api/profile/check`,  // <-- Use correct profile route base here
    { headers }
  );
}


  getProfileDetails(): Observable<ProfileType> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  return this.http.get<ProfileType>('http://localhost:5000/api/profile/details', { headers });
}



checkPhoneExists(phone: string) {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`
  };
  
  return this.http.get<{ exists: boolean }>(
    `/api/profile/check-phone?phone=${encodeURIComponent(phone)}`,
    { headers } 
  );
}


  // --- Login State ---
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

  // --- User Role ---
  setUserRole(role: string) {
    localStorage.setItem('role', role);
    this.userRoleSubject.next(role);
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  // --- User Data ---
  setUserData(user: any) {
    this.userDataSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserData(): any {
    if (this.userDataSubject.value) {
      return this.userDataSubject.value;
    }
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private getUserFromStorage(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  

  // --- Logout ---
  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next(null);
    this.userDataSubject.next(null);
    this.isLoggedIn = false;
  }
}
