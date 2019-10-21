import { Component } from "@angular/core";
import * as io from "socket.io-client";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  messageText: string;
  messages: Array<any> = [];
  socket: SocketIOClient.Socket;

  userName: string;
  userID: string;
  audioProcess: boolean = false;
  constructor() {
    this.socket = io.connect(); //trigger io.on("connection").. in the server
    this.userID = this.socket.id
  }
  ngOnInit() {
    this.messages = new Array();
    this.listen2Events();
  }
  listen2Events() {
    this.socket.on("msg", data => {
      this.messages.push(data);
      this.userID=this.socket.id;
    });

    this.socket.on("done", data =>{
      this.audioProcess = true;
    });
  
  }
  sendMessage() {
    this.socket.emit("newMsg",{userName: this.userName, message: this.messageText});
    this.messageText = "";
    this.audioProcess = false;
  }


  callMe(){
    let ap=document.getElementById('ap') as HTMLMediaElement;
//12.25
    //ap.src = this.userID+".mp3";
    ap.src = this.userID+".mp3?name="+ new Date().getTime();
    ap.load();
    ap.play();
  }

}