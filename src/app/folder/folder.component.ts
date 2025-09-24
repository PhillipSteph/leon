import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {EventManager} from '../filesystem/event_manager';
import {FileSystemManager} from '../filesystem/filesystem_manager';

@Component({
  selector: 'app-folder',
  standalone: true,
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements AfterViewInit, OnInit {

  @ViewChild('window', { static: false }) window!: ElementRef;
  @Input() x: number = 100;
  @Input() y: number = 100;
  @Input() name: string = "folder";
  @Input() filled: boolean = false;
  @Input() id: number = -1;

  ngOnInit(): void {
    EventManager.folderDroppedEvent.subscribe(({folderId }) => {
      if(folderId === this.id){
        this.filled = true;
      }
    });
  }
  ngAfterViewInit(): void {
    if (this.window) {
      this.window.nativeElement.style.left = `${this.x}px`;
      this.window.nativeElement.style.top = `${this.y}px`;
      this.window.nativeElement.style.zIndex = `${this.id}`
    }
  }
  openFolder() {
    if(this.filled){
        let x = this.x + 70;
        let y = this.y + 70;
        let zCounter: number = this.id;

        let folder = FileSystemManager.findFolderById(this.id);
        if(folder){
          folder.images.forEach((image) => {
            const windowData = {
              image: image,
              x: (x += 20),
              y: (y += 20),
              z: zCounter++,
              minimized: true
            };
            EventManager.openImageEvent.emit(windowData);
          });
          folder.images = [];
        }
    }
    this.filled = false;
  }
}
