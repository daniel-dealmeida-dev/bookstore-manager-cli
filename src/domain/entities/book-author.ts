


export class Author{
    constructor(
        public readonly id: String | null,
        public readonly nome: String,
        public readonly nacionalidade: string
    ){
        if (!nome || nome.trim().length < 3){
            throw new Error("O nome do autor deve ter ao menos 3 caracteres.");
        }
    }


}