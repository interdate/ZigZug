import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {
  AlertController, LoadingController, ModalController, Platform, ToastController, Events
} from "ionic-angular";

import { DomSanitizer } from "@angular/platform-browser";
import { Geolocation } from '@ionic-native/geolocation';
//import * as $ from 'jquery';
import {FingerprintAIO} from "@ionic-native/fingerprint-aio";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import * as $ from "jquery";
import {a} from "@angular/core/src/render3";
//import {KeyboardOriginal} from "@ionic-native/keyboard";

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class ApiProvider {
    public viewName: any;
    public url: any;
    public siteUrl: any;
    public header: any = {};
    public response: any;
    public username: any;
    public password: any;
    public myId: null;
    public isVip: boolean;

    public textMess: any;
    public status: any = '';
    public userIsPaying: any;
    public errorMess: any = '';
    public back: any = false;
    public storageRes: any;
    public footer: any = true;
    public pageName: any = false;
    public loading: any;
    public testingMode: any = false;
    public enableFingerAuth: any;
    public fingerAuth: any = false;
    public setEnableFingerAuth: any = true;
    public notActivateAlert: any = false;
    public faioData: any;
    public browserToken: any;
    public appVersion: any = 13;
    public callAlertShow:any = false;
    public videoChat: any = null;
    public videoTimer: any = null;
    public callAlert: any;
    public audioCall: any;
    public audioWait: any;
    public videoShow: any = true;
    //public isAndroid: any = false;
    public transferStart: any = false;
    public notCheckStatus: any = false;
    public filter: any = '';

    constructor(
        public storage: Storage,
        public http: HttpClient,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        private sanitizer: DomSanitizer,
        public toastCtrl: ToastController,
        private geolocation: Geolocation,
        public plt: Platform,
        public modalCtrl: ModalController,
        public fingerAIO: FingerprintAIO,
        public iab: InAppBrowser,
        public events: Events
    ) {
        //this.url = 'http://localhost:8103';
        //this.url = 'http://10.0.0.7:8100';
        //this.url = 'https://m.zigzug.co.il/api/v2';
        //this.url = 'https://newzigzug1.wee.co.il/api/v2';
        //this.siteUrl = 'https://newzigzug2.wee.co.il';
        // this.siteUrl = 'https://www.zigzug.co.il';
        this.siteUrl = 'http://localhost:8123/app_dev.php';
        this.url = this.siteUrl + '/api/v2';
        // alert(43)
        //this.testingMode = true;
      // export JAVA_HOME=`/usr/libexec/java_home -v 1.8.0_221`
    }

  openVideoChat(param){
    this.storage.get('user_data').then((data) => {
      if(this.callAlert && this.callAlert != null) {
        this.callAlert.dismiss();
        this.callAlert = null;
      }
      this.playAudio('call');

      this.http.post(this.url + '/user/call/' + param.id,{message: 'call', id: param.chatId}, this.setHeaders(true)).subscribe((res:any) => {
        this.stopAudio();
        console.log('init');
        console.log(res);
        if(res.error != '') {
          // let toast = this.toastCtrl.create({
          //   message: res.error,
          //   showCloseButton: true,
          //   closeButtonText: 'אישור'
          // });
          // toast.present();
          let alert:any;
          if(res.error.indexOf("לרכישה מנוי לחצו כאן") == '-1') {
            alert = this.alertCtrl.create({
              //title: 'הודעה פנימי',
              message: res.error,
              buttons: ['אישור']
            });
          }else{
            alert = this.alertCtrl.create({
              //title: 'הודעה פנימי',
              message: res.error,
              buttons: [
                {
                  text: 'אישור',
                  role: 'cancel',
                  handler: () => {
                    this.events.publish('page:payment');
                  }
                },
                {
                  text: 'לרכישה מנוי',
                  handler: () => {
                    this.events.publish('page:payment');
                  }
                }
              ]
            });

          }

          alert.present();
        } else {
          // /user/call/push/
          if(res.call.sendPush) {
            this.http.post(this.url + '/user/call/push/' + param.id, {}, this.setHeaders(true)).subscribe((data: any) => {

            });
          }
          param.chatId = res.call.msgId;
          $('#close-btn,#video-iframe').remove();
          const closeButton = document.createElement('button');
          let that = this;
          closeButton.setAttribute('id', 'close-btn');
          closeButton.style.backgroundColor = 'transparent';
          closeButton.style.margin = '0 10px';
          closeButton.style.width = '40px';
          closeButton.style.height = '40px';
          closeButton.style['font-size'] = '0px';
          closeButton.style['text-align'] = 'center';
          closeButton.style.background = 'url(https://www.zigzug.co.il/assets/img/video/buzi_b.png) no-repeat center';
          closeButton.style['background-size'] = '100%';
          closeButton.style.position = 'absolute';
          closeButton.style.bottom = '10px';
          closeButton.style.left = 'calc(50% - 25px)';
          closeButton.style.zIndex = '9999';
          closeButton.onclick = (e) => {
            console.log('close window');
            $('#close-btn,#video-iframe').remove();
            that.http.post(this.url + '/user/call/' + param.id,{message: 'close', id: param.chatId}, this.setHeaders(true)).subscribe((data:any) => {
              // let res = data.json();
            });
            that.videoChat = null;
          };

          this.videoChat = document.createElement('iframe');
          this.videoChat.setAttribute('id', 'video-iframe');
          this.videoChat.setAttribute('src', 'https://www.zigzug.co.il/video.html?id='+data.user_id+'&to='+param.id);
          this.videoChat.setAttribute('allow','camera; microphone');
          this.videoChat.style.position = 'absolute';
          this.videoChat.style.top = '0';
          this.videoChat.style.left = '0';
          this.videoChat.style.boxSizing = 'border-box';
          this.videoChat.style.width = '100vw';
          this.videoChat.style.height = '101vh';
          this.videoChat.style.backgroundColor = 'transparent';
          this.videoChat.style.zIndex = '999';
          this.videoChat.style['text-align'] = 'center';

          document.body.appendChild(this.videoChat);
          document.body.appendChild(closeButton);

          if(param.alert == false) {
            this.checkVideoStatus(param);
          }
        }
      }, error => {
        this.stopAudio();
      });


    });
  }

  playAudio(audio) {
    if(this.callAlertShow == false) {
      this.showLoad();
    }
    if(audio == 'call') {
      this.audioCall.play();
      this.audioCall.loop = true;
    } else {
      this.audioWait.play();
      this.audioWait.loop = true;
    }
  }

  stopAudio() {
    this.audioCall.pause();
    this.audioCall.currentTime = 0;
    this.audioWait.pause();
    this.audioWait.currentTime = 0;
    this.hideLoad();
  }

  checkVideoStatus(param){
    console.log('check call');
    console.log(param);
    this.http.get(this.url + '/user/call/status/' + param.chatId, this.setHeaders(true)).subscribe((res: any) => {
      // let res = data.json();
      console.log('check');
      console.log(res);
      this.status = res.status;
      if (res.status == 'answer') {
      }
      if (res.status == 'close' || res.status == 'not_answer') {


        this.stopAudio();
        if (this.videoChat != null || this.callAlert != null) {
          // let toast = this.toastCtrl.create({
          //   message: (this.status == 'not_answer' && this.videoChat && this.videoChat != null) ? ('השיחה עם ' + param.username + ' נדחתה') : 'השיחה הסתיימה',
          //   showCloseButton: true,
          //   closeButtonText: 'אישור'
          // });
          // toast.present();
          let alert = this.alertCtrl.create({
            //title: 'הודעה פנימי',
            message: (this.status == 'not_answer' && this.videoChat && this.videoChat != null) ? ('השיחה עם ' + param.username + ' נדחתה') : 'השיחה הסתיימה',
            buttons: ['אישור']
          });
          alert.present();
        }
        if(this.callAlert && this.callAlert != null) {
          this.callAlert.dismiss();
          this.callAlert = null;
        }
        if(this.videoChat && this.videoChat != null) {
          $('#close-btn,#video-iframe').remove();
          this.videoChat = null;
        }
      }

      if (this.videoChat != null || this.callAlert != null) {
        let that = this;
        setTimeout(function () {
          that.checkVideoStatus(param)
        }, 3000);
      }
    });

  }

    fAllInOne(data: any = {}){

            this.fingerAIO.isAvailable().then((result: any) => {

                this.enableFingerAuth = 1;
                //alert(this.setEnableFingerAuth);
                //alert(JSON.stringify(this.faioData));
                if(this.faioData){
                    if(typeof this.faioData.username != 'undefined' && typeof data.username != 'undefined') {
                        //alert(1);
                        //change data after relogin
                        if (this.faioData.username != data.username && typeof data.username != 'undefined' && this.fingerAuth) {
                            this.storage.set('fingerAIO', {
                                //isAvailable: 1,
                                setEnableFingerAuth: this.faioData.setEnableFingerAuth,
                                username: data.username,
                                password: data.password
                            });
                        }
                    }else if(this.setEnableFingerAuth && typeof data.username == 'undefined'){
                        //alert(2);
                        //authorization by fingerprint
                        this.fingerAIO.show({
                            clientId: 'zigzug-faio',
                            clientSecret: this.faioData.password, //Only necessary for Android
                            disableBackup: true  //Only for Android(optional)
                        }).then((result: any) => {
                            data.navCtrl.setRoot(data.page,{
                                'login':{
                                    username: this.faioData.username,
                                    password: this.faioData.password
                                }
                            });
                            data.navCtrl.popToRoot();
                            //this.fingerAuth = true;
                        })
                        .catch((error: any) => {
                            //this.fingerAuth = false;
                        });

                    }
                }else if(typeof data.username != 'undefined'){
                    //set data
                    if(typeof data.register != 'undefined'){
                        let alert = this.alertCtrl.create({
                            title: 'כניסה לזיגזוג באמצעות טביעת אצבע',
                            message: 'לכניסה מהירה לזיגזוג יש להכניס טביעת אצבע לחצו לאישור',
                            buttons: [
                                {
                                    text: 'ביטול',
                                    role: 'cancel',
                                    handler: () => {
                                        //console.log('Cancel clicked');
                                    }
                                },
                                {
                                    text: 'אישור',
                                    handler: () => {
                                        this.fingerAIO.show({
                                            clientId: 'zigzug-faio',
                                            clientSecret: data.password, //Only necessary for Android
                                            disableBackup: true  //Only for Android(optional)
                                        }).then((result: any) => {
                                            //alert(JSON.stringify(result));
                                            this.faioData = {
                                                //isAvailable: 1,
                                                setEnableFingerAuth: 1,
                                                username: data.username,
                                                password: data.password
                                            };
                                            this.storage.set('fingerAIO', this.faioData);
                                            this.fingerAuth = true;
                                        }).catch((error: any) => {
                                            //alert('ERROR: ' + JSON.stringify(error));
                                            this.fingerAuth = false;
                                            this.faioData = false;
                                            this.storage.remove('fingerAIO');
                                        });
                                    }
                                }
                            ]
                        });
                        alert.present();
                    }else {
                        this.fingerAIO.show({
                            clientId: 'zigzug-faio',
                            clientSecret: data.password, //Only necessary for Android
                            disableBackup: true  //Only for Android(optional)
                        }).then((result: any) => {
                            //alert(JSON.stringify(result));
                            this.faioData = {
                                //isAvailable: 1,
                                setEnableFingerAuth: 1,
                                username: data.username,
                                password: data.password
                            };
                            this.storage.set('fingerAIO', this.faioData);
                            this.fingerAuth = true;
                        }).catch((error: any) => {
                            //alert('ERROR: ' + JSON.stringify(error));
                            this.fingerAuth = false;
                            this.faioData = false;
                            this.storage.remove('fingerAIO');
                        });
                    }
                }

            }).catch((error: any) => {
                //alert('Error: ' + JSON.stringify(error));
                this.enableFingerAuth = 0;
                this.fingerAuth = false;
                this.faioData = false;
                this.storage.remove('fingerAIO');
            });
        // });
    }

    logout(){
      this.setHeaders(false, null, null);
      // Removing data storage
      this.storage.remove('user_data');
      this.storage.remove('faio');
      this.myId = null;
      this.notActivateAlert = false;
      this.status = '';
      this.userIsPaying = null;
      this.textMess = false;
    }

    safeHtml(html) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    sendPhoneId(idPhone) {
        let data = JSON.stringify({deviceId: idPhone});
        let os = (this.plt.is('IOS')) ? 'iOS' : 'Android';
        //alert(os);
        if(this.password) {
          this.http.post(this.url + '/user/deviceId/OS:' + os, data, this.setHeaders(true)).subscribe(data => {
            //alert(JSON.stringify(data));
          });
        }
    }

    sendBrowserPhoneId(){

        this.storage.get('fcmToken').then((token) => {
            if(token) {
                let data = JSON.stringify({deviceId: token});
                let os = 'Browser';
                //alert(os);
                this.http.post(this.url + '/user/deviceId/OS:' + os, data, this.setHeaders(true)).subscribe(data => {
                    //alert(JSON.stringify(data));
                });
            }
        });
    }

    setLocation() {

        this.geolocation.getCurrentPosition().then((pos) => {
            let params = JSON.stringify({
                latitude: pos.coords.latitude.toString(),
                longitude: pos.coords.longitude.toString()
            });

            this.http.post(this.url + '/user/location', params, this.setHeaders(true)).subscribe(data => {
            });
        });
    }

    showLoad(txt = 'אנא המתן...') {
        if (this.isLoaderUndefined()) {
              this.loading = this.loadingCtrl.create({
                  content: txt
              });

              this.loading.present();
        }
    }

    functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
        for (var i = 0; i < arraytosearch.length; i++) {
            if (arraytosearch[i][key] == valuetosearch) {
                return i;
            }
        }
        return null;
    }

    hideLoad() {
        if (!this.isLoaderUndefined())
            this.loading.dismiss();
        this.loading = undefined;
    }

    isLoaderUndefined(): boolean {
        return (this.loading == null || this.loading == undefined);
    }

    getUserData() {
        this.storage.get('user_id').then((val) => {
            this.storage.get('username').then((username) => {
                //this.username = username;
            });
            // this.storage.get('password').then((password) => {
            //     this.password = password;
            // });
        });
        return {username: this.username, password: this.password}
    }

    setHeaders(is_auth = false, username = false, password = false) {

        if (username != false) {
            this.username = username;
        }

        if (password != false) {
            this.password = password;
        }

        let myHeaders = new HttpHeaders();

        myHeaders = myHeaders.append('Content-type', 'application/json');
        myHeaders = myHeaders.append('Accept', '*/*');
        myHeaders = myHeaders.append('Access-Control-Allow-Origin', '*');
        if (this.username && (this.username.toLowerCase() == 'popo' || this.username.toLowerCase() == 'tiptip')) {
          myHeaders = myHeaders.append('testingMode', '1');
        }

        //myHeaders = myHeaders.append('Origin', 'http://localhost');

        if (is_auth == true) {
           //myHeaders = myHeaders.append("Authorization", "Basic " + btoa(encodeURIComponent(this.username) + ':' + encodeURIComponent(this.password)));
           /*@encodeURIComponent(this.username)*/
           myHeaders = myHeaders.append('ApiCode', btoa(encodeURIComponent(this.username) + '|357' + encodeURIComponent(this.password)));
        }
        this.header = {
            headers: myHeaders
        };
        return this.header;
    }

    transferData(){
      this.transferStart = true;
      let that = this;
      this.http.get(this.url + '/user/transfer/data', this.setHeaders(true)).subscribe((data:any) => {
        if(data.status == 'update'){
          setTimeout(function () {
            that.transferData();
          }, 1000);
        }
      });
    }
}
