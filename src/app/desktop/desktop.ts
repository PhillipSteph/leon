import {Component, OnInit} from '@angular/core';
import {DraggableWindowComponent} from '../draggable-window/draggable-window';
import {Folder} from '../folder/folder';
import {folderManager} from '../folder_manager';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-desktop',
  imports: [
    DraggableWindowComponent,
    Folder,
    NgForOf
  ],
  standalone: true,
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss'
})
export class Desktop implements OnInit {
  windows: any[] = [];

  ngOnInit(): void {
    folderManager.openImageEvent.subscribe(windowData => {
      this.windows.push(windowData);
    });

    folderManager.closeWindowEvent.subscribe((uuid: string) => {
      this.windows = this.windows.filter(w => w.uuid !== uuid);
    });
  }
}
