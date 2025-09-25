import {Component, Type} from '@angular/core';
import {Application, WindowComponent} from "../window/window";

@Component({
  selector: 'app-file-explorer',
  imports: [
    WindowComponent
  ],
  templateUrl: './file-explorer.html',
  styleUrl: './file-explorer.scss'
})
export class FileExplorer implements Application{
  name = "FileExplorer"

  getComponent(): typeof FileExplorer {
    return FileExplorer;
  }

  getFileExplorer() {
    return this;
  }
}
