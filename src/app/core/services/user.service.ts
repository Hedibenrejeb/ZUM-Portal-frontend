import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { User } from '../models/auth.models';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
    public host = environment.apiUrl;

    public getListProjectByUser(userId): Observable<any> {
        return this.http.get(`${this.host}/project/GetProjectByUser/` + userId);
    }

    getallusers(): Observable<any> {
        return this.http.get(`${this.host}/auth/list-user/`);
    }
    getUserById(userId): Observable<any> {
        return this.http.get(`${this.host}/auth/GetUserById/` + userId);
    }
    register(user: any): Observable<any> {
        return this.http.post(`${this.host}/auth/register-user/`, user);
    }
    constructor(private http: HttpClient) { }

    public register1(user: User): Observable<HttpResponse<User>> {
        return this.http.post<User>(`${this.host}/auth/register-user/`, user, { observe: 'response' });
    }
    register2(user: any): Observable<any> {
        return this.http.post(`${this.host}/auth/register-user/`, user);
    }

    update(user: any): Observable<any> {
        return this.http.put(`${this.host}/auth/updateUser/`+ user.id, user);
    }

}
