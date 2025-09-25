import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, Type, ViewChild} from '@angular/core';
import {EventManager} from '../../filesystem/event_manager';
import {DraggableWindowComponent} from '../../draggable-window/draggable-window';
export interface Application {
  name: string;
  getComponent(): Type<any>; // Import Type from '@angular/core'
}


@Component({
  selector: 'app-window',
  template: `
    <div #window class="draggable-window" [class.minimized]="minimized">
      <div class="window-header" (mousedown)="onMouseDown($event)">
        <span class="window-title">{{ desc }} </span>
        <button (click)="fullscreen()" class="fullscreen">
          <div class="plus"></div>
        </button>
        <button (click)="minimize()" class="minimize">
          <div class="hyphen"></div>
        </button>
      </div>
      <div class="window-content" [class.minimized]="minimized">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./window.scss']
})
export class WindowComponent implements AfterViewInit, OnInit{
  @ViewChild('window', { static: false }) window!: ElementRef;

  minimized: any;
  @Input() desc: string = "";
  @Input() width: number = 700;   // Default width
  @Input() height: number = 560;  // Default height
  @Input() x: number = 200;         // Initial x position
  @Input() y: number = 200;         // Initial y position
  @Input() z: number = 1;
  @Input() app!: Application;

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
  ngAfterViewInit(): void {
    if (this.window) {
      // Apply the dynamic styles here
      this.window.nativeElement.style.width = `${this.width}px`;
      this.window.nativeElement.style.height = `${this.height}px`;
      this.window.nativeElement.style.left = `${this.x}px`;
      this.window.nativeElement.style.top = `${this.y}px`;
      this.window.nativeElement.style.zIndex = `${this.z}`
    }
    EventManager.closeAppEvent.subscribe(removedApp => {
        if(removedApp == this.desc) {
          if (this.window) {
            this.window.nativeElement.style.display = `none`;
          }
        }
    })
    EventManager.reOpenAppEvent.subscribe(removedApp => {
      if(removedApp.name == this.desc) {
        if (this.window) {
          this.window.nativeElement.style.display = `flex`;
        }
      }
    })
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
      this.window.nativeElement.style.zIndex = DraggableWindowComponent.mouseDownCounter++;

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
      }
  }
  // Called when mouse is released
  onMouseUp(event: MouseEvent): void {
    this.isDragging = false;
    this.mouseMoveListener();
    this.mouseUpListener();
  }


  async minimize() {
    if(this.isFullscreen) {
      this.fullscreen();
      return;
    }
    EventManager.closeAppEvent.emit(this.app.name);
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnInit(): void {
  }

  async fullscreen() {
    const content = this.window.nativeElement.querySelector('.window-content') as HTMLElement;

    if(this.isFullscreen){
      if(this.window){
        this.window.nativeElement.style.transition = `0.5s`;
        this.applyTempWindowSizeAndPosition()

        await this.sleep(450)

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

      await this.sleep(500);
      this.window.nativeElement.style.transition = `0s`;
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
}
