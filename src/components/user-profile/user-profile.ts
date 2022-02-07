import {Component, Input} from '@angular/core';
import {ProfilePage} from "../../pages/profile/profile";
import {NavController} from "ionic-angular";
import {ApiProvider} from "../../providers/api/api";
import {DialogPage} from "../../pages/dialog/dialog";

/**
 * Generated class for the UserProfileComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'user-profile',
  templateUrl: 'user-profile.html'
})

/**
 *
 *
 * NOT IN USE. MAYBE LATER**/
export class UserProfileComponent {

  @Input('user') user: any;
  @Input('texts') texts: any;

  blocked_img: any = false;

  constructor(
    private navCtrl: NavController,
    public api: ApiProvider,
  ) {

    console.log('this.user', this.user)
  }

  itemTapped(user) {
    this.navCtrl.push(ProfilePage, {
      user: user
    });
  }

  toDialog(user) {
    if(user.id != this.api.myId) {
      var mess = '';
      if (user.isAllowedToSend == '1') {
        // mess = this.texts.chatErrorsMess[1];
      } else if(user.isAllowedToSend == '2') {
        // mess = this.texts.chatErrorsMess[2];
      }
      if (mess == '') {
        this.navCtrl.push(DialogPage, {
          user: user
        });
      } else {
        let alert = this.api.alertCtrl.create({
          message: mess,
          buttons: ['אישור']
        });
        alert.present();
      }
    }
  }

  addLike(user) {

    if (user.isLike == '0') {

      this.user.isLike = '1';

      let alert = this.api.alertCtrl.create({
        message: 'עשית לייק ל ' + user.nickName,
        buttons: ['אישור']
      });
      alert.present();

      let params = JSON.stringify({
        toUser: user.id,
      });

      //alert(JSON.stringify(user));

      this.api.http.post(this.api.url + '/user/like/' + user.id, params, this.api.setHeaders(true)).subscribe(data => {

      }, err => {
        console.log("Oops!");
      });
    }
  }
}
