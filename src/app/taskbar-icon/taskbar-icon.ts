import {Component, Input} from '@angular/core';
import {NgStyle} from '@angular/common';
import {folderManager} from '../folder_manager';
import {Browser} from '../applications/browser/browser';

@Component({
  selector: 'app-taskbar-icon',
  imports: [
    NgStyle
  ],
  templateUrl: './taskbar-icon.html',
  styleUrl: './taskbar-icon.scss'
})
export class TaskbarIcon {
  @Input() picture: string = "";
  @Input() letter?: string;
  @Input() application: any;

  isOpen = false;

  openApplication() {
    this.isOpen = true;
    folderManager.openAppEvent.emit(new Browser())
  }

  closeApplication() {
    this.isOpen = false;
  }
}
