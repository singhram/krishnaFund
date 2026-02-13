import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUrlConstant } from '../modules/core/constants/app.url.constant';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly userbaseUrl =  AppUrlConstant.USER_BASE_URL; // Matches your NestJS @Controller('users')

  // GET: Fetch all users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.userbaseUrl);
  }

  // GET: Fetch one user by ID
  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.userbaseUrl}/${userId}`);
  }

  // POST: Create a new user
  createUser(userData: any): Observable<any> {
    return this.http.post<any>(this.userbaseUrl, userData);
  }

  // PATCH: Update specific fields of a user
  patchUser(userId: string, updates: any): Observable<any> {
    return this.http.patch<any>(`${this.userbaseUrl}/${userId}`, updates);
  }

  // DELETE: Remove a user
  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.userbaseUrl}/${userId}`);
  }
  getGroupsbyUserID(userId:string){
    return this.http.get<any>(`${this.userbaseUrl}/${userId}/groups`);

  }
}
