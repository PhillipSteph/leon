import { Component } from '@angular/core';
import {DraggableWindowComponent} from '../draggable-window/draggable-window';

@Component({
  selector: 'app-desktop',
  imports: [
    DraggableWindowComponent
  ],
  standalone: true,
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss'
})
export class Desktop {

}
