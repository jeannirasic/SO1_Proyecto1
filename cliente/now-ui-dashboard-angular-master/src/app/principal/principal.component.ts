import { ProcesoArbol } from './../interfaces';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { Resumen, Procesos } from '../interfaces';
import * as go from 'gojs';

let $ = go.GraphObject.make;

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {

  public myDiagram: go.Diagram = null;

  resumen: Resumen = {
    ejecucion: 100,
    suspendidos: 100,
    detenidos: 100,
    zombie: 100,
    total: 400
  };

  listaProcesos: Procesos[] = new Array();
  displayedColumns: string[] = ['pid', 'nombre', 'usuario', 'estado', 'ram', 'accion'];
  dataSource: MatTableDataSource<Procesos>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor() {
    for (let i = 1; i < 83; i++) {
      const proc: Procesos = {
        pid: i ,
        nombre: 'proceso ' + i,
        usuario: 'usuario ' + i,
        estado: 'activo',
        ram: Math.floor(Math.random() * (100 - 0)) + 0,
        booleano: true
      };

      this.listaProcesos.push(proc);
    }
    this.dataSource = new MatTableDataSource(this.listaProcesos);
  }

  terminar(e) {
    console.log(e);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.myDiagram =
        $(go.Diagram, 'myDiagramDiv',
          {
            'toolManager.hoverDelay': 100,
            allowCopy: false,
            layout:
              $(go.TreeLayout,
                { angle: 90, nodeSpacing: 10, layerSpacing: 40, layerStyle: go.TreeLayout.LayerUniform })
          });

      this.myDiagram.add(
        $(go.Part, 'Table',
          { position: new go.Point(300, 10), selectable: false }
        ));


      this.myDiagram.nodeTemplate =
        $(go.Node, 'Auto',
          { deletable: false },
          new go.Binding('text', 'name'),
          $(go.Shape, 'Rectangle',
            {
              fill: '#E16D6D',
              stroke: null, strokeWidth: 0,
              stretch: go.GraphObject.Fill,
              alignment: go.Spot.Center
            }),
          $(go.TextBlock,
            {
              font: '700 12px Droid Serif, sans-serif',
              textAlign: 'center',
              margin: 10, maxSize: new go.Size(80, NaN)
            },
            new go.Binding('text', 'name'))
        );
      this.myDiagram.linkTemplate =
        $(go.Link,
          { routing: go.Link.Orthogonal, corner: 5, selectable: false },
          $(go.Shape, { strokeWidth: 3, stroke: '#424242' }));

      const nodeDataArray: ProcesoArbol[] = [
        { key: 0, name: 'PID: 0, \n Nombre: proceso 0' },
        { key: 1, parent: 0, name: 'PID: 1, \n Nombre: proceso 1' },
        { key: 2, parent: 0, name: 'PID: 2, \n Nombre: proceso 2' },
        { key: 7, parent: 2, name: 'PID: 7, \n Nombre: proceso 7' },
        { key: 16, parent: 7, name: 'PID: 16, \n Nombre: proceso 16' },
        { key: 38, parent: 16, name: 'PID: 38, \n Nombre: proceso 38' },
        { key: 39, parent: 16, name: 'PID: 39, \n Nombre: proceso 39' },
        { key: 17, parent: 7, name: 'PID: 17, \n Nombre: proceso 17' },
        { key: 40, parent: 17, name: 'PID: 40, \n Nombre: proceso 40' },
        { key: 82, parent: 40, name: 'PID: 82, \n Nombre: proceso 82' },
        { key: 41, parent: 17, name: 'PID: 41, \n Nombre: proceso 41' },
        { key: 18, parent: 7, name: 'PID: 18, \n Nombre: proceso 18' },
        { key: 42, parent: 18, name: 'PID: 42, \n Nombre: proceso 42' },
        { key: 43, parent: 18, name: 'PID: 43, \n Nombre: proceso 43' },
        { key: 19, parent: 7, name: 'PID: 19, \n Nombre: proceso 19' },
        { key: 44, parent: 19, name: 'PID: 44, \n Nombre: proceso 44' },
        { key: 45, parent: 19, name: 'PID: 45, \n Nombre: proceso 45' },
        { key: 8, parent: 2, name: 'PID: 8, \n Nombre: proceso 8' },
        { key: 20, parent: 8, name: 'PID: 20, \n Nombre: proceso 20' },
        { key: 21, parent: 8, name: 'PID: 21, \n Nombre: proceso 21' },
        { key: 46, parent: 21, name: 'PID: 46, \n Nombre: proceso 46' },
        { key: 47, parent: 21, name: 'PID: 47, \n Nombre: proceso 47' },
        { key: 3, parent: 0, name: 'PID: 3, \n Nombre: proceso 3' },
        { key: 9, parent: 3, name: 'PID: 9, \n Nombre: proceso 9' },
        { key: 22, parent: 9, name: 'PID: 22, \n Nombre: proceso 22' },
        { key: 48, parent: 22, name: 'PID: 48, \n Nombre: proceso 48' },
        { key: 49, parent: 22, name: 'PID: 49, \n Nombre: proceso 49' },
        { key: 50, parent: 22, name: 'PID: 50, \n Nombre: proceso 50' },
        { key: 51, parent: 22, name: 'PID: 51, \n Nombre: proceso 51' },
        { key: 23, parent: 9, name: 'PID: 23, \n Nombre: proceso 23' },
        { key: 52, parent: 23, name: 'PID: 52, \n Nombre: proceso 52' },
        { key: 53, parent: 23, name: 'PID: 53, \n Nombre: proceso 53' },
        { key: 54, parent: 23, name: 'PID: 54, \n Nombre: proceso 54' },
        { key: 55, parent: 23, name: 'PID: 55, \n Nombre: proceso 55' },
        { key: 24, parent: 9, name: 'PID: 24, \n Nombre: proceso 24' },
        { key: 56, parent: 24, name: 'PID: 56, \n Nombre: proceso 56' },
        { key: 57, parent: 24, name: 'PID: 57, \n Nombre: proceso 57' },
        { key: 58, parent: 24, name: 'PID: 58, \n Nombre: proceso 58' },
        { key: 59, parent: 24, name: 'PID: 59, \n Nombre: proceso 59' },
        { key: 25, parent: 9, name: 'PID: 25, \n Nombre: proceso 25' },
        { key: 60, parent: 25, name: 'PID: 60, \n Nombre: proceso 60' },
        { key: 61, parent: 25, name: 'PID: 61, \n Nombre: proceso 61' },
        { key: 62, parent: 25, name: 'PID: 62, \n Nombre: proceso 62' },
        { key: 10, parent: 3, name: 'PID: 10, \n Nombre: proceso 10' },
        { key: 26, parent: 10, name: 'PID: 26, \n Nombre: proceso 26' },
        { key: 63, parent: 26, name: 'PID: 63, \n Nombre: proceso 63' },
        { key: 27, parent: 10, name: 'PID: 27, \n Nombre: proceso 27' },
        { key: 64, parent: 27, name: 'PID: 64, \n Nombre: proceso 64' },
        { key: 4, parent: 0, name: 'PID: 4, \n Nombre: proceso 4' },
        { key: 11, parent: 4, name: 'PID: 11, \n Nombre: proceso 11' },
        { key: 12, parent: 4, name: 'PID: 12, \n Nombre: proceso 12' },
        { key: 28, parent: 12, name: 'PID: 28, \n Nombre: proceso 28' },
        { key: 65, parent: 28, name: 'PID: 65, \n Nombre: proceso 65' },
        { key: 66, parent: 28, name: 'PID: 66, \n Nombre: proceso 66' },
        { key: 29, parent: 12, name: 'PID: 29, \n Nombre: proceso 29' },
        { key: 67, parent: 29, name: 'PID: 67, \n Nombre: proceso 67' },
        { key: 30, parent: 12, name: 'PID: 30, \n Nombre: proceso 30' },
        { key: 68, parent: 30, name: 'PID: 68, \n Nombre: proceso 68' },
        { key: 5, parent: 0, name: 'PID: 5, \n Nombre: proceso 5' },
        { key: 13, parent: 5, name: 'PID: 13, \n Nombre: proceso 13' },
        { key: 31, parent: 13, name: 'PID: 31, \n Nombre: proceso 31' },
        { key: 69, parent: 31, name: 'PID: 69, \n Nombre: proceso 69' },
        { key: 70, parent: 31, name: 'PID: 70, \n Nombre: proceso 70' },
        { key: 71, parent: 31, name: 'PID: 71, \n Nombre: proceso 71' },
        { key: 32, parent: 13, name: 'PID: 32, \n Nombre: proceso 32' },
        { key: 72, parent: 32, name: 'PID: 72, \n Nombre: proceso 72' },
        { key: 73, parent: 32, name: 'PID: 73, \n Nombre: proceso 73' },
        { key: 74, parent: 32, name: 'PID: 74, \n Nombre: proceso 74' },
        { key: 75, parent: 32, name: 'PID: 75, \n Nombre: proceso 75' },
        { key: 33, parent: 13, name: 'PID: 33, \n Nombre: proceso 33' },
        { key: 76, parent: 33, name: 'PID: 76, \n Nombre: proceso 76' },
        { key: 77, parent: 33, name: 'PID: 77, \n Nombre: proceso 77' },
        { key: 14, parent: 5, name: 'PID: 14, \n Nombre: proceso 14' },
        { key: 34, parent: 14, name: 'PID: 34, \n Nombre: proceso 34' },
        { key: 78, parent: 34, name: 'PID: 78, \n Nombre: proceso 78' },
        { key: 79, parent: 34, name: 'PID: 79, \n Nombre: proceso 79' },
        { key: 35, parent: 14, name: 'PID: 35, \n Nombre: proceso 35' },
        { key: 80, parent: 35, name: 'PID: 80, \n Nombre: proceso 80' },
        { key: 81, parent: 35, name: 'PID: 81, \n Nombre: proceso 81' },
        { key: 15, parent: 5, name: 'PID: 15, \n Nombre: proceso 15' },
        { key: 36, parent: 15, name: 'PID: 36, \n Nombre: proceso 36' },
        { key: 37, parent: 15, name: 'PID: 37, \n Nombre: proceso 37' },
        { key: 6, parent: 0, name: 'PID: 6, \n Nombre: proceso 6' }
      ];

      this.myDiagram.model = new go.TreeModel(nodeDataArray);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
