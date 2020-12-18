import { endereco } from './endereco';

export class Cliente{
    constructor(
        public id:number = null,
        public nome:string = null, 
        public rendimentoMes:number = null, 
        public risco:string = null,
        public endereco:endereco = null){

    }
}