import {Component, Input} from '@angular/core';
import {NgStyle} from '@angular/common';

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

}
