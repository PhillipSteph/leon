import {Component, Input, OnInit} from '@angular/core';
import {NgStyle} from '@angular/common';
import {EventManager} from '../filesystem/event_manager';
import {Browser} from '../applications/browser/browser';
import {Application} from '../applications/window/window';

@Component({
  selector: 'app-taskbar-icon',
  imports: [
    NgStyle
  ],
  templateUrl: './taskbar-icon.html',
  styleUrl: './taskbar-icon.scss'
})
export class TaskbarIcon implements OnInit{

  @Input() picture: string = "";
  @Input() app!: Application;
  @Input() letter?: string;

  isOpen = false;
  firstTime = true;
  openApplication() {
    if(this.isOpen) return;
    this.isOpen = true;
    if(this.firstTime) {
      EventManager.openAppEvent.emit(this.app)
      this.firstTime = false;
    }
    else EventManager.reOpenAppEvent.emit(this.app)
  }


  closeApplication() {
    this.isOpen = false;
  }

  ngOnInit(): void {
    EventManager.closeAppEvent.subscribe(removedApp => {
      if(removedApp === this.app.name){
        this.closeApplication()
      }
    })
  }
}
