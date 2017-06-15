import ToyBoxItem from '../../model/toyboxitem';
import ToyBoxFile from '../../model/toyboxfile';
import ToyBoxFolder from '../../model/toyboxfolder';
import ToyBoxConfig from '../../model/toyboxconfig';

import * as _ from 'lodash';

export default class ToyBoxManager {
    //サイト名
    public site:string = 'toybox project';

    //編集ターゲット保存用の内部変数
    private _target:ToyBoxItem = null;

    //新規作成アイテムに割り当てるID
    private _nextID:number;

    //ルートディレクトリ
    public root:ToyBoxFolder;

    //アイテムデータの保存配列
    private items:{[key: number]: ToyBoxItem;};

    //CMSのビュー制御情報が入るオブジェクト
    public view:ToyBoxManagerView;

    constructor(){
        //toyboxのビュー制御オブジェクト
        this.view = new ToyBoxManagerView();
    }

    //ターゲット変更用のsetter
    set target(target:ToyBoxItem) {
        if(this._target){
            //ターゲットが編集中でなければターゲットを変更する
            if(!this._target.edit){
                this._target = target;
            }
        }else{
            this._target = target;
        }
    }
}

class ToyBoxManagerView {
    //サイドが開いているかどうか
    private _side:boolean;

    //サイドがロックされているかどうか
    private _sideLock:boolean = false;

    //フェードレイヤーが有効かどうか
    public fade:boolean;

    //ファイルの追加メニューを表示するかどうか
    public addFile:boolean = false;

    //編集モード
    public editmode:string = 'file';

    constructor(){
        this._side = false;
        this.fade = false;
        this.addFile = false;
    }

    //サイドが開いているかどうか
    set sideOpen (bool:boolean){
        if(!this.sideLock){
            this._side = bool;
        }
    }

    get sideOpen():boolean {
        return this._side;
    }

    public sideLock() {
        this._sideLock = true;
    }

    public sideUnLock() {
        this._sideLock = false;
    }
}