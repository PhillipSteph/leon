import { Component } from '@angular/core';
import {TaskbarIcon} from '../taskbar-icon/taskbar-icon';
import {Browser} from '../applications/browser/browser';
import {Application} from '../applications/window/window';

@Component({
  selector: 'app-taskbar',
  imports: [
    TaskbarIcon
  ],
  templateUrl: './taskbar.html',
  styleUrl: './taskbar.scss'
})
export class Taskbar {
  // list all Apps here to use them in html
  browserApp: Application = new Browser();
}
