import ToyBoxItem from './toyboxitem';
import ToyBoxFolder from './toyboxfolder';

import TagConfig from './toyboxtagconfig';
import LinkConfig from './toyboxlinkconfig';

export default class ToyBoxConfig extends ToyBoxItem {
    //ファイル設定
    private fileTagProp:Array<TagConfig>;
    private fileLinkProp:Array<LinkConfig>;

    //フォルダ設定
    private folderTagProp:Array<TagConfig>;
    private folderLinkProp:Array<LinkConfig>;


    constructor(parent:ToyBoxFolder,ID:number,info:Object = null){
        super(parent,ID,null);

        if(info){
            //ロード情報にしたがってコンフィグを構成する
        }else{
            this.name = 'コンフィグファイル';
        }
    }

    public addTagConfig = ()=>{
        //this.tagProp.push(new TagConfig());
    }

    public addLinkConfig = ()=>{
        //this.linkProp.push(new LinkConfig());
    }
}

