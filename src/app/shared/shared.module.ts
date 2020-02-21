import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { ShellComponent } from './shell/shell.component';



@NgModule({
  declarations: [ShellComponent],
  imports: [
    CommonModule,
    RouterModule,
    ScullyLibModule
  ],
  exports: [ShellComponent]
})
export class SharedModule { }
