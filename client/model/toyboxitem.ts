import ToyBoxFolder from './toyboxfolder';
import ToyBoxConfig from './toyboxconfig';

export default class ToyBoxItem {
    public name:string;

    //編集中(未セーブ状態)かどうか
    public edit:boolean;
    //編集モード(設定編集状態、エディタ編集状態など)
    public editMode:string;

    public ID:number;

    public parent:ToyBoxFolder;

    public configs:Array<ToyBoxConfig>;

    constructor(parent:ToyBoxFolder,ID:number,configs:Array<ToyBoxConfig>){
        this.ID = ID;
        this.parent = parent;
        this.edit = false;
        this.configs = configs;
    }
}