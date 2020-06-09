#include <linux/proc_fs.h>
#include <linux/seq_file.h> 
#include <asm/uaccess.h> 
#include <linux/hugetlb.h>
#include <linux/module.h>
#include <linux/init.h>
#include <linux/kernel.h>   
#include <linux/fs.h>

#include <linux/sched.h>        // for_each_process, pr_info
#include <linux/sched/signal.h> 


MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Escribir informacion del cpu.");
MODULE_AUTHOR("Jeannira Del Rosario Sic Menéndez - 201602434\nFernando Vidal Ruiz Piox -  201503984");


static int escribir_archivo(struct seq_file * m, void *v) {	
    seq_printf(m, " __________________________________________________\n");
    seq_printf(m, "| Lab. Sistemas Operativos 1                       |\n");
    seq_printf(m, "| Vacaciones de Junio 2020                         |\n");
    seq_printf(m, "| Jeannira Del Rosario Sic Menéndez - 201602434    |\n");
    seq_printf(m, "| Fernando Vidal Ruiz Piox - 201503984             |\n");
    seq_printf(m, "|                                                  |\n");
    seq_printf(m, "|      PROYECTO (MODULO 2 - PROCESOS CPU)          |\n");
    seq_printf(m, "|__________________________________________________|\n");
    seq_printf(m, "  Sistema Operativo: Ubuntu 18.4\n");
    
    
    struct task_struct* task_list;
	seq_printf(m,"%s","Processes:\n");

    seq_printf(m,"PID ");
    seq_printf(m,"%s","	");
	seq_printf(m,"NOMBRE");
    seq_printf(m,"%s","			");
	seq_printf(m,"ESTADO");	
    seq_printf(m,"%s","\n");
	
    for_each_process(task_list) {
		//============= PID ==================
        seq_printf(m,"%d",task_list->pid);
        seq_printf(m,"%s","	");
		//============ NOMBRE ==================
        seq_printf(m,"%s",task_list->comm);
        seq_printf(m,"%s","			");
        //============ ESTADO ==================
		seq_printf(m,"%s",task_list->state);
        seq_printf(m,"%lu","\n");
    }
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
    proc_create("cpu_201602434_201503984", 0, NULL, &operaciones);
    printk(KERN_INFO "nombre1:Jeannira Del Rosario Sic Menéndez\nnombre2: Fernando Vidal Ruiz Piox\n");
    return 0;
}
 
static void salir(void)
{
    remove_proc_entry("cpu_201602434_201503984", NULL);
    printk(KERN_INFO "Curso: Sistemas Operativos 1\n");
}
 
module_init(iniciar);
module_exit(salir); 
