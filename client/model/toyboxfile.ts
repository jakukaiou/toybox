import ToyBoxItem from './toyboxitem';
import ToyBoxFolder from './toyboxfolder';

export default class ToyBoxFile extends ToyBoxItem {

    constructor(parent:ToyBoxFolder,ID:number,info:Object = null){
        super(parent,ID);

        if(info){
            //ロード情報にしたがってコンフィグを構成する
        }else{
            this.name = '新規ファイル';
        }
    }
}