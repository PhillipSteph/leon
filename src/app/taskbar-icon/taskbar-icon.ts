import {Component, Input, OnInit} from '@angular/core';
import {NgStyle} from '@angular/common';
import {folderManager} from '../folder_manager';
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

  openApplication() {
    if(this.isOpen) return;
    this.isOpen = true;
    folderManager.openAppEvent.emit(this.app)
  }


  closeApplication() {
    this.isOpen = false;
  }

  ngOnInit(): void {
    folderManager.closeAppEvent.subscribe(removedApp => {
      if(removedApp === this.app.name){
        this.closeApplication()
      }
    })
  }
}
