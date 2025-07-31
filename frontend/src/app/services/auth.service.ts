import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";

export interface ProfileType {
  phone: string;
  location: string;
  gender: string;
  dob: string;
  qualification: string;
  experience: string;
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
  private isLoggedIn = !!sessionStorage.getItem('isLoggedIn');
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn);
  private userRoleSubject = new BehaviorSubject<string | null>(sessionStorage.getItem('role'));

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
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('user', JSON.stringify(response.user));
          sessionStorage.setItem('role', response.role);

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

  const token = sessionStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.post('http://localhost:5000/api/profile', data, { headers });
}
checkProfileExists() {
  const token = sessionStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`
  };

  return this.http.get<{ exists: boolean }>(
    `http://localhost:5000/api/profile/check`,  // <-- Use correct profile route base here
    { headers }
  );
}


  getProfileDetails(): Observable<ProfileType> {
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  return this.http.get<ProfileType>('http://localhost:5000/api/profile/details', { headers });
}



checkPhoneExists(phone: string) {
  const token = sessionStorage.getItem('token');
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
      sessionStorage.setItem('isLoggedIn', 'true');
    } else {
      sessionStorage.removeItem('isLoggedIn');
    }
    this.isLoggedInSubject.next(status);
  }

  getLoginStatus(): boolean {
    return this.isLoggedIn;
  }

  // --- User Role ---
  setUserRole(role: string) {
    sessionStorage.setItem('role', role);
    this.userRoleSubject.next(role);
  }

  getUserRole(): string | null {
    return sessionStorage.getItem('role');
  }

  // --- User Data ---
  setUserData(user: any) {
    this.userDataSubject.next(user);
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getUserData(): any {
    if (this.userDataSubject.value) {
      return this.userDataSubject.value;
    }
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private getUserFromStorage(): any | null {
    const user =  sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  

  // --- Logout ---
  logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next(null);
    this.userDataSubject.next(null);
    this.isLoggedIn = false;
  }
}
