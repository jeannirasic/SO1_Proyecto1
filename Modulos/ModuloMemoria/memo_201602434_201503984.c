#include <linux/proc_fs.h>
#include <linux/seq_file.h> 
#include <asm/uaccess.h> 
#include <linux/hugetlb.h>
#include <linux/module.h>
#include <linux/init.h>
#include <linux/kernel.h>   
#include <linux/fs.h>

#define BUFSIZE  	150

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Escribir informaciond de la memoria RAM.");
MODULE_AUTHOR("Jeannira Del Rosario Sic Menéndez - 201602434\nFernando Vidal Ruiz Piox -  201503984");

struct sysinfo inf;

static int escribir_archivo(struct seq_file * archivo, void *v) {	
    si_meminfo(&inf);
    long total_memoria 	= (inf.totalram * 4);
    long memoria_libre 	= (inf.freeram * 4 );
    seq_printf(archivo, " __________________________________________________\n");
    seq_printf(archivo, "| Lab. Sistemas Operativos 1                       |\n");
    seq_printf(archivo, "| Vacaciones de Junio 2020                         |\n");
    seq_printf(archivo, "| Jeannira Del Rosario Sic Menéndez - 201602434    |\n");
    seq_printf(archivo, "| Fernando Vidal Ruiz Piox - 201503984             |\n");
    seq_printf(archivo, "|                                                  |\n");
    seq_printf(archivo, "|       PROYECTO (MODULO 1 - MEMORIA RAM)          |\n");
    seq_printf(archivo, "|__________________________________________________|\n");
    seq_printf(archivo, "  Sistema Operativo: Ubuntu 18.4\n");
    seq_printf(archivo, "  Memoria Total : \t %8lu KB - %8lu MB\n",total_memoria, total_memoria / 1024);
    seq_printf(archivo, "  Memoria Libre : \t %8lu KB - %8lu MB \n", memoria_libre, memoria_libre / 1024);
    seq_printf(archivo, "  Memoria en uso: \t %i %%\n", (total_memoria - memoria_libre * 100)/total_memoria) ;
    return 0;
}

static int al_abrir(struct inode *inode, struct  file *file) {
  return single_open(file, escribir_archivo, NULL);
}

static struct file_operations operaciones =
{    
    .open = al_abrir,
    .read = seq_read
};

static int iniciar(void)
{
    proc_create("memo_201602434_201503984", 0, NULL, &operaciones);
    printk(KERN_INFO "Carnet1:201602434\nCarnet2: 201503984\n");
    return 0;
}
 
static void salir(void)
{
    remove_proc_entry("memo_201602434_201503984", NULL);
    printk(KERN_INFO "Curso: Sistemas Operativos 1\n");
}
 
module_init(iniciar);
module_exit(salir); 
