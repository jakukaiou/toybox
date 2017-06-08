import ToyBoxItem from './toyboxitem';

export default class ToyBoxFolder extends ToyBoxItem {
    public items:Array<ToyBoxItem>;

    constructor(name:string,parent:ToyBoxFolder){
        super(name,parent);
        this.items = new Array();
    }

    public addItem(item:ToyBoxItem,order:number = null){
        this.items.push(item);
    }
}