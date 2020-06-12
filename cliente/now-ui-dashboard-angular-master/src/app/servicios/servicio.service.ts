import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resumen, Procesos, Ram, Cpu } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  url = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  // Estadisticas generales
  informacionPrincipal1() {
    return this.http.get<Resumen>(this.url + 'principal1');
  }

  // La informacion de los procesos
  informacionPrincipal2() {
    return this.http.get<Procesos[]>(this.url + 'principal2');
  }

  // Devuelve los datos de la RAM
  informacionRam() {
    return this.http.get<Ram>(this.url + 'ram');
  }

  // Devuelve la informacion del CPU
  informacionCpu() {
    return this.http.get<Cpu>(this.url + 'cpu');
  }

  // Envia el pid del proceso para matarlo
  matarProceso(pid: string) {
    return this.http.post<any>(this.url + 'kill/' + pid, '');
  }
}
