import { ServicioService } from '../servicios/servicio.service';
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

  resumen: Resumen;
  listaProcesos: Procesos[] = new Array();
  nodeDataArray: ProcesoArbol[] = new Array();
  displayedColumns: string[] = ['pid', 'nombre', 'usuario', 'estado', 'ram', 'accion'];
  dataSource: MatTableDataSource<Procesos>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private servicio: ServicioService) {
    this.actualizarDatos();

  }

  actualizarDatos() {
    this.servicio.informacionPrincipal2().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].estado === 'T') {
          data[i].booleano = false;
        } else {
          data[i].booleano = true;
        }
      }
      this.listaProcesos = data;
      this.dataSource = new MatTableDataSource(this.listaProcesos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Creo el arbol
      this.nodeDataArray = new Array();
      for (let i = 0; i < data.length; i++) {
        const nuevo: ProcesoArbol = {
          key: data[i].pid,
          name: 'PID: ' + data[i].pid + ', \n Nombre: ' + data[i].nombre,
          parent: data[i].ppid
        };
        this.nodeDataArray.push(nuevo);
      }
      this.myDiagram.model = new go.TreeModel(this.nodeDataArray);
    }, error => {
      alert('Ha ocurrido un error al obtener la lista de procesos');
    });

    this.servicio.informacionPrincipal1().subscribe(data => {
      this.resumen = data;
    }, error => {
      alert('Ha ocurrido un error al obtener las estadisticas generales');
    });
  }

  terminar(e) {
    this.servicio.matarProceso(e.nombre).subscribe(data => {
      alert('El proceso se ha eliminado existosamente');
    }, error => {
      alert('Hubo un error al eliminar el proceso');
    });
  }

  ngOnInit() {
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


      this.myDiagram.model = new go.TreeModel(this.nodeDataArray);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
