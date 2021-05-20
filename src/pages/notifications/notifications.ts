import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {DialogPage} from "../dialog/dialog";
import {ArenaPage} from "../arena/arena";

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

    like: string = 'like';
    tabs: string = this.like;
    bingo: string = 'bingo';
    users: Array<{ id: string, date: string, username: string, is_read: string, photo: string, text: string, region_name: string, image: string, about: {}, component: any}>;
    texts: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
        this.getPage();
    }

    getPage() {
        this.api.http.get(this.api.url+'/user/likes/notifications',this.api.setHeaders(true)).subscribe(data => {
            let res:any = data;
            this.users = res.likesNotifications.items;
            //console.log('USERS: ' + JSON.stringify(this.users));
            this.texts = res.texts;
        },err => {
            console.log("Oops!");
        });
    }

    toDialog(user) {
        let user_id = user.userId;
        let bingo = user.bingo;
        this.api.http.post(this.api.url+'/user/notification/'+user.id+'/read',{},this.api.setHeaders(true)).subscribe(data => {
            let res:any = data;
            this.getPage();

            this.users = res.users;

            if( bingo == 1) {
                this.navCtrl.push(DialogPage, {
                    user: {'id': user_id, 'userId': user_id }
                });
            }else {
                this.navCtrl.push(ArenaPage, {
                    user: user_id
                });
            }
        },err => {
            console.log("Oops!");
        });
    }

    ionViewWillEnter() {
        this.api.pageName = 'NotificationsPage';
    }

}
