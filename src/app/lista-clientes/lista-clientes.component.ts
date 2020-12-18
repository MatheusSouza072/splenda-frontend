import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../clientes/clientes.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Command } from 'protractor';
import { Cliente } from 'src/model/cliente';
import { endereco } from 'src/model/endereco';
import { Emprestimo } from 'src/model/Emprestimo';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit {

  clientes: Array<any>;
  items: MenuItem[];
  displaySaveDialog: boolean = false;
  displaySimulaDialog: boolean = false;

  cliente: Cliente = {
       id: null,
       nome: null,
       rendimentoMes: null,
       risco: null,
       endereco: null
   }
   endereco: endereco = {
       id: null,
       numero:null,
       bairro: null,
       cep:null,
       cidade: null,
       estado:null
        }

  clienteSelecionado: Cliente = {
        id: null,
        nome: null,
        rendimentoMes: null,
        risco: null,
        endereco: null
  }

  emprestimo: Emprestimo = {
      valor: null,
      duracao: null,
      taxa: null,
      total: null,
      valorPrestacao: null
  }

  constructor(private clienteService: ClientesService, private messageService: MessageService) { }

  showSaveDialog(editar: boolean){
      if(editar){
        if(this.clienteSelecionado != null && this.clienteSelecionado.id != null){
          this.cliente = this.clienteSelecionado;
          this.endereco = this.clienteSelecionado.endereco;
        } else {
          this.messageService.add({severity: 'warn', summary: "Advertencia!", detail: "Selecione um registro"})
          return;
        }
      } else {
        this.cliente = new Cliente();
        this.endereco = new endereco();
      }
      this.displaySaveDialog = true;
  }

  showSimulaDialog(){
    if(this.clienteSelecionado != null && this.clienteSelecionado.id != null){
      this.emprestimo = new Emprestimo();
      this.defineTaxaJuros();
    } else {
      this.messageService.add({severity: 'warn', summary: "Advertencia!", detail: "Selecione um registro"})
      return;
    }
    this.displaySimulaDialog = true;
  }

  save(){
    this.cliente.endereco = this.endereco;
    this.clienteService.save(this.cliente).subscribe(
      (result:any) => {
        let cliente = result as Cliente;
        this.validarCliente(cliente);
        this.messageService.add({severity: 'success', summary: "Resultado", detail: "Cliente salvo com sucesso"});
        this.displaySaveDialog = false;
      },
      error => {
        console.log(error);
      }
    )
  }

  defineRisco(){
    if (this.cliente.rendimentoMes != null){
      if (this.cliente.rendimentoMes > 8000){
        this.cliente.risco = "A";
      } else if (this.cliente.rendimentoMes > 2000 && this.cliente.rendimentoMes <= 8000){
        this.cliente.risco = "B";
      } else {
        this.cliente.risco = "C";
      }
    }
  }

  delete(){
    if(this,this.clienteSelecionado == null || this.clienteSelecionado.id == null){
      this.messageService.add({severity: 'warn', summary: "Advertencia!", detail: "Selecione um registro"})
      return;
    }

    this.clienteService.delete(this.clienteSelecionado.id).subscribe(
      (result:any) =>{
        this.messageService.add({severity: 'success', summary: "Excluído", detail: "Cliente " + result.nome + " foi excluido com sucesso"});
        this.deleteObject(result.id);
      }
    )

  }

  simulacao(){
    if(this.emprestimo != null){
      this.clienteService.simulacao(this.emprestimo).subscribe(
        (result:any) => {
          this.emprestimo = result as Emprestimo;

        },
        error => {
          console.log(error);
        }
      )
    }
  }

  deleteObject(id: number){
    let index = this.clientes.findIndex((e) => e.id == id);

    if(index != -1){
      this.clientes.splice(index, 1);
    }
  }

  validarCliente(cliente: Cliente){
    let index = this.clientes.findIndex((e) => e.id == cliente.id);

    if(index != -1){
        this.clientes[index] = cliente;
    } else {
      this.clientes.push(cliente);
    }

  }

  defineTaxaJuros(){
    if(this.clienteSelecionado.risco == "A"){
      this.emprestimo.taxa = 1.9;
    } else if (this.clienteSelecionado.risco == "B"){
      this.emprestimo.taxa = 5;
    } else {
      this.emprestimo.taxa = 10;
    }
  }

  ngOnInit() {

    this.clienteService.listar()
      .subscribe(response => this.clientes = response )

    this.items = [
      {
        label: "Novo",

        command : ()=> this.showSaveDialog(false)
      },
      {
        label: "Editar",

        command : ()=> this.showSaveDialog(true)
      },
      {
        label: "Excluir",

        command : ()=> this.delete()
      },
      {
        label: "Simulação",

        command : ()=> this.showSimulaDialog()
      }


    ]


  }
}
