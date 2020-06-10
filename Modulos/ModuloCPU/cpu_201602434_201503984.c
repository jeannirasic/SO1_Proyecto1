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

int cont = 0;
void dfs(struct task_struct *task, struct seq_file * m, int num)
{
  struct task_struct *task_next;
  struct list_head *list;
  
  int tmp = cont;
  cont = cont + num;
  
  list_for_each(list, &task->children) {
    task_next = list_entry(list, struct task_struct, sibling);

    if(task_next == 0){
        continue;
    }
    int x;
    for(x = 0; x<cont;x+=1)
    {
        seq_printf(m,"|     ");
    }
    seq_printf(m,"├── ");
    
    //============= PID ==================
    seq_printf(m,"PID:%d       ",task_next->pid);
    //seq_printf(m,"%s","	");
	//============ NOMBRE ==================
    seq_printf(m,"Nombre:%s       ",task_next->comm);
    //seq_printf(m,"%s","			");
    //============ ESTADO ==================
    if(task_next->state == -1){
        seq_printf(m,"Estado:NOT EXECUTABLE");
    }else if(task_next->state == 0){
        seq_printf(m,"Estado:RUNNING");
    }else if(task_next->state == 1){
        seq_printf(m,"Estado:INTERRUPTIBLE");
    }else if(task_next->state == 2){
        seq_printf(m,"Estado:UNINTERRUPTIBLE");
    }else if(task_next->state == 4){
        seq_printf(m,"Estado:ZOMBIE");
    }else if(task_next->state == 8){
        seq_printf(m,"Estado:STOPPED");
    }else{
        seq_printf(m,"Estado:EXCLUSIVE");
    }
	seq_printf(m,"\n");
    dfs(task_next, m, 1);
  }
  cont = tmp;
}

static int escribir_archivo(struct seq_file * m, void *v) {	
    seq_printf(m, " __________________________________________________\n");
    seq_printf(m, "| Lab. Sistemas Operativos 1                       |\n");
    seq_printf(m, "| Vacaciones de Junio 2020                         |\n");
    seq_printf(m, "| Jeannira Del Rosario Sic Menéndez - 201602434    |\n");
    seq_printf(m, "| Fernando Vidal Ruiz Piox - 201503984             |\n");
    seq_printf(m, "|                                                  |\n");
    seq_printf(m, "|      PROYECTO (MODULO 2 - PROCESOS CPU)          |\n");
    seq_printf(m, "|__________________________________________________|\n");
    seq_printf(m, "        Sistema Operativo: Ubuntu 18.4\n\n");
    
    cont = 0;
    dfs(&init_task, m, 0);
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
