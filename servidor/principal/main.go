package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"strconv"
	"strings"
)

type DatosRam struct {
	total      float64
	consumida  float64
	porcentaje float64
}

type Procesos struct {
	pid           float64
	nombre        string
	usuario       string
	estado        string
	porcentajeRam float64
	ppid          float64
}

type Usuario struct {
	pid    int
	nombre string
}

type Estadisticas struct {
	ejecucion   int
	suspendidos int
	detenidos   int
	zombie      int
	total       int
}

var (
	arregloUsuarios       []Usuario
	monitorRAM            = DatosRam{0, 0, 0}
	listaProcesos         []Procesos
	estadisticasGenerales = Estadisticas{0, 0, 0, 0, 0}
)

func main() {
	obtenerUsuarios()
	leerMeminfo()
	leerProcesos()
}

//FUNCIONES PRINCIPALES--------------------------------------------------------------------------------------------------------------------------------

//Esta funcion es utilizada para obtener la informacion de la ram utilizada y el total de la RAM
func leerMeminfo() {
	bytesLeidos, err := ioutil.ReadFile("/proc/meminfo")
	if err != nil {
		fmt.Printf("Error leyendo archivo: %v", err)
		return
	}

	contenidoArchivo := string(bytesLeidos)
	archivoCortado := strings.Split(contenidoArchivo, "\n")
	monitorRAM.total = (limpiarNumero(archivoCortado[0]) / 1000)
	libre := limpiarNumero(archivoCortado[2]) / 1000
	monitorRAM.consumida = (monitorRAM.total - libre)
	monitorRAM.porcentaje = (monitorRAM.consumida / monitorRAM.total) * 100
	//fmt.Printf("Total: %g Mb, Consumida: %g Mb, Porcentaje: %g \n", monitorRAM.total, monitorRAM.consumida, monitorRAM.porcentaje)
}

/*Esta funcion es utilizada para obtener toda la informacion de los procesos y estadisticas generales.
Hace uso del dato del total de la RAM calculado anteriormente*/
func leerProcesos() {
	archivos, err := ioutil.ReadDir("/proc/")
	if err != nil {
		log.Fatal(err)
	}

	listaProcesos = []Procesos{}
	for _, archivo := range archivos {
		if archivo.IsDir() {
			nombreCarpeta := archivo.Name()
			if buscarNumero(nombreCarpeta) {
				bytesLeidos, err := ioutil.ReadFile("/proc/" + nombreCarpeta + "/status")
				if err != nil {
					fmt.Printf("Error leyendo archivo: %v", err)
					return
				}
				contenidoArchivo := string(bytesLeidos)
				archivoCortado := strings.Split(contenidoArchivo, "\n")
				pid := limpiarNumero(archivoCortado[5])
				nombre := limpiarProc(archivoCortado[0])
				usuario := limpiarUsuario(archivoCortado[8])
				estado := limpiarEstado(archivoCortado[2])
				porcentaje := (buscarPorcentajeRam(archivoCortado[17]))
				ppid := limpiarNumero(archivoCortado[6])
				proceso := Procesos{pid, nombre, usuario, estado, porcentaje, ppid}
				listaProcesos = append(listaProcesos, proceso)
			}
		}
	}

	estadisticasGenerales.total = len(listaProcesos)
	contadorEjecucion, contadorSuspendidos, contadorDetenidos, contadorZombie := 0, 0, 0, 0
	for i := 0; i < len(listaProcesos)-1; i++ {
		if listaProcesos[i].estado == "R" {
			contadorEjecucion++
		} else if listaProcesos[i].estado == "S" {
			contadorSuspendidos++
		} else if listaProcesos[i].estado == "T" {
			contadorDetenidos++
		} else if listaProcesos[i].estado == "Z" {
			contadorZombie++
		}
	}
	estadisticasGenerales.ejecucion = contadorEjecucion
	estadisticasGenerales.suspendidos = contadorSuspendidos
	estadisticasGenerales.detenidos = contadorDetenidos
	estadisticasGenerales.zombie = contadorZombie
}

