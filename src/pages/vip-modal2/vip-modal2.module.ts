import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipModal2Page } from './vip-modal2';
import {UserProfileComponent} from "../../components/user-profile/user-profile";

@NgModule({
  declarations: [
    VipModal2Page
  ],
  imports: [
    IonicPageModule.forChild(VipModal2Page),
  ],
})
export class VipModal2PageModule {}
