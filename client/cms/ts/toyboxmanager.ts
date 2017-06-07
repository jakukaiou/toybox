import ToyBoxItem from './model/toyboxitem';
import ToyBoxFile from './model/toyboxfile';
import ToyBoxFolder from './model/toyboxfolder';
import ToyBoxConfig from './model/toyboxconfig';
import * as _ from 'lodash';

export default class ToyBoxManager {
    public site:string = 'toybox project';

    public side:boolean = true;
    private sideLock:boolean = false;

    private editmode:string = 'none';


    public root:ToyBoxFolder;

    constructor(){
        this.root = new ToyBoxFolder('root');
        this.root.addItem(new ToyBoxFile('ファイル名'));
        this.root.addItem(new ToyBoxFolder('folder'));
        this.root.addItem(new ToyBoxConfig('config'));

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