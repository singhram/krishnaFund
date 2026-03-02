import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GroupInterface } from '@app/models/group.model';
import { AppUrlConstant } from '@app/modules/core/constants/app.url.constant';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})

export class GroupService {
  private readonly http = inject(HttpClient);
  // Matches your NestJS @Controller('groups')
  private readonly groupBaseUrl: string = `${AppUrlConstant.BASEURL}groups/`; 

  // GET: Fetch all groups
  getGroups(): Observable<GroupInterface[]> {
    return this.http.get<GroupInterface[]>(this.groupBaseUrl);
  }

  // GET: Fetch one group with its userDetails (The wrapper interface we made)
  getGroupById(id: string)  {
    return this.http.get(`${this.groupBaseUrl}${id}`);
  }

  // POST: Create a new group with nested users
  createGroup(groupData: any): Observable<any> {
    return this.http.post(this.groupBaseUrl, groupData);
  }

  // PATCH: Update specific fields of a group
  updateGroup(id: string, updates: any): Observable<any> {
    // return this.http.patch(`${this.groupBaseUrl}${id}`, updates);
    return this.http.post(`${this.groupBaseUrl}${id}`, updates);

  }

  // DELETE: Remove a group
  deleteGroup(id: string): Observable<any> {
    return this.http.delete(`${this.groupBaseUrl}${id}`);
  }
}

