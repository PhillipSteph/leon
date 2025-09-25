import { Component } from '@angular/core';
import {Application, WindowComponent} from '../window/window';

@Component({
  selector: 'app-minecraft',
  imports: [
    WindowComponent
  ],
  templateUrl: './minecraft.html',
  styleUrl: './minecraft.scss'
})
export class Minecraft implements Application{
  name = "classic.minecraft.net by Microsoft";
  getComponent(): typeof Minecraft {
    return Minecraft;
  }

  getMinecraft(){
    return this;
  }
}
