import {Component, OnInit} from '@angular/core';
import {DraggableWindowComponent} from '../draggable-window/draggable-window';
import {FolderComponent} from '../folder/folder.component';
import {EventManager} from '../filesystem/event_manager';
import {NgComponentOutlet, NgForOf} from '@angular/common';
import {Taskbar} from '../taskbar/taskbar';
import {Application, WindowComponent} from '../applications/window/window';
import {FileSystemManager} from '../filesystem/filesystem_manager';

@Component({
  selector: 'app-desktop',
  imports: [
    DraggableWindowComponent,
    FolderComponent,
    NgForOf,
    Taskbar,
    NgComponentOutlet
  ],
  standalone: true,
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss'
})
export class Desktop implements OnInit {
  windowsApps: Application[] = [];
    ngOnInit(): void {

      EventManager.openImageEvent.subscribe(data => {
        FileSystemManager.desktop.addImage({

          desc: data.image.desc,
          picture: data.image.picture,
          width: data.image.width,
          height: data.image.height,
          x: data.x,
          y: data.y,
          z: data.z,
          minimized: data.minimized
        });
      });
      EventManager.openAppEvent.subscribe(windowData => {
        this.windowsApps.push(windowData);
      });
      EventManager.folderDroppedEvent.subscribe(({ image, folderId }) => {
        console.log(`Window dropped on folder ${folderId} with image ${image.picture}`);
        // Remove the window with the same picture from the windows array
        FileSystemManager.desktop.images = FileSystemManager.desktop.images.filter(win => win.picture !== image.picture);
      });
    }
  protected readonly FileSystemManager = FileSystemManager;
}
