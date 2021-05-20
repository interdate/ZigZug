import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Content, AlertController, TextInput } from 'ionic-angular';
import {Media} from "@ionic-native/media";
import {File} from "@ionic-native/file";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {Device} from "@ionic-native/device";
import {ApiProvider} from "../../providers/api/api";
import {ProfilePage} from "../profile/profile";

import * as $ from 'jquery';
import {SubscriptionPage} from "../subscription/subscription";
/**
 * Generated class for the DialogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dialog',
  templateUrl: 'dialog.html',
})
export class DialogPage {

    @ViewChild(Content) content: Content;
    @ViewChild('dialog_msg') messageInput: TextInput;

    user: any;
    users: any;
    texts: any = {a_conversation_with: '', title: '', photo: ''};
    message: any;
    messages: any;
    checkChat: any;
    notReadMessage: any = [];
    mediaobject: any = false;
    check: boolean = false;
    filephat: string;
    filename: string;
    username: any = false;
    password: any = false;
    currentMsgPlay: any;
    isPlay: boolean = false;
    submitBtn: any = true;
    alert: '';
    micStatus: any = true;
    reciver_id: any;
    adminMessagesCount: any;
    userHasFreePoints: any;
    contactCurrentReadMessagesNumber: any = 0;
    countNewMess: any = 0;
    currentTime: any;
    audioDuration: any;
    recordLength:any = 0;
    recordLengthTimeout: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public media: Media,
        public file: File,
        public alertCtrl: AlertController,
        public device: Device,
        public fileTransfer: FileTransfer,
        public api: ApiProvider
    ) {
        this.user = navParams.get('user');

        this.getPage();


        this.api.storage.get('user_data').then((val) => {
            this.username = val.username;
            this.password = val.password;
        });



        // this.api.keyboard.onKeyboardShow().subscribe(data => {
        //
        //     this.messageInput.setFocus();
        //     this.scrollToBottom();
        // });
    }

    countCharacters(ev) {
        this.submitBtn = true;
        // if (ev.target.value.length > 0) {
        //     this.submitBtn = true;
        // } else {
        //     this.submitBtn = false;
        // }
    }

    onFocus() {
        this.content.resize();
        this.scrollToBottom();
        //alert(this.message);
    }

    subscription() {
      this.navCtrl.push(SubscriptionPage);
    }

    turnMic() {
        this.micStatus === true ? this.micStatus = false : this.micStatus = true;
    }

    getPage() {

        var userId = typeof this.user.userId != "undefined" ? this.user.userId : this.user.id;

        this.reciver_id = userId;


        this.api.http.get(this.api.url + '/user/chat/' + userId, this.api.setHeaders(true)).subscribe(data => {
            let res:any = data;
            this.user = res.user;
            /*this.texts = data.json().texts;*/
            this.adminMessagesCount = res.adminMessagesCount;
            this.messages = res.chat.items;
            console.log(this.adminMessagesCount);
            this.countNewMess = res.chat.newMess;
            this.alert = res.blacklist != '' ? res.blacklist : '';
            this.contactCurrentReadMessagesNumber = res.contactCurrentReadMessagesNumber;

            this.scrollToBottom();
        }, err => {
            console.log("Oops!");
        });
    }

    deleteMsg(message) {
        this.api.http.post(this.api.url + '/user/message/del/' + message.id + '/' + message.from, {}, this.api.setHeaders(true)).subscribe(data => {
            this.getPage();
        });
    }

    scrollToBottom() {
        let that = this;
        setTimeout(function () {
            that.content.scrollToBottom(300);
        }, 400);
        //this.content.scrollTo(0, 999999, 300);
    }

    useFreePointToReadMessage(message) {
        let index = this.api.functiontofindIndexByKeyValue(this.messages, 'id', message.id);
        this.api.http.get(this.api.url + '/user/chat/useFreePointToReadMessage/' + message.id, this.api.setHeaders(true)).subscribe(data => {
            let res:any = data;
            if(res.messageText != '') {
              this.messages[index].text = res.messageText;
              this.setMessagesAsRead([message.id]);
            }
            if (!res.userHasFreePoints) {
                // Update page
                this.getPage();
            }
        });
    }

    setMessagesAsRead(unreadMessages) {
        let params = JSON.stringify({
            unreadMessages: unreadMessages
        });

        this.api.http.post(this.api.url + '/user/messenger/setMessagesAsRead', params, this.api.setHeaders(true)).subscribe(data => {
        });
    }

    sendPush() {
        let userId = (typeof this.user.userId != "undefined") ? this.user.userId : this.user.id;
        this.api.http.post(this.api.url + '/user/push/' + userId, {}, this.api.setHeaders(true)).subscribe(data => {
        });
    }

    sendMessage(url: string = "") {

        this.submitBtn = true;

        let userId = typeof this.user.userId != "undefined" ? this.user.userId : this.user.id;

        // if (url != "") {
        //     if (this.alert != "") {
        //         let toast = this.toastCtrl.create({
        //             message: this.alert,
        //             duration: 5000
        //         });
        //         toast.present();
        //     }
        //
        //     let options:FileUploadOptions = {
        //         fileKey: "file",
        //         fileName: 'test.mp3',
        //         chunkedMode: false,
        //         mimeType: "audio/mp3",
        //         headers: {Authorization: "Basic " + btoa(encodeURIComponent(this.username) + ":" + encodeURIComponent(this.password))}/*@*/
        //     };
        //
        //     const filetransfer:FileTransferObject = this.fileTransfer.create();
        //
        //     filetransfer.upload(url, this.api.url + '/user/message/audio/' + this.user.userId, options).then((voicemessage) => {
        //         console.log('Voice Message TEST : ' + JSON.stringify(voicemessage));
        //     }, (error) => {
        //         // handle error
        //         console.log('error: ' + JSON.stringify(error));
        //     });
        //
        // } else {
            if(this.message && this.message.trim().length > 0) {
                let params = JSON.stringify({
                    message: this.message
                });

                this.messages.push({
                    id: 0,
                    date: '',
                    from: userId,
                    isRead: 0,
                    text: this.message,
                    time: '',
                    to: this.user.id
                });
                this.scrollToBottom();
                this.message = '';


                this.api.http.post(this.api.url + '/user/chat/' + userId, params, this.api.setHeaders(true)).subscribe(data => {
                    let res: any = data;
                    this.messages = res.chat.items;
                    this.alert = res.message;
                    if(this.alert != ""){
                        let toast = this.toastCtrl.create({
                            message: this.alert,
                            duration: 5000
                        });
                        toast.present();
                    }

                    if(this.alert == "") {
                        this.sendPush();
                    }
                    this.countNewMess = res.chat.newMess;
                });
            }
        //}
    }

  sendVoiceMessage(){}
    /*
    sendVoiceMessage() {
        this.turnMic();

        if (!this.check) {
            this.check = true;
            if (this.device.platform == "iOS") {
                this.filephat = this.file.tempDirectory.replace(/file:\/\//g, '');
                this.filename =  'recordmg' + Math.random() + '.m4a';//3gp
                // alert.present();
            } else if (this.device.platform == "Android") {
                this.filephat = "file:///storage/emulated/0/";

                this.filename = 'recordmg' + Math.random() + '.mp3';//3gp
            }

            // let audioObject: MediaObject;
            this.file.createFile(this.file.tempDirectory, this.filename, true).then(() => {
                this.mediaobject = this.media.create(this.filephat + this.filename);
                this.mediaobject.startRecord();

                let that = this;
                this.recordLength = 0;

                this.recordLengthTimeout = setTimeout(function () {
                    that.recordLength = 1;
                }, 1000);

                this.audioDuration = window.setTimeout(() => {
                        that.mediaobject.stopRecord();
                        console.log('File3 Path: '+ that.filephat + that.filename);
                        if (this.recordLength > 0) {
                            var d = new Date();
                            var time = d.getHours() + ':' + d.getMinutes();
                            var date = d.getDate() + '/' + this.addZero(d.getMonth() + 1) + '/' + d.getFullYear();
                            //alert(date);
                            let mess = {
                                id: d.getSeconds(),
                                date: date,
                                from: 'idu4336bg',
                                isRead: 0,
                                text: '',
                                time: time,
                                to: that.user.userId,
                                voiceUrl: this.filephat + that.filename
                            };
                            this.messages.push(mess);
                            this.mediaobject.stopRecord();
                            this.mediaobject.release();
                            this.check = false;


                            setTimeout(function () {
                                console.log('File4 Path: '+ that.filephat + that.filename);
                                that.sendMessage(that.filephat + that.filename);
                                that.scrollToBottom();
                            }, 10);
                        }
                        clearTimeout(that.recordLengthTimeout);
                    }
                    , 30000);
            });

        } else {
            clearTimeout(this.audioDuration);
            this.mediaobject.stopRecord();
            this.mediaobject.release();
            this.check = false;
            if (this.recordLength > 0) {
                var d = new Date();
                var time = d.getHours() + ':' + d.getMinutes();
                var date = this.addZero(d.getDate()) + '/' + this.addZero(d.getMonth() + 1) + '/' + d.getFullYear();

                let mess = {
                    id: d.getSeconds(),
                    date: date,
                    from: 'idu4336bg',
                    isRead: 0,
                    text: '',
                    time: time,
                    to: this.user.userId,
                    voiceUrl: this.filephat + this.filename
                };
                this.messages.push(mess);

                let that = this;

                setTimeout(function () {
                    that.sendMessage(that.filephat + that.filename);
                    that.content.scrollToBottom(300);
                    //}
                }, 1000);
            }
            clearTimeout(this.recordLengthTimeout);
        }
    }

    addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }


    playrecord(msg) {

        if (this.mediaobject) {
            clearInterval(this.currentTime);
            this.isPlay = false;
            this.mediaobject.stop();
            $(".runner").css({'left': 0});
        }
        this.currentMsgPlay = msg.id;
        this.mediaobject = this.media.create(msg.voiceUrl);
        this.mediaobject.play();
        this.isPlay = true;

        var currentPosition = 0.25;

        let that = this;

        this.currentTime = setInterval(function () {
            var dur = that.mediaobject.getDuration();

            if (dur > 0) {
                dur = Math.floor(dur);
                if (dur == currentPosition) {
                    //$(".msg-" + msg.id + " .runner").css({'left': 95 + '%'});
                    //setTimeout(function () {
                    $(".msg-" + msg.id + " .runner").css({'left': 0});
                    clearInterval(that.currentTime);
                    that.isPlay = false;
                    this.mediaobject.release();
                    //}, 500);
                } else {
                    $(".msg-" + msg.id + " .runner").css({'left': (90 / dur * (currentPosition)) + '%'});
                    currentPosition += 0.25;
                    //alert(currentPosition);
                }
            }
        }, 250);

    }

    pauserecord() {
        this.mediaobject.pause();
        this.mediaobject.release();
        //this.isPlay = false;
    }
*/
    getNewMessages() {

        this.api.http.get(this.api.url + '/user/chat/' + this.reciver_id + '/' + this.contactCurrentReadMessagesNumber + '/' + this.countNewMess + '/refresh', this.api.setHeaders(true)).subscribe(data => {
            let res:any = data;
            this.contactCurrentReadMessagesNumber = res.contactCurrentReadMessagesNumber;
            if (res.chat) {
                this.messages = res.chat.items;
                this.countNewMess = res.chat.newMess;
                this.api.hideLoad();

                if (res.chat.abilityReadingMessages == 1) {
                    this.countNewMess = 0;
                    var arrMsg = [];
                    for (var _i = 0; _i < this.messages.length; _i++) {
                        if (this.messages[_i].isRead == 0 && this.messages[_i].from == this.reciver_id) {
                            arrMsg.push(this.messages[_i].id);
                        }
                    }

                    this.setMessagesAsRead(arrMsg);
                }
                this.userHasFreePoints = res.chat.userHasFreePoints;

                if (res.isNewMess) {
                    this.scrollToBottom();
                }

            }
        }, err => {
            // alert(JSON.stringify(err));
        });
    }

    sandReadMessage() {
        var params = JSON.stringify({
            message: 'ok-1990234'
        });

        this.api.http.post(this.api.url + '/sends/' + this.user.id + '/messages', params, this.api.setHeaders(true)).subscribe(data => {
        });
    }

    readMessagesStatus() {
        if (this.notReadMessage.length > 0) {

        }
    }

    ionViewWillLeave() {
        if(this.mediaobject){
            this.mediaobject.stop();
            this.mediaobject.release();
        }

        this.api.footer = true;
        $('.back-btn').hide();
        // enable the root left menu when leaving the tutorial page
        clearInterval(this.checkChat);
        $('.banner').removeAttr('style');
    }

    adminMessagesPage() {
        // this.navCtrl.push(AdminMessagesPage, {
        //     user: this.user
        // });
    }

    toProfilePage() {

        this.user.id = this.user.userId;

        this.navCtrl.push(ProfilePage, {
            user: this.user
        });

    }

    ionViewWillEnter() {
        this.api.footer = false;
        this.api.pageName = 'DialogPage';
        $('.back-btn').show();
        $('.footerMenu').hide();
        $('.banner').hide();
    }

    toVideoChat() {
      var userId = typeof this.user.userId != "undefined" ? this.user.userId : this.user.id;
      this.api.openVideoChat({id: userId, chatId: 0, alert: false, username: this.user.username});
    }

    ionViewDidLoad() {

        var that = this;
        if(typeof this.check != 'undefined'){
            clearInterval(this.checkChat);
        }
        this.checkChat = setInterval(function () {
            that.getNewMessages();
        }, 9000);

        // $('button').click(function () {
        //     // clean textareaa after submit
        //     $('textarea').val('');
        // });

    }
}
