import ToyBoxItem from './toyboxitem';
import ToyBoxFolder from './toyboxfolder';

import ToyBoxTagConfig from './toyboxtagconfig';
import ToyBoxLinkConfig from './toyboxlinkconfig';

import * as TB from '../common/const';

export default class ToyBoxConfig extends ToyBoxItem {
    //ファイル設定
    public fileTagProp:Array<ToyBoxTagConfig>;
    public fileLinkProp:Array<ToyBoxLinkConfig>;

    //フォルダ設定
    private folderTagProp:Array<ToyBoxTagConfig>;
    private folderLinkProp:Array<ToyBoxLinkConfig>;

    //コンフィグに新規プロパティが追加されたときtrueになる
    private propAdded:boolean;

    //コンフィグのプロパティが削除されたときtrueになる
    private propRemoved:boolean;

    constructor(parent:ToyBoxFolder,ID:number,info:Object = null){
        super(parent,ID,null);

        this.propAdded = false;

        if(info){
            //ロード情報にしたがってコンフィグを構成する
        }else{
            this.name = 'コンフィグファイル';
            this.fileTagProp = new Array();
            this.fileLinkProp = new Array();
        }
    }

    public addTagConfig = (type:number)=>{
        switch(type){
            case TB.CONFIGTYPE.FILE:
                this.fileTagProp.push(new ToyBoxTagConfig());
                break;
            case TB.CONFIGTYPE.FOLDER:
                this.folderTagProp.push(new ToyBoxTagConfig());
                break;
        }
        this.propAdded = true;
    }

    public deleteTagConfig = (type:number,configNumber:number)=>{
        switch(type){
            case TB.CONFIGTYPE.FILE:
                this.fileTagProp.splice(configNumber,1);
                break;
            case TB.CONFIGTYPE.FOLDER:
                this.folderTagProp.splice(configNumber,1);
                break;
        }
        this.propRemoved = true;
    }

    public addLinkConfig = ()=>{
        //this.linkProp.push(new LinkConfig());
        this.propAdded = true;
    }

    get propUpdate(){
        return this.propAdded;
    }

    get propRemove(){
        return this.propRemoved;
    }

    //プロパティ追加の反映を通知
    public reflected(){
        this.propAdded = false;
        this.propRemoved = false;
    }
}