//FUNCIONES AUXILIARES----------------------------------------------------------------------------------------------------------------------------

//Esta funcion devuelve el porcentaje de ram utilizado por cada procesos
func buscarPorcentajeRam(cadena string) float64 {
	if strings.HasPrefix(cadena, "VmSize") {
		tamanioConvertido := limpiarNumero(cadena) / 1000
		porcentaje := (tamanioConvertido / monitorRAM.total) * 100
		return porcentaje
	}
	return 0
}

//Esta funcion es utilizada para quitar la informacion innecesaria de una linea del archivo proc
func limpiarProc(cadena string) string {
	cortado := strings.Split(cadena, ":")
	sinEspacios := strings.TrimSpace(cortado[1])
	return sinEspacios
}

//Esta funcion es utilizada para quitar informacion innecesaria en una linea que contiene un numero y lo devuelve convertido
func limpiarNumero(cadena string) float64 {
	cortado := strings.Split(cadena, ":")
	sinEspacios := strings.TrimSpace(cortado[1])
	final := strings.Fields(sinEspacios)
	retorno, error := strconv.Atoi(final[0])
	if error != nil {
		fmt.Println("Error al convertir: ", error)
		return 0
	}
	return float64(retorno)
}

//Esta funcion busca si el nombre de una carpeta contiene un numero
func buscarNumero(cadena string) bool {
	if strings.ContainsAny(cadena, "0") {
		return true
	} else if strings.ContainsAny(cadena, "1") {
		return true
	} else if strings.ContainsAny(cadena, "2") {
		return true
	} else if strings.ContainsAny(cadena, "3") {
		return true
	} else if strings.ContainsAny(cadena, "4") {
		return true
	} else if strings.ContainsAny(cadena, "5") {
		return true
	} else if strings.ContainsAny(cadena, "6") {
		return true
	} else if strings.ContainsAny(cadena, "7") {
		return true
	} else if strings.ContainsAny(cadena, "8") {
		return true
	} else if strings.ContainsAny(cadena, "9") {
		return true
	} else {
		return false
	}
}

//Esta funcion devuelve el usuario de un proceso
func limpiarUsuario(cadena string) string {
	cortado := strings.Split(cadena, ":")
	sinEspacios := strings.TrimSpace(cortado[1])
	final := strings.Fields(sinEspacios)
	id, error := strconv.Atoi(final[0])
	if error != nil {
		fmt.Println("Error al convertir: ", error)
		return ""
	}
	for i := 0; i < len(arregloUsuarios)-1; i++ {
		if id == arregloUsuarios[i].pid {
			return arregloUsuarios[i].nombre
		}
	}
	return ""
}

//Esta funcion devuelve solo la letra del estado en el que esta un proceso
func limpiarEstado(cadena string) string {
	cortado := strings.Split(cadena, ":")
	sinEspacios := strings.TrimSpace(cortado[1])
	final := strings.Fields(sinEspacios)
	return final[0]
}

//Esta funcion obtiene los usuarios del sistema y su id respectivo
func obtenerUsuarios() {
	nombreArchivo := "/etc/passwd"
	bytesLeidos, err := ioutil.ReadFile(nombreArchivo)
	if err != nil {
		fmt.Printf("Error leyendo archivo: %v", err)
	}

	contenido := string(bytesLeidos)
	arreglo := strings.Split(contenido, "\n")
	for i := 0; i < len(arreglo)-1; i++ {
		cortada := strings.Split(arreglo[i], ":")
		pid, error := strconv.Atoi(cortada[2])
		if error != nil {
			fmt.Println("Error al convertir: ", error)
		}
		nombre := cortada[0]
		usuario := Usuario{pid, nombre}
		arregloUsuarios = append(arregloUsuarios, usuario)

	}
}
