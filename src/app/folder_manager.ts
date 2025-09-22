import {EventEmitter} from '@angular/core';

export class FolderModel {
  constructor(
    public id: number,
    public x: number,
    public y: number,
    public images: string[]
  ) {}
}

export class folderManager {
  private static idCounter = 0;

  public static folderArray: FolderModel[] = [];
  public static openImageEvent: EventEmitter<any> = new EventEmitter();

  static generateId(): number {
    return folderManager.idCounter++;
  }

  static registerFolder(x: number, y: number, folderId: number, images: string[]): void {
    // Check if folder already exists
    const exists = this.folderArray.some(folder => folder.id === folderId);
    if (exists) {
      console.log(`Folder with id ${folderId} already exists.`);
      return;
    }

    // If not exists, add it
    const newFolder = new FolderModel(folderId, x, y, images);
    this.folderArray.push(newFolder);
    console.log(`Folder with id ${folderId} registered.`);
  }

  static openImages(folderId: number, images: string[], x: number, y: number) {
    let zCounter: number = this.idCounter;
    images.forEach((imgUrl, index) => {
      const windowData = {
        desc: `Bild ${index + 1}`,
        picture: imgUrl,
        x: (x += 20),
        y: (y += 20),
        z: zCounter++,
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
