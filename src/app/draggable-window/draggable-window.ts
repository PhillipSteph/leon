import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, Input, OnInit } from '@angular/core';
import {NgOptimizedImage, NgStyle} from '@angular/common';

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
  @Input() width: number = 300;   // Default width
  @Input() height: number = 200;  // Default height
  @Input() x: number = 0;         // Initial x position
  @Input() y: number = 0;         // Initial y position
  @Input() z: number = 1;
  @Input() desc: string = "window";

  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;
  private mouseMoveListener: () => void = () => {}; // Mouse move listener
  private mouseUpListener: () => void = () => {};   // Mouse up listener

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Initialize window styles here or in the view
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
  onMouseUp(): void {
    this.isDragging = false;
    // Clean up: Remove the event listeners
    this.mouseMoveListener();
    this.mouseUpListener();
  }
}
