import {EventEmitter} from '@angular/core';
import {Application} from './applications/window/window';
import {FolderImage} from './folder/folder';

export class FolderModel {
  constructor(
    public id: number,
    public x: number,
    public y: number,
    public images: FolderImage[]
  ) {}
}

export class folderManager {
  private static idCounter = 0;

  public static folderArray: FolderModel[] = [];
  public static openImageEvent: EventEmitter<any> = new EventEmitter();
  public static openAppEvent: EventEmitter<Application> = new EventEmitter();

  public static closeAppEvent: EventEmitter<string> = new EventEmitter();

  static folderDroppedEvent: EventEmitter<{ picture: string, width: number, height: number, desc: string, folderId: number }> = new EventEmitter();

  static generateId(): number {
    return folderManager.idCounter++;
  }

  static registerFolder(x: number, y: number, folderId: number, images: FolderImage[]): void {
    const exists = this.folderArray.some(folder => folder.id === folderId);
    if (exists) {
      console.log(`Folder with id ${folderId} already exists.`);
      return;
    }

    // Clone the array to prevent shared reference issues
    const clonedImages = [...images];

    const newFolder = new FolderModel(folderId, x, y, clonedImages);
    this.folderArray.push(newFolder);
    console.log(`Folder with id ${folderId} registered.`);
  }


  static openImages(folderId: number, images: FolderImage[], x: number, y: number) {
    x+= 70;
    y+= 70;
    let zCounter: number = this.idCounter;
    images.forEach((image, index) => {
      const windowData = {
        desc: image.desc,
        picture: image.picture,
        x: (x += 20),
        y: (y += 20),
        z: zCounter++,
        width: image.width,
        height: image.height,
        minimized: true
      };
      this.openImageEvent.emit(windowData);
    });

    const folder = this.folderArray.find(f => f.id === folderId);
    if (folder) {
      folder.images = [];  // reset to empty array
      console.log(`Cleared images of folder ${folderId}`);
    }
  }

}
