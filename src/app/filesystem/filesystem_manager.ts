import {Folder} from './folder_object';
import {FolderComponent} from '../folder/folder.component';
import {EventManager} from './event_manager';

export class FileSystemManager {
  static desktop: Folder;
  static folderIdCount: number = 0;
  static findFolderById(id: number, currentFolder?: Folder): Folder | undefined {
    if(!currentFolder) currentFolder = FileSystemManager.desktop;

    if (currentFolder.id === id) {
      return currentFolder;
    }

    for (const child of currentFolder.childFolders) {
      const found = this.findFolderById(id, child);
      if (found) return found;
    }

    return undefined;
  }

  static init() {
    this.desktop = new Folder("desktop")
    EventManager.folderDroppedEvent.subscribe(({ image, folderId }) => {
      const folderToAddImageTo = this.findFolderById(folderId);
      if (folderToAddImageTo) {
        folderToAddImageTo.addImage(image);
      } else {
        console.warn(`Folder with ID ${folderId} not found.`);
      }
    });

    this.desktop.addImages([
      // all Images which should be in desktop at start
      {
        desc: 'Bild7 - Leon Stephan - 2021',
        picture: 'https://galeriemontblanc.com/cdn/shop/files/Vue_avion_013e0d87-25db-4d3b-85ed-4852004f944d.jpg?v=1731891831',
        width: 700,
        height: 600,
        x: 100,
        y: 100,
        z: 10,
      },
      {
        desc: 'Bild2 - Leon Stephan - 2022',
        picture: 'https://arthive.com/res/media/img/oy1000/work/93b/623482@2x.jpg',
        width: 500,
        height: 600,
        x: 200,
        y: 100,
        z: 10,
      },
      {
        desc: 'Bild1 - Leon Stephan - 2024',
        picture: 'https://www.kunstloft.at/magazin/wp-content/uploads/2023/05/AdobeStock_542915248-scaled-1-2000x889.jpeg',
        width: 800,
        height: 400,
        x: 300,
        y: 100,
        z: 10,
        minimized: false
      }
    ])
    this.desktop.addChildFolder(new Folder("walter_gropius", 250, 200, this.desktop, undefined, [
      {
        width: 900,
        height: 650,
        desc: 'Modernist architecture – Bauhaus Meisterhäuser',
        picture: 'https://www.ignant.com/wp-content/uploads/2019/01/ignant-architecture-bruno-fioretti-marquez-bauhaus-meisterhauser-3.jpg'
      },
      {
        width: 800,
        height: 600,
        desc: 'Exterior of Bauhaus Dessau',
        picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKXlKpk_zz0I88CUb6nPHd1fBUPHhuIxv2ng&s'
      }
    ] ))
    this.desktop.addChildFolder(new Folder("folder", 100, 200, this.desktop, undefined))
  }

  static generateId(): number {
    return FileSystemManager.folderIdCount++;
  }

  static getDesktopFolders() {
    return this.desktop.childFolders;
  }
}
