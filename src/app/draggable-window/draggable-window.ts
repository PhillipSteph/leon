import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, Input, OnInit } from '@angular/core';
import {NgOptimizedImage, NgStyle} from '@angular/common';
import {EventManager} from '../filesystem/event_manager';
import {FileSystemManager} from '../filesystem/filesystem_manager';

@Component({
  selector: 'app-draggable-window',
  templateUrl: 'draggable-window.html',
  standalone: true,
  imports: [
    NgStyle
  ],
  styleUrls: ['draggable-window.scss']
})
//TODO: Komplettes Refactoring: Images, Folders zentralisiert, keine Parameter rumgabe, sondern immer das Objekt!!
export class DraggableWindowComponent implements AfterViewInit, OnInit {
  @ViewChild('window', { static: false }) window!: ElementRef;

  @Input() picture: string = '';  // URL or path to the image for background
  @Input() width: number = 500;   // Default width
  @Input() height: number = 400;  // Default height
  @Input() x: number = 200;         // Initial x position
  @Input() y: number = 200;         // Initial y position
  @Input() z: number = 1;
  @Input() desc: string = "window";
  @Input() isMinimized = false;

  private tempWidth = 0;
  private tempHeight = 0;
  private tempLeft = 0;
  private tempTop = 0;

  private transitionTimeout: any;
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;
  private mouseMoveListener: () => void = () => {}; // Mouse move listener
  private mouseUpListener: () => void = () => {};   // Mouse up listener
  private isFullscreen: boolean = false;


  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    console.log(` Initial values: x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`);
  }

  ngAfterViewInit(): void {
    if (this.window) {
      // Apply the dynamic styles here
      this.window.nativeElement.style.width = `${this.width}px`;
      this.window.nativeElement.style.height = `${this.height}px`;
      this.window.nativeElement.style.left = `${this.x}px`;
      this.window.nativeElement.style.top = `${this.y}px`;
      this.window.nativeElement.style.zIndex = `${this.z}`
    }
    if(this.isMinimized){
      this.minimize();
    }
  }
  static mouseDownCounter = 11;

  // Called when mouse is pressed down
  onMouseDown(event: MouseEvent): void {
    if (this.window) {
      this.isDragging = true;
      this.offsetX = event.clientX - this.window.nativeElement.offsetLeft;
      this.offsetY = event.clientY - this.window.nativeElement.offsetTop;

      // Listen to mousemove and mouseup events
      this.mouseMoveListener = this.renderer.listen('document', 'mousemove', this.onMouseMove.bind(this));
      this.mouseUpListener = this.renderer.listen('document', 'mouseup', this.onMouseUp.bind(this));
      this.window.nativeElement.style.zIndex = DraggableWindowComponent.mouseDownCounter++;

    } else {
      console.error('Window reference is not available');
    }
  }
  // Called while dragging
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging && this.window && !this.isFullscreen) {

      const x = event.clientX - this.offsetX;
      const y = event.clientY - this.offsetY;
      this.window.nativeElement.style.left = `${x}px`;
      this.window.nativeElement.style.top = `${y}px`;

      if (this.mouseIsOnFolder(event) && this.isMinimized) {
        this.window.nativeElement.style.transition = '0.1s';
        // Shrink the window when over a folder
        this.window.nativeElement.style.width = `50px`;
        this.window.nativeElement.style.height = `40px`;

        const folderPos = this.getFolderPosition(event);

        const targetX = folderPos ? folderPos.x + 25 : event.clientX;
        const targetY = folderPos ? folderPos.y + 30 : event.clientY;

        this.window.nativeElement.style.left = `${targetX}px`;
        this.window.nativeElement.style.top = `${targetY}px`;

        const header = this.window.nativeElement.querySelector('.window-header') as HTMLElement;
        if (header && !this.isMinimized) {
          header.style.display = 'none';
        }
        clearTimeout(this.transitionTimeout);
        this.transitionTimeout = setTimeout(() => {
          if(this.window) {
            this.window.nativeElement.style.transition = 'none';
          }
        }, 100);
      } else {
        if(!this.isMinimized){
          this.window.nativeElement.style.width = `${this.width}px`;
          this.window.nativeElement.style.height = `${this.height}px`;
          const header = this.window.nativeElement.querySelector('.window-header') as HTMLElement;
          if (header && !this.isMinimized) {
            header.style.display = 'block';
          }
        }else{
          this.window.nativeElement.style.width = `100px`;
          this.window.nativeElement.style.height = `80px`;
        }
      }
    }
  }

  mouseIsOnFolder(event: MouseEvent): boolean {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    return FileSystemManager.getDesktopFolders().some(folder =>
      mouseX > folder.x &&
      mouseX < folder.x + 100 &&
      mouseY > folder.y &&
      mouseY < folder.y + 100
    );
  }
  getFolderPosition(event: MouseEvent): { x: number; y: number } | null {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Find all folders under the mouse
    const foldersUnderMouse = FileSystemManager.getDesktopFolders().filter(folder =>
      mouseX > folder.x &&
      mouseX < folder.x + 100 &&
      mouseY > folder.y &&
      mouseY < folder.y + 100
    );

    if (foldersUnderMouse.length === 0) {
      return null; // No folder under mouse
    }

    // Get the folder with the highest ID
    const topFolder = foldersUnderMouse.reduce((prev, curr) =>
      curr.id > prev.id ? curr : prev
    );

    return { x: topFolder.x, y: topFolder.y };
  }

  // Called when mouse is released
  onMouseUp(event?: MouseEvent): void {
    this.isDragging = false;
    this.mouseMoveListener();
    this.mouseUpListener();

    if (!event) return;

    const mouseX = event.clientX;
    const mouseY = event.clientY;
    // Find all folders under the mouse
    if(!this.isMinimized) return;
    const targetFolders = FileSystemManager.getDesktopFolders().filter(folder =>
      mouseX >= folder.x &&
      mouseX <= folder.x + 100 &&
      mouseY >= folder.y &&
      mouseY <= folder.y + 100
    );

    if (targetFolders.length > 0) {
      // Pick the folder with the highest numeric ID
      const targetFolder = targetFolders.reduce((a, b) =>
        a.id > b.id ? a : b
      );
      // Emit event for DesktopComponent
      EventManager.folderDroppedEvent.emit({
        image: {
          picture: this.picture,
          width: this.width,
          height: this.height,
          desc: this.desc,
        },
        folderId: targetFolder.id
      });
    }
  }

  saveWindowSizeAndPosition() {
    if(this.window){
      this.tempHeight = this.window.nativeElement.style.height;
      this.tempWidth = this.window.nativeElement.style.width;
      this.tempLeft = this.window.nativeElement.style.left;
      this.tempTop = this.window.nativeElement.style.top;
    }
  }
  applyTempWindowSizeAndPosition() {
    if(this.window){
      this.window.nativeElement.style.height = this.tempHeight;
      this.window.nativeElement.style.width = this.tempWidth;
      this.window.nativeElement.style.left = this.tempLeft;
      this.window.nativeElement.style.top = this.tempTop;
    }
  }

  async minimize() {
    if(this.isFullscreen) return;
    this.isMinimized = true;
    this.saveWindowSizeAndPosition();

    if (this.window) {
      const header = this.window.nativeElement.querySelector('.window-header') as HTMLElement;
      const title = this.window.nativeElement.querySelector('.window-title') as HTMLElement;

      if (header) {
        header.style.display = 'none';
      }
      if (title) {
        title.style.display = "none";
      }

      this.window.nativeElement.style.transition = `0.5s`;
      this.window.nativeElement.style.width = `100px`;
      this.window.nativeElement.style.height = `80px`;
      await this.sleep(500);
      this.window.nativeElement.style.transition = `0s`;
    }
  }

  async maximize() {
    if(!this.isMinimized){
      await this.minimize();
      return;
    }
    this.isMinimized = false;
    if (this.window) {
      const header = this.window.nativeElement.querySelector('.window-header') as HTMLElement;
      const title = this.window.nativeElement.querySelector('.window-title') as HTMLElement;

      this.window.nativeElement.style.zIndex = DraggableWindowComponent.mouseDownCounter;

      if (header) {
        header.style.display = 'block';
      }

      this.window.nativeElement.style.transition = `0.5s`;
      this.applyTempWindowSizeAndPosition();
      await this.sleep(500);
      if (title) {
        title.style.display = 'inline';
      }
      this.window.nativeElement.style.transition = `0s`;
    }
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fullscreen() {
    const content = this.window.nativeElement.querySelector('.window-content') as HTMLElement;
    const minimize = this.window.nativeElement.querySelector('.minimize') as HTMLElement;

    if(this.isFullscreen){
      if(this.window){
        this.window.nativeElement.style.transition = `0.5s`;
        this.applyTempWindowSizeAndPosition()
        minimize.style.background = 'transparent';

        await this.sleep(450)

        if (content) {
          content.style.backgroundSize = 'cover';
        }
        await this.sleep(50)
        this.window.nativeElement.style.transition = `0s`;
      }

      this.isFullscreen = false;
      return;
    }
    this.isFullscreen = true;
    this.saveWindowSizeAndPosition();

    if (this.window) {
      if (content) {
        content.style.backgroundSize = 'contain';
      }

      this.window.nativeElement.style.transition = `0.5s`;
      this.window.nativeElement.style.zIndex = `10000`;
      this.window.nativeElement.style.width = `calc(100% - 30px)`;
      this.window.nativeElement.style.height = `calc(100% - 30px)`;
      this.window.nativeElement.style.left = `15px`;
      this.window.nativeElement.style.top = `15px`;

      minimize.style.background = '#ccc';
      await this.sleep(500);
      this.window.nativeElement.style.transition = `0s`;
    }
  }
}
