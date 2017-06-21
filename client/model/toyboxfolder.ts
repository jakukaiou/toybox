import ToyBoxItem from './toyboxitem';
import ToyBoxConfig from './toyboxconfig';
import * as _ from 'lodash';

export default class ToyBoxFolder extends ToyBoxItem {
    //追加されているアイテムのリスト
    public items:{[key: number]: ToyBoxItem;};

    //フォルダのコンフィグファイル
    public folderConfig:ToyBoxConfig;

    //ミスリルビューで使用する
    public addItems:Array<ToyBoxItem>;
    //public deleteItemIDs:Array<number>;

    constructor(parent:ToyBoxFolder,ID:number,info:Object = null){
        let configs = (parent)? parent.childconfig:null;
        super(parent,ID,configs);
        this.items = {};

        this.addItems = new Array();

        if(info){
            //ロード情報にしたがってフォルダを構成する
        }else{
            //コンフィグファイルを作成
            this.folderConfig = new ToyBoxConfig(this,this.ID+1);
            this.addItem(this.folderConfig);

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

    get childconfig(){
        return _.compact(_.concat(this.configs,this.folderConfig));
    }
}