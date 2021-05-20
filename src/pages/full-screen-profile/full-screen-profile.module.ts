import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FullScreenProfilePage } from './full-screen-profile';

@NgModule({
  declarations: [
    FullScreenProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(FullScreenProfilePage),
  ],
})
export class FullScreenProfilePageModule {}
