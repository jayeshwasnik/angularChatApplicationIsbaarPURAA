
import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { Cookie } from 'ng2-cookies/ng2-cookies';

import { CookieService } from 'ngx-cookie-service';

//for toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email;
  public password;

  constructor(private _route: ActivatedRoute, private router: Router, public appService: AppService,private toastr:ToastrService,private cookieService:CookieService) { }

  ngOnInit() {
  }

public goToSignUp(){
this.router.navigate(['signup']);

}

public signinFunction(){
let data={email:this.email,
          password:this.password}

this.appService.userLogin(data).subscribe(apiResponse=>{
  if (apiResponse.status===200) 
  {this.toastr.success("Login Succesful");
   this.router.navigate(['chat']);
  }

console.log(apiResponse);
//for setting cookies
this.cookieService.set('authToken',apiResponse.data.authToken);
this.cookieService.set('receiverId', apiResponse.data.userDetails.userId);
this.cookieService.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
//setting the data in local storage
this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);
},




error=>{this.toastr.error("there was an error")});


}

}