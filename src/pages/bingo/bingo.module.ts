import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BingoPage } from './bingo';

@NgModule({
  declarations: [
    BingoPage,
  ],
  imports: [
    IonicPageModule.forChild(BingoPage),
  ],
})
export class BingoPageModule {}
