import ToyBoxItem from './toyboxitem';
import ToyBoxConfig from './toyboxconfig';

export default class ToyBoxFolder extends ToyBoxItem {
    public items:{[key: number]: ToyBoxItem;};
    public addItemID:number;

    //ミスリルビューで使用する
    public addItems:Array<ToyBoxItem>;
    public deleteItemIDs:Array<number>;

    constructor(name:string,parent:ToyBoxFolder,ID:number){
        super(name,parent,ID);
        this.items = {};
        this.addItemID = 0;

        this.addItems = new Array();
        this.deleteItemIDs = new Array();
    }

    public addItem(item:ToyBoxItem,order:number = null){
        this.items[this.addItemID] = item;
        this.addItems.push(item);

        this.addItemID++;
    }
}