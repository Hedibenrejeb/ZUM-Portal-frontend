import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private authfackservice: AuthfakeauthenticationService) { }



    intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
        if(httpRequest.url.includes(`${this.authenticationService.host}/auth/login`)) {
          return httpHandler.handle(httpRequest);
        }
       /*  if(httpRequest.url.includes(`${this.authenticationService.host}/user/register`)) {
          return httpHandler.handle(httpRequest);
      }
     */
    
    this.authenticationService.loadToken(); //when the token is loaded we can access to this token  
    const token=this.authenticationService.getToken();
    //console.log(token);
    const request=httpRequest.clone({ setHeaders:{Authorization :`Bearer ${token}`}});
    return httpHandler.handle(request);
    }


   /*  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (environment.defaultauth === 'firebase') {
            const currentUser = this.authenticationService.currentUser();
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
            }
        } else {
            // add authorization header with jwt token if available
            const currentUser = this.authfackservice.currentUserValue;
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
            }
        }
        return next.handle(request);
    } */
}
