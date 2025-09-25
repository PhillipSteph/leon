import {EventEmitter} from '@angular/core';
import {Application} from '../applications/window/window';
import {Folder} from './folder_object';
import {FolderImage} from './folder_image';
import {FolderComponent} from '../folder/folder.component';

export class EventManager {
  public static openImageEvent: EventEmitter<{image: FolderImage, x: number, y: number, z: number, minimized: boolean}> = new EventEmitter();
  public static openAppEvent: EventEmitter<Application> = new EventEmitter();
  public static reOpenAppEvent: EventEmitter<Application> = new EventEmitter();
  public static closeAppEvent: EventEmitter<string> = new EventEmitter();
  public static folderDroppedEvent: EventEmitter<{ image: FolderImage, folderId: number }> = new EventEmitter();
}
