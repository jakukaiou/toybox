import ToyBoxItem from '../../model/toyboxitem';
import ToyBoxFile from '../../model/toyboxfile';
import ToyBoxFolder from '../../model/toyboxfolder';
import ToyBoxConfig from '../../model/toyboxconfig';

import FirebaseControl from './../../firebase/fireBaseControl';

import * as _ from 'lodash';

export default class ToyBoxManager {
    //サイト名
    public site:string = 'toybox project';

    //Firebase
    public firebase:FirebaseControl;

    //編集ターゲット保存用の内部変数
    private _target:ToyBoxItem = null;

    //新規作成アイテムに割り当てるID
    private _nextID:number;

    //ルートフォルダ以外のアイテムデータの保存配列
    private items:{[key: number]: ToyBoxItem;};

    //ルートディレクトリ
    public root:ToyBoxFolder;

    //CMSのビュー制御情報が入るオブジェクト
    public view:ToyBoxManagerView;

    constructor(){
        //toyboxのビュー制御オブジェクト
        this.view = new ToyBoxManagerView();

        //Firebaseの制御オブジェクト
        this.firebase = new FirebaseControl();

        //アイテムのルートフォルダ
        this.root = new ToyBoxFolder(null,0,null);
        this.root.name = 'Root';

        //アイテム配列の初期化
        this.items = {};

        if(this.itemDataLoad()){
            this._nextID = _.size(this.items);
        }else{
            this._nextID = 0;
            this.items[this.nextID] = this.root.folderConfig;
        }
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

    get target(){
        return this._target;
    }

    //新規に作成したアイテムのID
    get nextID(){
        this._nextID++;
        return this._nextID;
    }

    //FirebaseのDBからアイテムデータをロード
    public itemDataLoad() {
        return false;
    }

    //ファイルを新規作成
    public addFile(parent:ToyBoxFolder){
        const newFileID:number = this.nextID;
        const newFile:ToyBoxFile = new ToyBoxFile(parent,newFileID);

        //managerに新規作成フォルダの情報を追加
        this.items[newFileID] = newFile;

        //parentに作成したファイルを追加
        parent.addItem(newFile);
    }

    //フォルダを新規作成
    public addFolder(parent:ToyBoxFolder){
        const newFolderID:number = this.nextID;
        const newFolder:ToyBoxFolder = new ToyBoxFolder(parent,newFolderID);

        //managerに新規作成フォルダの情報を追加
        this.items[newFolderID] = newFolder;

        //parentに作成したフォルダを追加
        parent.addItem(newFolder);

        //コンフィグファイルをitemsに格納
        this.items[this.nextID] = newFolder.folderConfig;
    }
}

class ToyBoxManagerView {
    //サイドが開いているかどうか
    private _side:boolean;

    //サイドがロックされているかどうか
    private _sideLock:boolean;

    //フェードレイヤーが有効かどうか
    public fade:boolean;

    //ファイルの追加メニューを表示するかどうか
    public addFile:boolean;

    //編集モード
    //fileEdit:ファイル内容編集 configEdit:コンフィグ定義編集 configSet:コンフィグ編集 none:初期状態
    public editmode:string;

    constructor(){
        this._side = true;
        this._sideLock = true;
        this.addFile = false;
        this.fade = false;
        this.addFile = false;
        this.editmode = 'none';

        this.setStartMode();
    }

    //サイドが開いているかどうか
    set sideOpen (bool:boolean){
        if(!this._sideLock){
            this._side = bool;
        }
    }

    get sideOpen():boolean {
        return this._side;
    }

    //サイドバーをロック
    public sideLock() {
        this._sideLock = true;
    }

    //サイドバーをアンロック
    public sideUnLock() {
        this._sideLock = false;
    }

    //ファイル編集モードに変更
    public setFileEditMode() {
        this.editmode = 'fileEdit';
        this.sideUnLock();
        this.sideOpen = false;
    }

    //コンフィグ定義編集モードに変更
    public setConfigEditMode() {
        this.editmode = 'configEdit';
        this.sideLock();
    }

    //コンフィグ編集モードに変更
    public setConfigMode() {
        this.editmode = 'configSet';
        this.sideLock();
    }

    //初期モードに変更
    public setStartMode() {
        this.editmode = 'none';
        this._sideLock;
    }
}