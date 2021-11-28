import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreezePage } from './freeze';

@NgModule({
  declarations: [
    FreezePage,
  ],
  imports: [
    IonicPageModule.forChild(FreezePage),
  ],
})
export class FreezePageModule {}
