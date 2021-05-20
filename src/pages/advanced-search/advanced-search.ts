import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {HomePage} from "../home/home";
import {SelectPage} from "../select/select";

/**
 * Generated class for the AdvancedSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-advanced-search',
  templateUrl: 'advanced-search.html',
})
export class AdvancedSearchPage {

    @ViewChild(Content) content: Content;

    form: any;

    searchParams: any = {};
    //ageLower: any = 20;
    //ageUpper: any = 50;

    //ages: any[] = [];

    //height: any[] = [];

    //default_range: any = {lower: this.ageLower, upper: this.ageUpper};
    errors: any = {userId: ''};

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiProvider
    ) {
        this.api.storage.get('search_params').then((val) => {
            if(val){
                this.searchParams = val;
            }
        });
        this.api.http.get(api.url + '/user/advanced/search', api.setHeaders(true)).subscribe(data => {
            let res: any = data;
            if(Object.keys(this.searchParams).length == 0){
                for(let i = 0; i < res.form.length; i++){
                    //console.log(i);
                    let field: any = res.form[i];
                    if(field) {
                        //console.log(i);

                        //console.log(field);
                        if (field.type == 'range') {
                             this.searchParams[field.nameFrom] = field.valueFrom;
                             this.searchParams[field.nameTo] = field.valueTo;
                         } else {
                             this.searchParams[field.name] = field.value;
                         }
                    }
                }
            }else{
                for(let i = 0; i < res.form.length; i++){
                    let field: any = res.form[i];
                    if(field) {
                        if (field.type == 'range') {
                            res.form[i].valueFrom = res.form[i].valLabelFrom = this.searchParams[field.nameFrom];
                            res.form[i].valueTo = res.form[i].valLabelTo = this.searchParams[field.nameTo];
                        }
                        if (field.type == 'select'){
                            //res.form[i].value = this.searchParams[field.name];
                            var label = '';
                            for(let e = 0; e < field.choices.length; e++){
                                var choice = field.choices[e];
                                if(choice.value == this.searchParams[field.name]){
                                    label = choice.label;
                                }
                            }
                            res.form[i].valLabel = label;
                        }
                    }
                }
            }
            console.log(JSON.stringify(res.form));
            this.form = res.form;
            //this.form.heightFrom.value = '';
            //this.form.heightTo.value = '';

            //for (let i = 100; i <= 250; i++) {
            //    this.height.push(i);
            //}

            //for (let i = 18; i <= 80; i++) {
            //    this.ages.push(i);
            //}
        }, err => {
            console.log("Oops!");
        });
    }

    clearForm(){
        for(let i = 0; i < this.form.length; i++){
            //console.log(i);
            let field: any = this.form[i];
            if(field) {
                //console.log(i);

                //console.log(field);
                if (field.type == 'range') {
                    this.searchParams[field.nameFrom] = '';
                    this.searchParams[field.nameTo] = '';
                    this.form[i].valLabelTo = '';
                    this.form[i].valLabelFrom = '';
                } else if(field.type == 'checkbox') {
                    this.searchParams[field.name] = false;
                } else if(field.type == 'multiselect'){
                    this.searchParams[field.name] = [];
                } else if(field.type != 'hidden' && field.name !='page' && field.name != 'count' && field.name != 'submit'){
                    this.searchParams[field.name] = '';
                    if(field.type == 'select'){
                        this.form[i].valLabel = '';
                    }
                }
            }
        }
    }

    toSearchResultsPage() {
        console.log(this.searchParams);
        if(this.validate()) {
            this.api.storage.set('search_params', this.searchParams);
            let params = //JSON.stringify(
                {
                    action: 'search',
                    list: '',
                    filter: 'lastActivity',
                    page: 1,
                    usersCount: this.searchParams.count,
                    advanced_search: this.searchParams
                }
            //);
            this.navCtrl.push(HomePage, {advParams: params});
        }
    }

    validate(){
        var res = true;
        if(this.searchParams.userId != parseInt(this.searchParams.userId) && this.searchParams.userId != ''){
            console.log(parseInt(this.searchParams.userId));
            this.searchParams.userId = isNaN(parseInt(this.searchParams.userId)) ? '' : parseInt(this.searchParams.userId);
            this.errors.userId = 'אנא הזן מספרים בלבד';
            res = false;
            this.content.scrollToTop(300);
        }
        return res;
    }

    openSelect(field:any = false, index, add:any = '') {

        //console.log(index);
        let profileModal = this.api.modalCtrl.create(SelectPage, {data: field});
        profileModal.present();

        profileModal.onDidDismiss(data => {
            if (data) {
                //console.log(JSON.stringify(data));
                //console.log(JSON.stringify(field));
                field["value" + add] = data.value;
                field["valLabel" + add] = data.label;

                this.form[index] = field;
                this.searchParams[field['name' + add]] = data.value;
            }
        });
    }

    ionViewWillEnter() {
        this.api.pageName = 'AdvancedSearchPage';
    }


}
