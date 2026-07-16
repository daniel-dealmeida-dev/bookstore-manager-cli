export class Book{
    constructor(
        public id: number,
        public title: string,
        public authorId: number,
        public availableQuantity: number
    ){}
}