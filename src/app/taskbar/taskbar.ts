import { Component } from '@angular/core';
import {TaskbarIcon} from '../taskbar-icon/taskbar-icon';

@Component({
  selector: 'app-taskbar',
  imports: [
    TaskbarIcon
  ],
  templateUrl: './taskbar.html',
  styleUrl: './taskbar.scss'
})
export class Taskbar {

}
