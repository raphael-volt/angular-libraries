import { NgModule, ModuleWithProviders } from '@angular/core';
import { MatAvatarDialog } from './mat-avatar-dialog/mat-avatar-dialog';

import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from '@angular/common';
import { MatAvatarsService } from './mat-avatars.service';
import { MatTabsModule } from '@angular/material/tabs';

import { AvatarImgDirective } from './shared/avatar-img.directive';
import { MatAvatarSelectComponent } from './mat-avatar-select/mat-avatar-select.component';
import { MatAvatarListComponent } from './mat-avatar-list/mat-avatar-list.component';
import { MATAVATARS_CONFIG_TOKEN, DEFAULT_MATAVATARS_CONFIG, MatAvatarsConfig } from './shared/mat-avatar-config';
import { RefreshListDirective } from './shared/refresh-list.directive';
import { MatAvatarEncoderService } from './mat-avatar-encoder.service';
import { MatAvatarDirective } from './mat-avatar.directive';


@NgModule({
  declarations: [
    MatAvatarDialog,
    MatAvatarSelectComponent,
    MatAvatarListComponent,
    AvatarImgDirective,
    RefreshListDirective,
    MatAvatarDirective
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule
  ],
  exports: [MatAvatarDialog, MatAvatarSelectComponent, MatAvatarListComponent, MatAvatarDirective],
  providers: [MatAvatarsService, MatAvatarEncoderService]
})
export class MatAvatarsModule {
  static forRoot(config: MatAvatarsConfig = null): ModuleWithProviders<MatAvatarsModule> {
    return {
      ngModule: MatAvatarsModule,
      providers: [
        {
          provide: MATAVATARS_CONFIG_TOKEN,
          useValue: config || DEFAULT_MATAVATARS_CONFIG
        }
      ]
    }
  }
}