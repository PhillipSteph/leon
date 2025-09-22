import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, Input, OnInit } from '@angular/core';
import {NgOptimizedImage, NgStyle} from '@angular/common';
import {folderManager} from '../folder_manager';

@Component({
  selector: 'app-draggable-window',
  templateUrl: 'draggable-window.html',
  standalone: true,
  imports: [
    NgStyle
  ],
  styleUrls: ['draggable-window.scss']
})
export class DraggableWindowComponent implements AfterViewInit, OnInit {
  @ViewChild('window', { static: false }) window!: ElementRef;

  @Input() picture: string = '';  // URL or path to the image for background
  @Input() width: number = 500;   // Default width
  @Input() height: number = 400;  // Default height
  @Input() x: number = 200;         // Initial x position
  @Input() y: number = 200;         // Initial y position
  @Input() z: number = 1;
  @Input() desc: string = "window";
  @Input() minimized = false;
  private transitionTimeout: any;
  private currentlyminimized = false;
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;
  private mouseMoveListener: () => void = () => {}; // Mouse move listener
  private mouseUpListener: () => void = () => {};   // Mouse up listener

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    console.log(`Initial values: x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`);
    this.z = this.z * 2;
  }

  ngAfterViewInit(): void {
    if (this.window) {
      // Apply the dynamic styles here
      this.window.nativeElement.style.width = `${this.width}px`;
      this.window.nativeElement.style.height = `${this.height}px`;
      this.window.nativeElement.style.left = `${this.x}px`;
      this.window.nativeElement.style.top = `${this.y}px`;
      this.window.nativeElement.style.zIndex = `${this.z}`
      // Set the background image if provided
      if (this.picture) {
        this.window.nativeElement.style.backgroundImage = `url(${this.picture})`;
        this.window.nativeElement.style.backgroundSize = 'cover';
        this.window.nativeElement.style.backgroundPosition = 'center';
      }
    }
    if(this.minimized){
      this.minimize();
    }
  }

  // Called when mouse is pressed down
  onMouseDown(event: MouseEvent): void {
    if (this.window) {
      this.isDragging = true;
      this.offsetX = event.clientX - this.window.nativeElement.offsetLeft;
      this.offsetY = event.clientY - this.window.nativeElement.offsetTop;

      // Listen to mousemove and mouseup events
      this.mouseMoveListener = this.renderer.listen('document', 'mousemove', this.onMouseMove.bind(this));
      this.mouseUpListener = this.renderer.listen('document', 'mouseup', this.onMouseUp.bind(this));
    } else {
      console.error('Window reference is not available');
    }
  }
  // Called while dragging
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging && this.window) {

      const x = event.clientX - this.offsetX;
      const y = event.clientY - this.offsetY;
      this.window.nativeElement.style.left = `${x}px`;
      this.window.nativeElement.style.top = `${y}px`;

      if (this.mouseIsOnFolder(event)) {
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
        if (header && !this.minimized) {
          header.style.display = 'none';
        }
        clearTimeout(this.transitionTimeout);
        this.transitionTimeout = setTimeout(() => {
          if(this.window) {
            this.window.nativeElement.style.transition = 'none';
          }
        }, 100);
      } else {
        if(!this.minimized){
          this.window.nativeElement.style.width = `${this.width}px`;
          this.window.nativeElement.style.height = `${this.height}px`;
          const header = this.window.nativeElement.querySelector('.window-header') as HTMLElement;
          if (header && !this.minimized) {
            header.style.display = 'block';
          }
        }else{
          this.window.nativeElement.style.width = `100px`;
          this.window.nativeElement.style.height = `80px`;
        }
        // Restore original size when not over a folder
        this.currentlyminimized = false;
      }
    }
  }

  mouseIsOnFolder(event: MouseEvent): boolean {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    return folderManager.folderArray.some(folder =>
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
    const foldersUnderMouse = folderManager.folderArray.filter(folder =>
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
    const targetFolders = folderManager.folderArray.filter(folder =>
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

      // Push the image into the folder
      targetFolder.images.push(this.picture);

      // Emit event for DesktopComponent
      folderManager.folderDroppedEvent.emit({
        picture: this.picture,
        folderId: targetFolder.id
      });
    }
  }


  async minimize() {
    this.minimized = true;
    if (this.window) {
      const header = this.window.nativeElement.querySelector('.window-header') as HTMLElement;
      if (header) {
        header.style.display = 'none';
      }

      this.window.nativeElement.style.transition = `0.5s`;
      this.window.nativeElement.style.width = `100px`;
      this.window.nativeElement.style.height = `80px`;
      await this.sleep(500);
      this.window.nativeElement.style.transition = `0s`;
    }
  }

  async maximize() {
    if(!this.minimized){
      await this.minimize();
      return;
    }
    this.minimized = false;
    if (this.window) {
      const header = this.window.nativeElement.querySelector('.window-header') as HTMLElement;

      if (header) {
        header.style.display = 'block';
      }

      this.window.nativeElement.style.transition = `0.5s`;
      this.window.nativeElement.style.width = `500px`;
      this.window.nativeElement.style.height = `400px`;
      await this.sleep(500);
      this.window.nativeElement.style.transition = `0s`;
    }
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
