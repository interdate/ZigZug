import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangePhotosPage } from './change-photos';

@NgModule({
  declarations: [
    ChangePhotosPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangePhotosPage),
  ],
})
export class ChangePhotosPageModule {}
