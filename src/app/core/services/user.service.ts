import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { User } from '../models/auth.models';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
    public host=environment.apiUrl;
  //  baseurl = " http://127.0.0.1:8000/";
    

    // getAll() {
    //     return this.http.get<User[]>(this.baseurl +`api/login`);
    // }
    



    getallusers():Observable<any> {
        return this.http.get(`${this.host}/auth/list-user/`);
    }
    register(user: any):Observable<any> {
        return this.http.post(`${this.host}/auth/register-user/`, user);
    }
    constructor(private http: HttpClient) { }
 
    public register1(user: User):Observable<HttpResponse<User>> {
        return this.http.post<User>(`${this.host}/auth/register-user/`,user ,{observe: 'response' });
      }
    

    register2(user: any):Observable<any> {
        return this.http.post(`${this.host}/auth/register-user/`, user);
    }

    update(user:any):Observable<any> {
        return this.http.put(`${this.host}/auth/updateafterregister/` + user.id , user);
    }


    // getAll() {
    //     return this.http.get<User[]>(`/api/login`);
    // }

    // register(user: User) {
    //     return this.http.post(`/users/register`, user);
    // }
}
