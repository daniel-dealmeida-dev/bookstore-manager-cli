


export class Author{
    constructor(
        public readonly id: string | null,
        public readonly name: String,
        public readonly nationality: string
    ){
        if (!name || name.trim().length < 3){
            throw new Error("O nome do autor deve ter ao menos 3 caracteres.");
        }
    }


}