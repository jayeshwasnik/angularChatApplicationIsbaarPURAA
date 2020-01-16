import { Injectable } from '@angular/core';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

//to use http params
import{HttpHeaders,HttpParams} from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; 
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public baseUrl="https://chatapi.edwisor.com/api/v1";
  
  public apiKey='YzY4YmU3MjkzNjFjMmQ1MzY3ZGQ1YzI3ZTM3NzcxOTBlNjUwZjgxOTg0YWFkYjUzZTgwODQ1MWYxZjkwZjg2YmE1YWZjY2MzZTc2MmEzY2NlM2VjYjE3YjFjNWIzMWYwMmEzOTFkMThiZDNjY2IyZTkwNjAwM2NmMjFmOWRhOGNjMA==';

  constructor(public http:HttpClient) { }

  public userSignup(data):Observable<any>{
    const params=new HttpParams()
    .set("firstName",data.firstName)
      .set("password",data.password)
        .set("lastName",data.lastName)
          .set("email",data.email)
            .set("mobileNumber	",data.mobileNumber	)
              .set("apiKey",this.apiKey);
              return this.http.post(`${this.baseUrl}/users/signup`,params);
    

  }


    
  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))

    return this.http.post(`${this.baseUrl}/users/logout`, params);

  } // end logout function



  public setUserInfoInLocalStorage(data){
    localStorage.setItem("userInfo",JSON.stringify(data));
  }

  public getUserInfoInLocalStorage(){
    return JSON.parse(localStorage.getItem("userInfo"));
  }
  public userLogin(data): Observable<any>{
    const params=new HttpParams()
      .set("password",data.password)
          .set("email",data.email);
   return this.http.post(`${this.baseUrl}/users/login`,params);

  }

}
