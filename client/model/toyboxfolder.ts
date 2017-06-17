import ToyBoxItem from './toyboxitem';
import ToyBoxConfig from './toyboxconfig';

export default class ToyBoxFolder extends ToyBoxItem {
    //追加されているアイテムのリスト
    public items:{[key: number]: ToyBoxItem;};

    //コンフィグファイル
    public config:ToyBoxConfig;

    //ミスリルビューで使用する
    public addItems:Array<ToyBoxItem>;
    //public deleteItemIDs:Array<number>;

    constructor(parent:ToyBoxFolder,ID:number,info:Object = null){
        super(parent,ID);
        this.items = {};

        this.addItems = new Array();
        //this.deleteItemIDs = new Array();

        if(info){
            //ロード情報にしたがってフォルダを構成する
        }else{
            //コンフィグファイルを作成
            this.config = new ToyBoxConfig(this,this.ID+1);
            this.addItem(this.config);

            this.name = '新規フォルダ';
        }
    }

    //ToyBoxManagerを通して利用する
    public addItem(item:ToyBoxItem,order:number = null){
        this.items[item.ID] = item;
        this.addItems.push(item);
    }

    //ToyBoxManagerを通して利用する
    public deleteItem(itemID:number){

    }
}