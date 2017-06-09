import ToyBoxItem from './toyboxitem';
import ToyBoxConfig from './toyboxconfig';

export default class ToyBoxFolder extends ToyBoxItem {
    public items:Array<ToyBoxItem>;

    //ミスリルビューで使用する
    public addItems:Array<ToyBoxItem>;
    public deleteItems:Array<ToyBoxItem>;

    constructor(name:string,parent:ToyBoxFolder){
        super(name,parent);
        this.items = new Array();
        this.addItems = new Array();
        this.deleteItems = new Array();
        const initconfig:ToyBoxConfig = new ToyBoxConfig('設定ファイル',this);

        this.addItem(initconfig);
    }

    public addItem(item:ToyBoxItem,order:number = null){
        this.items.push(item);
        this.addItems.push(item);
    }
}