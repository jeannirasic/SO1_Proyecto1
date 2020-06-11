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

var (
	monitorRAM = DatosRam{0, 0, 0}
)

func main() {
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
	fmt.Printf("Total: %g Mb, Consumida: %g Mb, Porcentaje: %g \n", monitorRAM.total, monitorRAM.consumida, monitorRAM.porcentaje)
}

//Esta funcion es utilizada para obtener toda la informacion de los procesos. Hace uso del dato del total de la RAM calculado anteriormente
func leerProcesos() {
	archivos, err := ioutil.ReadDir("/proc/")
	if err != nil {
		log.Fatal(err)
	}

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
				fmt.Printf("PID: %s, Nombre: %s, Usuario: %s, Estado: %s, Porcentaje: %g \n", limpiarProc(archivoCortado[5]), limpiarProc(archivoCortado[0]),
					limpiarUsuario(archivoCortado[8]), limpiarEstado(archivoCortado[2]), (buscarPorcentajeRam(archivoCortado[17])))

			}
		}
	}

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

//Esta funcion devuelve del UID del usuario de un proceso
func limpiarUsuario(cadena string) string {
	cortado := strings.Split(cadena, ":")
	sinEspacios := strings.TrimSpace(cortado[1])
	final := strings.Fields(sinEspacios)
	return final[0]
}

//Esta funcion devuelve solo la letra del estado en el que esta un proceso
func limpiarEstado(cadena string) string {
	cortado := strings.Split(cadena, ":")
	sinEspacios := strings.TrimSpace(cortado[1])
	final := strings.Fields(sinEspacios)
	return final[0]
}
