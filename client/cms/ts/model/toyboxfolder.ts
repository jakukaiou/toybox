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
        this.items = new Array();
        this.addItemID = 0;

        this.addItems = new Array();
        this.deleteItemIDs = new Array();
        //const initconfig:ToyBoxConfig = new ToyBoxConfig('設定ファイル',this);

        //this.addItem(initconfig);
    }

    public addItem(item:ToyBoxItem,order:number = null){
        item.ID = this.addItemID;

        this.items[item.ID] = item;
        this.addItems.push(item);

        this.addItemID++;
    }
}