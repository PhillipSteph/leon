import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgStyle} from '@angular/common';
import {folderManager} from '../folder_manager';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.html',
  styleUrls: ['./folder.scss']
})

export class Folder implements AfterViewInit, OnInit {
  @ViewChild('window', { static: false }) window!: ElementRef;
  @Input() images: string[] = [];
  @Input() x: number = this.getRandomNumber();         // Initial x position
  @Input() y: number = this.getRandomNumber(50, 500);  // Initial y position
  @Input() minimized = false;

  folderId: number = folderManager.generateId()

  ngOnInit(): void {
    folderManager.registerFolder(this.x,this.y,this.folderId, this.images)
  }
  ngAfterViewInit(): void {
    if (this.window) {
      this.window.nativeElement.style.left = `${this.x}px`;
      this.window.nativeElement.style.top = `${this.y}px`;
      this.window.nativeElement.style.zIndex = `${this.folderId}`
    }
  }

  getRandomNumber(min: number = 50, max: number = 800): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getInformation() {
    console.log(folderManager.folderArray)
  }

  openFolder() {

    if(this.images.length == 0) return;
    folderManager.openImages(this.folderId, this.images, this.x, this.y);
    this.images = [];

    this.getInformation()
  }
}
