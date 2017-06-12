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

    public _target:ToyBoxItem = null;
    public editmode:string = 'config';

    private _nextID:number;


    public root:ToyBoxFolder;

    constructor(){
        this._nextID = 0;

        this.root = new ToyBoxFolder('root',this.root,this.nextID);

        const initconfig:ToyBoxConfig = new ToyBoxConfig('設定ファイル',this.root,this.nextID);
        this.addItem(this.root,initconfig);

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

    set target(target:ToyBoxItem) {
        if(this._target){
            if(!this._target.edit){
                this._target = target;
            }
        }else{
            this._target = target;
        }
    }

    get target():ToyBoxItem {
        return this._target;
    }

    get nextID():number {
        this._nextID++;
        return this._nextID;
    }

    public addItem(folder:ToyBoxFolder,item:ToyBoxItem){
        folder.addItem(item);
        if(item.constructor.name === 'ToyBoxFolder'){
            const newFolder:ToyBoxFolder = <ToyBoxFolder>item;
            newFolder.addItem(new ToyBoxConfig('設定ファイル',newFolder,this.nextID));
        }
    }
}