import {Component, Type} from '@angular/core';
import {Application, WindowComponent} from "../window/window";
import {FileSystemManager} from "../../filesystem/filesystem_manager";
import {NgForOf, NgStyle} from "@angular/common";
import {Folder} from "../../filesystem/folder_object";

@Component({
  selector: 'app-file-explorer',
  imports: [
    WindowComponent,
    NgForOf,
    NgStyle
  ],
  templateUrl: './file-explorer.html',
  styleUrl: './file-explorer.scss'
})
export class FileExplorer implements Application{
  name = "FileExplorer"
  selectedFolder: Folder = FileSystemManager.desktop;
  getComponent(): typeof FileExplorer {
    return FileExplorer;
  }

  getFileExplorer() {
    return this;
  }

  protected readonly FileSystemManager = FileSystemManager;
}
