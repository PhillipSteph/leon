import {Folder} from './folder_object';

export class FileSystemManager {
  static desktop = new Folder("desktop")

  static init(){
    this.desktop.addImages([
      // all Images which should be in desktop at start
      {
        desc: 'Bild7 - Leon Stephan - 2021',
        picture: 'https://galeriemontblanc.com/cdn/shop/files/Vue_avion_013e0d87-25db-4d3b-85ed-4852004f944d.jpg?v=1731891831',
        width: 700,
        height: 600,
      },
      {
        desc: 'Bild2 - Leon Stephan - 2022',
        picture: 'https://arthive.com/res/media/img/oy1000/work/93b/623482@2x.jpg',
        width: 500,
        height: 600,
      },
      {
        desc: 'Bild1 - Leon Stephan - 2024',
        picture: 'https://www.kunstloft.at/magazin/wp-content/uploads/2023/05/AdobeStock_542915248-scaled-1-2000x889.jpeg',
        width: 800,
        height: 400,
      }
    ])
    this.desktop.addChildFolder(new Folder("walter_gropius", this.desktop, undefined, [
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
  }
}
