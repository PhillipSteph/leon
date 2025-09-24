import {FolderImage} from './folder_image';
import {FileSystemManager} from './filesystem_manager';

export class Folder {
  id: number;
  name: string = "";
  x: number = 100;
  y: number = 100;

  parentFolder?: Folder;
  childFolders: Folder[] = [];
  images: FolderImage[] = [];

  constructor(
    name: string,
    x?: number,
    y?: number,
    parentFolder?: Folder,
    childFolders?: Folder[],
    images?: FolderImage[]
  ) {
    this.id = FileSystemManager.generateId();
    this.name = name;
    if (x) this.x = x;
    if (y) this.y = y;
    this.parentFolder = parentFolder;
    if (childFolders) this.childFolders = childFolders;
    if (images) this.images = images;
  }

  isFilled(): boolean {
    return this.images.length > 0;
  }

  addImage(image: FolderImage): void {
    if(this.hasImage(image)) return;

    console.log("image added to "+this.name)
    this.images.push(image);
    console.log(this.name+" contains: "+this.images);
  }
  addImages(images: FolderImage[]): void {
    this.images = this.images.concat(images)
  }

  hasImage(image: FolderImage): boolean {
    let retValue = false;
    this.images.forEach((imagefe: FolderImage) => {
      if(imagefe.desc == image.desc && imagefe.picture == imagefe.picture){
        retValue = true
      }
    })
    return retValue;
  }
  removeImageByPicture(picture: string): boolean {
    const index = this.images.findIndex(img => img.picture === picture);
    if (index !== -1) {
      this.images.splice(index, 1);
      return true; // Successfully removed
    }
    return false; // Not found
  }

  getImageByPicture(picture: string): FolderImage | undefined {
    return this.images.find(img => img.picture === picture);
  }

  getAllImages(): FolderImage[]{
    return this.images;
  }

  addChildFolder(child: Folder):void {
    this.childFolders.push(child)
  }

  getAllChildFolders(): Folder[]{
    return this.childFolders;
  }
}
