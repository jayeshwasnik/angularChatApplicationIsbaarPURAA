


import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';

import {SocketService} from './../../socket.service';

import {AppService} from './../../app.service';

import { ActivatedRoute, Router } from '@angular/router';
//import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CookieService} from 'ngx-cookie-service';

import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],
  providers:[SocketService]
})
export class ChatBoxComponent implements OnInit {

  @ViewChild('scrollMe', { read: ElementRef,static:false}) 
  
  public scrollMeRe: ElementRef;



  public authToken:any;
  public userInfo:any;
  public recieverId:any;
  public recieverName:any;
  public userList:any[];
  public disconnectedSocket:boolean;
  public messageText: any;
  public messageList: any=[];
  public scrollToChatTop: boolean;
  public pageValue:number=0;
  public loadingPreviousChat: boolean = false;
  constructor(public Appservice:AppService,public cookieService:CookieService,public socketService:SocketService,public router:Router,private toastr:ToastrService ) {
    this.recieverId=this.cookieService.get('recieverId');
    this.recieverName=this.cookieService.get('recieverName');
    
   }

  ngOnInit() {
    this.authToken=this.cookieService.get('authToken');
    this.userInfo=this.Appservice.getUserInfoInLocalStorage;
    this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.getMessagefromAUser();
    if(this.recieverId!=null && this.recieverId!=undefined && this.recieverId!=''){
      this.userSelectedToChat(this.recieverId,this.recieverName)
    }
  }


public checkStatus:any=()=>{
  if(this.cookieService.get('authToken')===undefined || this.cookieService.get('authToken')==='' || this.cookieService.get('authToken')===null){
    this.router.navigate(['/']);
    return false;
  }else{
return true;
  }
}

public verifyUserConfirmation:any =()=>{
  //throw new Error('jayesh');
this.socketService.verifyUser().subscribe((data)=>{
  this.disconnectedSocket=false;
  this.socketService.setUser(this.authToken);
  this.getOnlineUserList();
});
}

public getOnlineUserList =()=>{
  this.socketService.onlineUserList().subscribe((userList)=>{
this.userList=[];
for(let x in userList){
  let temp={'userId':x,'name':userList[x],'unread':0,'chatting':false};
this.userList.push(temp);
}

console.log(this.userList);
  });
}

//when we pass event as a parameter it will listen keypress and trigger when it's enter button(13)
public sendMessageUsingKeyPress = (event)=>{
  if(event.keyCode()===13){
    this.sendMessage();
  }
}


public sendMessage =()=>{
  if(this.messageText){
    let messageObject={
      senderName: this.userInfo.firstName+" "+this.userInfo.lastName,
      senderId: this.userInfo.senderId,
      receiverName:this.cookieService.get('reciverName') ,
      receiverId: this.cookieService.get('receiverId'),
      message: this.messageText,
      createdOn: new Date()
    }
    this.socketService.sendChatMessage(messageObject);
    this.pushToChatWindow(messageObject);
  }
  else{
    alert("text message cannot be empty");
  }
}

public pushToChatWindow=(data)=>{
  this.messageText="";
  this.messageList.push(data);
  this.scrollToChatTop=false;

}



public getMessagefromAUser:any =() =>{
this.socketService.chatByUserId(this.userInfo.userId).subscribe((data)=>{
  (this.recieverId==data.senderId?this.messageList.push(data):"");
  this.toastr.success(`${data.senderName} says ${data.message}`);
  this.scrollToChatTop=false;
});//end subscribe

}


public getPreviousChatWithAUser :any = ()=>{
  let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);
  
  this.socketService.getChat(this.userInfo.userId, this.recieverId, this.pageValue * 10)
  .subscribe((apiResponse) => {

    console.log(apiResponse);

    if (apiResponse.status == 200) {

      this.messageList = apiResponse.data.concat(previousData);

    } else {

      this.messageList = previousData;
      this.toastr.warning('No Messages available')

     

    }

    this.loadingPreviousChat = false;

  }, (err) => {

    this.toastr.error('some error occured')


  });

}// end get previous chat with any user


public userSelectedToChat: any = (id, name) => {

  console.log("setting user as active") 

  // setting that user to chatting true   
  this.userList.map((user)=>{
      if(user.userId==id){
        user.chatting=true;
      }
      else{
        user.chatting = false;
      }
  })

  Cookie.set('receiverId', id);

  Cookie.set('receiverName', name);


  this.recieverName = name;

  this.recieverId = id;

  this.messageList = [];

  this.pageValue = 0;

  let chatDetails = {
    userId: this.userInfo.userId,
    senderId: id
  }


  this.socketService.markChatAsSeen(chatDetails);

  this.getPreviousChatWithAUser();

} // end userBtnClick function

public loadEarlierPageOfChat: any = () => {

  this.loadingPreviousChat = true;

  this.pageValue++;
  this.scrollToChatTop = true;

  this.getPreviousChatWithAUser() 

} // end loadPreviousChat


public logout: any = () => {

  this.Appservice.logout()
    .subscribe((apiResponse) => {

      if (apiResponse.status === 200) {
        console.log("logout called")
        Cookie.delete('authtoken');

        Cookie.delete('receiverId');

        Cookie.delete('receiverName');

        this.socketService.exitSocket()

        this.router.navigate(['/']);

      } else {
        this.toastr.error(apiResponse.message)

      } // end condition

    }, (err) => {
      this.toastr.error('some error occured')


    });

} // end logout

public showUserName =(name:string)=>{

  this.toastr.success("You are chatting with "+name)

}




}








    






