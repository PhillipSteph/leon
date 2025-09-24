import {Component, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Desktop} from './desktop/desktop';
import {FileSystemManager} from './filesystem/filesystem_manager';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Desktop],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  protected readonly title = signal('leon');

  ngOnInit(): void {
    FileSystemManager.init();
  }
}
