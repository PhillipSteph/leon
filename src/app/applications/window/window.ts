import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, Type, ViewChild} from '@angular/core';
import {folderManager} from '../../folder_manager';
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

  private transitionTimeout: any;
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;
  private mouseMoveListener: () => void = () => {}; // Mouse move listener
  private mouseUpListener: () => void = () => {};   // Mouse up listener

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
      }
  }
  // Called when mouse is released
  onMouseUp(event: MouseEvent): void {
    this.isDragging = false;
    this.mouseMoveListener();
    this.mouseUpListener();
  }


  async minimize() {
    folderManager.closeAppEvent.emit(this.app.name);
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnInit(): void {
  }

}
