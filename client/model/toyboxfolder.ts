import ToyBoxItem from './toyboxitem';
import ToyBoxConfig from './toyboxconfig';
import * as _ from 'lodash';

export default class ToyBoxFolder extends ToyBoxItem {
    //追加されているアイテムのリスト
    public items:{[key: number]: ToyBoxItem;};

    //フォルダのコンフィグファイル
    public folderConfig:ToyBoxConfig;

    //フォルダにファイルが追加されたときtrueになる
    private fileAdded:boolean;

    constructor(parent:ToyBoxFolder,ID:number,info:Object = null){
        let configs = (parent)? parent.childconfig:null;
        super(parent,ID,configs);
        this.items = {};
        this.fileAdded = false;

        if(info){
            //ロード情報にしたがってフォルダを構成する
        }else{
            //コンフィグファイルを作成
            this.folderConfig = new ToyBoxConfig(this,this.ID+1);
            this.addItem(this.folderConfig);

            this.name = '新規フォルダ';
        }
    }

    //アイテムを追加 ToyBoxManagerを通して利用する
    public addItem(item:ToyBoxItem,order:number = null){
        this.items[item.ID] = item;
        this.fileAdded = true;
    }

    //アイテムを削除 ToyBoxManagerを通して利用する
    public deleteItem(itemID:number){

    }

    get childconfig(){
        return _.compact(_.concat(this.configs,this.folderConfig));
    }

    get itemUpdate(){
        return this.fileAdded;
    }


    //ファイル追加の反映を通知
    public reflected(){
        this.fileAdded = false;
    }
}