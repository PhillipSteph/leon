import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-folder',
  standalone: true,
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent {
  @Output() openFolder = new EventEmitter<void>();  // To notify when the folder is opened

  // You can store pictures or other items here
  pictures = [
    '../assets/image1.png',
    '../assets/image2.png',
    '../assets/image3.png'
  ];

  onFolderDoubleClick(): void {
    this.openFolder.emit();  // Notify the parent when the folder is opened
  }
}
