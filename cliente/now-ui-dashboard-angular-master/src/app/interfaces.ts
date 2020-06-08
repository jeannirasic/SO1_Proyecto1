export interface Resumen {
    ejecucion: number;
    suspendidos: number;
    detenidos: number;
    zombie: number;
    total: number;
}

export interface Procesos {
    pid: number;
    nombre: string;
    usuario: string;
    estado: string;
    ram: number;
    booleano?: boolean;
}

export interface ProcesoArbol {
    key: number;
    name: string;
    parent?: number;
}

