import {FolderImage} from '../folder/folder';

export class Folder {
  private parentFolder?: Folder;
  private childFolders: Folder[] = [];
  private images: FolderImage[] = [];
  name: string = "";

  constructor(name: string, parentFolder?: Folder, childFolders?: Folder[], images?: FolderImage[]) {
    this.name = name;
    this.parentFolder = parentFolder;
    if(childFolders) this.childFolders = childFolders;
    if(images) this.images = images;
  }

  addImage(image: FolderImage): void {
    this.images.push(image);
  }
  addImages(images: FolderImage[]): void {
    this.images = this.images.concat(images)
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
