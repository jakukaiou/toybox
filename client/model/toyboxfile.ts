import ToyBoxItem from './toyboxitem';
import ToyBoxFolder from './toyboxfolder';
import ToyBoxConfig from './toyboxconfig';

export default class ToyBoxFile extends ToyBoxItem {

    constructor(parent:ToyBoxFolder,ID:number,info:Object = null){
        super(parent,ID,parent.childconfig);

        if(info){
            //ロード情報にしたがってコンフィグを構成する
        }else{
            this.name = '新規ファイル';
        }
    }
}