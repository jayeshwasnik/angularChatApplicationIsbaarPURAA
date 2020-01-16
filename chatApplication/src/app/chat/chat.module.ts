import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from '../chat/chatbox/chatbox.component';
import {RouterModule,Routes} from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RemoveSpecialCharPipe } from '../shared/pipe/remove-special-char.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserDetailsComponent } from '../shared/user-details/user-details.component';
import { FirstCharComponent } from '../shared/first-char/first-char.component';


@NgModule({
  imports: [BrowserAnimationsModule,
    CommonModule,RouterModule.forChild([ 
      { path: 'chat', component: ChatBoxComponent }
    ]),SharedModule
  ],
  declarations: [ChatBoxComponent,RemoveSpecialCharPipe]
})
export class ChatModule { }