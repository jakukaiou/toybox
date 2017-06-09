import ToyBoxItem from './model/toyboxitem';
import ToyBoxFile from './model/toyboxfile';
import ToyBoxFolder from './model/toyboxfolder';
import ToyBoxConfig from './model/toyboxconfig';
import * as _ from 'lodash';

export default class ToyBoxManager {
    public site:string = 'toybox project';

    //ファイルの追加メニューを表示するかどうか
    public addFile:boolean = false;

    public side:boolean = true;
    private sideLock:boolean = false;

    public target:ToyBoxItem = null;
    private editmode:string = 'none';


    public root:ToyBoxFolder;

    constructor(){
        this.root = new ToyBoxFolder('root',this.root);

        _.each(this.root.items,(item:ToyBoxItem)=>{
            //クラス名取得
            console.log(item.constructor.name);

            //型変換
            if(item.constructor.name === 'ToyBoxFolder'){
                let folder = <ToyBoxFolder>item;
            }
        });
    }

    set sideOpen (bool:boolean){
        if(!this.sideLock){
            this.side = bool;
        }
    }

    get sideOpen():boolean {
        return this.side;
    }
}