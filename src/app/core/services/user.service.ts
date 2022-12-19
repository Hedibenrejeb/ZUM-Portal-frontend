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
    public getUserById(userId): Observable<any> {
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

    UpdateProfile(user: any): Observable<any> {
        return this.http.put(`${this.host}/auth/UpdateProfile/`+ user.id, user);
    }

    update(user: any): Observable<any> {
        return this.http.put(`${this.host}/auth/updateafterregister/`+ user.id, user);
    }

    SavePhoto(file,userId): Observable<any> {
        let formData = new FormData();
        formData.append('file',file);
        formData.append('id',userId);
        console.log("*formData2222",formData)
        return this.http.post(`${this.host}/auth/SavePhoto/`+userId, formData);
      }


    updateProfileAvatar(photo,userId):Observable<any>{
        console.log("*userIdphoto",userId)
        const formData = new FormData();
        formData.append('photo', photo);
        formData.append('id',userId);
        return this.http.put(`${this.host}/auth/profileavatar/`+userId, formData)
      }
}
