import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { getFirebaseBackend } from '../../authUtils';

import { User } from '../models/auth.models';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    public host=environment.apiUrl;
    private token: string;
    private loggedInUsername: string;
    private jwtHelper =new JwtHelperService();
  
    user: User;

    constructor(private http:HttpClient) {
    }


    
  public login1(user: User):Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.host}/auth/login/`,user ,{observe: 'response' });
  }



  public addUser(formData: FormData):Observable<User>{
    return this.http.post<User>(`${this.host}/auth/register`,formData);
  }

public listUser():Observable<User[]>{
  return this.http.get<User[]>(`${this.host}/auth/listuser/`);
}
public addUsersToLocalCache(users:User[]):void{
  localStorage.setItem('users',JSON.stringify(users));
  }

  public getUsersFromLocalCache():User[]{
    return  JSON.parse( localStorage.getItem('users')); }



 /*  public register(user: User):Observable<User> {
    return this.http.post<User>
    (`${this.host}/user/register`,user);
  } */
 
  public logout():void{
this.token = null;
this.loggedInUsername=null;
console.log("logout")
localStorage.removeItem('user');
localStorage.removeItem('token');
localStorage.removeItem('users');
localStorage.removeItem('projects');
/*localStorage.removeItem('sprints');
localStorage.removeItem('tasks');
localStorage.removeItem('msgs');
localStorage.removeItem('liste Msg'); */



}
 

public saveToken(token:string):void{
  this.token=token;
  console.log(this.token)

  localStorage.setItem('token',token);
  
  }
   
  public addUserToLocalCache(user:User):void{
    localStorage.setItem('user',JSON.stringify(user));
    }
 
    public getUserFromLocalCache():User{
      return  JSON.parse( localStorage.getItem('user')); }

//loadfrom localstorage
    public loadToken():void{
        this.token=localStorage.getItem('token'); }


     public getToken():string{
          return this.token; }

     public isLoggedIn():boolean{
       this.loadToken(); 
      // console.log("|||||isloggedin||||||")
     //  console.log(this.jwtHelper.decodeToken(this.token)['firstname'])
     
       if (this.token != null && this.token !==''){
         //.sub (subject) return  nom user 
             if(this.jwtHelper.decodeToken(this.token)['firstname'] != null || ''){
               if ( !this.jwtHelper.isTokenExpired(this.token)['exp']){
                  this.loggedInUsername= this.jwtHelper.decodeToken(this.token)['firstname'];
                  return true;
                }}
       }else{

         this.logout();

         return false;}
       }


     
      
        public currentUserlogged():string{
          this.loadToken();
          if (this.token != null && this.token !==''){
            //.sub (subject) return  nom user 
                if(this.jwtHelper.decodeToken(this.token)['firstname'] != null || ''){
                  if ( !this.jwtHelper.isTokenExpired(this.token)['exp']){
                     this.loggedInUsername= this.jwtHelper.decodeToken(this.token)['firstname'];
                     return(this.loggedInUsername)
                   }} }}
          


    







//************************************************ */




    /**
     * Returns the current user
     */
    public currentUser(): User {
        return getFirebaseBackend().getAuthenticatedUser();
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(email: string, password: string) {
        return getFirebaseBackend().loginUser(email, password).then((response: any) => {
            const user = response;
            return user;
        });
    }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(email: string, password: string) {
        return getFirebaseBackend().registerUser(email, password).then((response: any) => {
            const user = response;
            return user;
        });
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend().forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

    /**
     * Logout the user
     */
   /*  logout() {
        // logout the user
        getFirebaseBackend().logout();
    } */
}

