import ToyBoxFolder from './toyboxfolder';

export default class ToyBoxItem {
    public name:string;

    //編集中(未セーブ状態)かどうか
    public edit:boolean;
    //編集モード(設定編集状態、エディタ編集状態など)
    public editMode:string;

    public ID:number;

    public parent:ToyBoxFolder;

    constructor(name:string,parent:ToyBoxFolder){
        this.name = name;
        this.parent = parent;
        this.edit = false;
    }
}