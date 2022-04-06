import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {

    form: { form: any } = {
        form: {
            username: {},
            subject: {'value' : '','label': 'נושא הפניה'},
            email: {'label': 'האימייל המעודכן שלי	',value:''},
            submit: 'שלח',
            text: {'label': 'הערות', value:''}
        }
    };

    email_err: any;
    user_id: any;
    text_err: any;
    subject_err: any;
    allfields = '';
    defaultText: any;
    public logged_in = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiProvider,
        public toastCtrl: ToastController
    ) {
        this.api.storage.get('user_data').then((val) => {
            if (val) {
                this.logged_in = true;
                this.user_id = val.user_id;
            }
        });

        this.defaultText = this.navParams.get('texts');
        if ( this.defaultText) {
          this.form.form.subject.value = this.defaultText.subject;
          this.form.form.text.value = this.defaultText.message;
        }
    }

    formSubmit() {

        console.log('this.form.form.email.value: '+this.form.form.email.value);
        console.log('this.logged_in: '+this.logged_in);
        console.log('this.form.form.text.value: '+this.form.form.text.value);
        console.log('this.form.form.subject.value: '+this.form.form.subject.value);

        if ((this.form.form.email.value == '' && this.logged_in == false) || this.form.form.text.value == '' || this.form.form.subject.value == '') {
            this.allfields = 'יש למלא את כל השדות';
        } else {
            this.allfields = '';

            var params = {
              subject: this.form.form.subject.value,
                userId: this.user_id ? this.user_id : 'Unknown',
                messageToAdmin: this.form.form.text.value,
                userEmail : this.form.form.email.value,
                logged_in: this.logged_in
            };

            this.api.http.post(this.api.url + '/contactUs', params, this.api.header).subscribe(data => {
                let res: any = data;
                this.validate(res);
            });
        }

    }

    back() {
        this.navCtrl.pop();
    }

    validate(response) {

        //alert(JSON.stringify(response));
        if (response.result == true) {

            this.form.form.email.value = "";
            this.form.form.text.value = "";
            this.form.form.subject.value = "";

            // const toast = this.toastCtrl.create({
            //     message: 'ההודעה נשלחה בהצלחה',
            //     showCloseButton: true,
            //     closeButtonText: 'אישור'
            // });
            // toast.present();
            let alert = this.api.alertCtrl.create({
              //title: 'הודעה פנימי',
              message: 'ההודעה נשלחה בהצלחה',
              buttons: ['אישור']
            });
            alert.present();
        }else{
            this.allfields = 'יש למלא את כל השדות';
        }
    }

    ionViewWillEnter() {
        this.api.pageName = 'ContactUsPage';
    }

}
