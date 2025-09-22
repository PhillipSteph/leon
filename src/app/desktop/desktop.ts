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
    this.windows = [
      {
        desc: 'Bild7 - Leon Stephan - 2021',
        picture: 'https://galeriemontblanc.com/cdn/shop/files/Vue_avion_013e0d87-25db-4d3b-85ed-4852004f944d.jpg?v=1731891831',
        x: 500,
        y: 150,
        z: 1,
        minimized: false
      },
      {
        desc: 'Bild2 - Leon Stephan - 2022',
        picture: 'https://arthive.com/res/media/img/oy1000/work/93b/623482@2x.jpg',
        x: 200,
        y: 200,
        z: 2,
        minimized: false
      },
      {
        desc: 'Bild1 - Leon Stephan - 2024',
        picture: 'https://www.kunstloft.at/magazin/wp-content/uploads/2023/05/AdobeStock_542915248-scaled-1-2000x889.jpeg',
        x: 800,
        y: 100,
        z: 3,
        minimized: true
      }
    ];

    folderManager.openImageEvent.subscribe(windowData => {
      this.windows.push(windowData);
    });

    folderManager.folderDroppedEvent.subscribe(({ picture, folderId }) => {
      console.log(`Window dropped on folder ${folderId} with image ${picture}`);
      // Remove the window with the same picture from the windows array
      this.windows = this.windows.filter(win => win.picture !== picture);
    });

  }
}
