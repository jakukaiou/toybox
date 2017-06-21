/// <reference path="../../../node_modules/@types/mithril/index.d.ts" />

import ToyBoxManager from './toyboxmanager';
import FirebaseControl from './../../firebase/fireBaseControl';
import * as m from 'mithril';
import * as c from 'classnames';
import * as _ from 'lodash';

import ToyBoxItem from '../../model/toyboxitem';
import ToyBoxFile from '../../model/toyboxfile';
import ToyBoxFolder from '../../model/toyboxfolder';
import ToyBoxConfig from '../../model/toyboxconfig';

import ToyBoxEditor from '../../component/basic/editor';

import * as TB from '../../common/const';

class Test {
    //クラスをnewしないタイプのmithrilViewを検討する
    //以下のようなmithrilComponentを返す関数を作成するようにする？
    public static makeTab(){
        return {
            oninit:(vnode:m.VnodeDOM<{},{}>)=>{
                console.log('makeTab!!');
            },
            view:(vnode:m.VnodeDOM<{},{}>)=>{
                return m('div','makeTabtest');
            }
        }
    }
}

class ComponentBasic implements m.Component<{},{}> {
    public oninit:(vnode:m.VnodeDOM<{},{}>)=>void;
    public oncreate:(vnode:m.VnodeDOM<{},{}>)=>void;
    public onbeforeupdate:(vnode:m.VnodeDOM<{},{}>,old)=>boolean;
    public onupdate:(vnode:m.VnodeDOM<{},{}>)=>void;
    public onbeforeremove:(vnode:m.VnodeDOM<{},{}>)=>void;
    public onremove:(vnode:m.VnodeDOM<{},{}>)=>void;

    public view:(vnode:m.VnodeDOM<{},{}>)=> m.Vnode<{},{}>[];

    constructor() {
        
    }
}

class ToyBoxRoot extends ComponentBasic {
    private bookID:number;

    private sidebar:ComponentBasic;
    private nav:ComponentBasic;
    private mainView:ComponentBasic;

    private manager:ToyBoxManager;

    constructor(manager:ToyBoxManager) {
        super();

        this.manager = manager;

        this.oninit = (vnode)=> {
            this.bookID = vnode.attrs['id'];
            this.sidebar = new ToyBoxSideBar(manager);
            this.nav = new ToyBoxNav(manager);
            this.mainView = new ToyBoxMainView(manager);
        }

        this.view = (vnode)=> {
            return [
                m(this.nav),
                m('div',{class: 'f-toybox_base-container'},[
                    m(this.sidebar),
                    m(this.mainView),
                    m('div',{class: c('l-toybox_fadeLayer',(this.manager.view.sideOpen && this.manager.view.editmode === 'fileEdit')? 'is-active':null)})
                ])
            ]
        };
    }
}

class ToyBoxNav extends ComponentBasic {
    constructor(manager:ToyBoxManager) {
        super();

        this.oninit = (vnode)=> {
            
        }

        this.view = (vnode)=> {
            return [
                m("nav.nav.l-toybox_nav",[
                    m(".nav-left", 
                        m("a.nav-item", 
                            m("span.c-toybox_name",'ToyBox')
                        )
                    ),
                    m(".nav-center", 
                        m("a.nav-item.c-toybox_target",'Edit Target')
                    ),
                    m("span.nav-toggle",[
                        m("span"),
                        m("span"),
                        m("span")]),
                    m(".nav-right.nav-menu", 
                        m(".nav-item", 
                            m(".field.is-grouped",[
                                m("p.control", 
                                    m("a.c-toybox_saveButton.button",[
                                            m("span.icon", 
                                                m("i.fa.fa-floppy-o")),
                                            m("span.description",'保存')]
                                    )
                                ),
                                m("p.control", 
                                    m("a.c-toybox_deleteButton.button",[
                                            m("span.icon", 
                                                m("i.fa.fa-cut")
                                            ),
                                            m("span.description",'削除')
                                        ]
                                    )
                                )]
                            )
                        )
                    )
                ]
            )]
        };
    }
}

class ToyBoxSideBar extends ComponentBasic {
    private itemNodes:{[key: string]: ToyBoxSideItem;};

    private manager:ToyBoxManager;

    constructor(manager:ToyBoxManager) {
        super();
        this.itemNodes = {};
        this.manager = manager;

        this.oninit = (vnode)=>{
            this.makeItem(manager,manager.root.addItems);
        }

        this.onupdate = (vnode)=> {
            if(_.size(this.manager.root.addItems)){
                this.makeItem(manager,this.manager.root.addItems);
            }
        }

        this.view = (vnode)=> {

            return [
                m('div',{class:'f-toybox_side-container',},[
                    m('div',{class:c('l-toybox_side',(this.manager.view.sideOpen)? 'is-active':null)},[
                        m('div',{class:c('c-toybox_siteTitleBar')},[
                            m('div',{class:c('c-toybox_siteTitle','is-edit')},[
                                m('span',{class:c('icon')},[
                                    m('i',{class:c('fa','fa-caret-down')})
                                ]),
                                m('span',{class:c('description')},'site name')
                            ]),
                            m('div',{class:c('c-toybox_sideToolbar',(this.manager.view.addFile)? 'is-active':null)},[
                                m('span',{
                                    class:c('icon','addItemIcon'),
                                    onclick:()=>{
                                        //フォルダ追加処理
                                        manager.addFolder(this.manager.target.parent);

                                        m.redraw();
                                    }
                                },[
                                    m('i',{class:c('fa','fa-plus')}),
                                    m('i',{class:c('fa','fa-folder')})
                                ]),
                                m('span',{
                                    class:c('icon','addItemIcon'),
                                    onclick:()=>{
                                        //ファイル追加処理
                                        manager.addFile(this.manager.target.parent);

                                        m.redraw();
                                    }
                                },[
                                    m('i',{class:c('fa','fa-plus')}),
                                    m('i',{class:c('fa','fa-file')})
                                ]),
                            ])
                        ]),
                        m('div',{
                            class:'l-toybox_fileTree',
                            onmouseover:()=>{
                                //addFileフラグを立てる
                                this.manager.view.addFile = true;
                            },
                            onmouseleave:()=>{
                                if(!manager.target){
                                    //addFileフラグを外す
                                    this.manager.view.addFile = false;
                                }
                            }
                        },[
                            _.map(this.itemNodes,(item:ComponentBasic)=>{return m(item)})
                        ])
                    ]),
                    m('div',{class:'l-toybox_sideResizer'},[
                        m('div',{class:'l-toybox_sideResizeToggle',onclick:()=>{
                            //サイドの開閉処理
                            this.manager.view.sideOpen = !this.manager.view.sideOpen;
                        }},[
                            m("i.fa.fa-angle-left")
                        ])
                    ])
                ])
            ]
        };
    }

    private makeItem(manager:ToyBoxManager,items:Array<ToyBoxItem>){
        while(items.length){
            const item = items.pop();
            if(item){
                switch(item.constructor.name){
                    case 'ToyBoxFile':
                        this.itemNodes[item.ID] = new ToyBoxFileItem(manager,<ToyBoxFile>item,item.ID);
                        break;
                    case 'ToyBoxFolder':
                        this.itemNodes[item.ID] = new ToyBoxFolderItem(manager,<ToyBoxFolder>item,item.ID);
                        break;
                    case 'ToyBoxConfig':
                        this.itemNodes[item.ID] = new ToyBoxConfigItem(manager,<ToyBoxConfig>item,item.ID);
                        break;
                }
            }
        }
    }
}

class ToyBoxSideItem extends ComponentBasic {
    public itemID:number;
    public manager:ToyBoxManager;

    constructor(manager:ToyBoxManager,itemID:number){
        super();
        this.manager = manager;
        this.itemID = itemID;
    }
}

//サイドバー上でのファイルアイテム
class ToyBoxFileItem extends ToyBoxSideItem {
    private nameEdit:boolean;
    private editName:string;

    private file:ToyBoxFile;

    constructor(manager:ToyBoxManager,file:ToyBoxFile,itemID:number){
        super(manager,itemID);
        this.file = file;

        this.nameEdit = false;
        this.editName = this.file.name;

        this.view = (vnode)=> {
            return [
                m('div',{
                    class:c('c-toybox_treeItem','c-toybox_file','c-toybox_treeItemName',(this.nameEdit)? 'is-edit':null, (manager.target === file)? 'is-target':null),
                    onclick:()=>{
                        this.manager.target = file;
                        this.manager.view.setConfigMode();
                    },
                    ondblclick:()=>{
                        this.manager.target = file;
                        this.manager.view.setFileEditMode();
                    }
                },[
                    m('span',{class:c('icon')},[
                        m('i',{
                            class:c('fa','fa-file'),
                            onclick:(e:MouseEvent)=>{
                                if(manager.target === this.file){
                                    //名前編集モードの切り替え
                                    this.nameEdit = !this.nameEdit; 
                                    this.file.name = this.editName;
                                    this.file.edit = !this.file.edit;
                                }
                            }
                        })
                    ]),
                    m('span',{class:c('description')},file.name),
                    m('input',{
                        class:c('description'),
                        oninput:m.withAttr('value',(name)=>{
                            this.editName = name;
                        }),
                        value:(this.nameEdit)? this.editName:this.file.name
                    })
                ])
            ]
        };
    }
}

//サイドバー上でのフォルダアイテム
class ToyBoxFolderItem extends ToyBoxSideItem {
    private nameEdit:boolean;
    private editName:string;
    private open:boolean;
    private itemNodes:{[key: string]: ToyBoxSideItem;};

    private folder:ToyBoxFolder;

    constructor(manager:ToyBoxManager,folder:ToyBoxFolder,itemID:number){
        super(manager,itemID);
        this.folder = folder;

        this.nameEdit = false;
        this.editName = this.folder.name;
        this.itemNodes = {};
        this.open = false;

        this.onupdate = (vnode)=> {
            if(this.folder.addItems){
                this.makeItem(manager,this.folder.addItems);
            }
        }

        this.oninit = (vnode)=> {
            this.makeItem(manager,folder.addItems);
        }

        this.view = (vnode)=> {
            return [
                m('div',{class:c('c-toybox_treeItem','c-toybox_dir')},[
                    m('div',{
                        class:c('c-toybox_dirName','c-toybox_treeItemName',(this.nameEdit)? 'is-edit':null,(manager.target === folder)? 'is-target':null),
                        onclick:()=>{
                            this.open = !this.open;
                            this.manager.target = folder;
                            this.manager.view.setConfigMode();
                        }
                    },[
                        m('span',{class:c('icon')},[
                            m('i',{
                                class:c('fa',(this.open)? 'fa-folder-open':'fa-folder'),
                                onclick:(e:MouseEvent)=>{
                                    if(this.manager.target === this.folder){
                                        //名前編集モードの切り替え
                                        this.nameEdit = !this.nameEdit; 
                                        this.folder.name = this.editName;
                                        this.folder.edit = !this.folder.edit;

                                        //親へのイベント伝播を停止
                                        e.stopPropagation();
                                    }
                                }
                            })
                        ]),
                        m('span',{class:c('description')},this.folder.name),
                        m('input',{
                            class:c('description'),
                            oninput:m.withAttr('value',(name)=>{
                                console.log(name);
                                this.editName = name
                            }),
                            value:(this.nameEdit)? this.editName:this.folder.name
                        })
                    ]),
                    m('div',{class:c('l-toybox_files',(this.open)?'is-active':null)},[
                        _.map(this.itemNodes,(item:ComponentBasic)=>{return m(item)})
                    ])
                ])
            ]
        };
    }

    private makeItem(manager:ToyBoxManager,items:Array<ToyBoxItem>){
        while(items.length){
            const item = items.pop();
            if(item){
                switch(item.constructor.name){
                    case 'ToyBoxFile':
                        this.itemNodes[item.ID] = new ToyBoxFileItem(manager,<ToyBoxFile>item,item.ID);
                        break;
                    case 'ToyBoxFolder':
                        this.itemNodes[item.ID] = new ToyBoxFolderItem(manager,<ToyBoxFolder>item,item.ID);
                        break;
                    case 'ToyBoxConfig':
                        this.itemNodes[item.ID] = new ToyBoxConfigItem(manager,<ToyBoxConfig>item,item.ID);
                        break;
                }
            }
        }
    }
}

//サイドバー上でのコンフィグアイテム
class ToyBoxConfigItem extends ToyBoxSideItem {
    private nameEdit:boolean;
    private editName:string;

    private config:ToyBoxConfig;

    constructor(manager:ToyBoxManager,config:ToyBoxConfig,itemID:number){
        super(manager,itemID);
        this.config = config;

        this.nameEdit = false;
        this.editName = this.config.name;

        this.view = (vnode)=> {
            return [
                m('div',{
                    class:c('c-toybox_treeItem','c-toybox_config','c-toybox_treeItemName',(this.nameEdit)? 'is-edit':null,(manager.target === config)? 'is-target':null),
                    onclick:()=>{
                        //編集ターゲットを変更する
                        manager.target = config;
                        manager.view.setConfigEditMode();
                    }
                },[
                    m('span',{class:c('icon')},[
                        m('i',{
                            class:c('fa','fa-gear'),
                            onclick:(e:MouseEvent)=>{
                                if(manager.target === this.config){
                                    //名前編集モードの切り替え
                                    this.nameEdit = !this.nameEdit; 
                                    this.config.name = this.editName;
                                    this.config.edit = !this.config.edit;
                                }
                            }
                        })
                    ]),
                    m('span',{class:c('description')},config.name),
                    m('input',{
                        class:c('description'),
                        oninput:m.withAttr('value',(name)=>{
                            this.editName = name
                        }),
                        value:(this.nameEdit)? this.editName:this.config.name
                    })
                ])
            ]
        };
    }
}

class ToyBoxMainView extends ComponentBasic {
    private manager:ToyBoxManager;

    constructor(manager:ToyBoxManager) {
        super();
        this.manager = manager;

        this.view = (vnode)=> {
            return [
                m('div',{class:c('f-toybox_mainView-container')},[
                    m(this.targetMainView())
                ])
            ]
        };
    }

    private targetMainView():ComponentBasic{
        switch(this.manager.view.editmode){
            case 'configEdit':
                return new ToyBoxConfigView(this.manager,<ToyBoxConfig>this.manager.target);
            case 'fileEdit' :
                return new ToyBoxFileEditView(this.manager,this.manager.target);
            case 'configSet':
                return new ToyBoxItemConfigView(this.manager,this.manager.target);
            case 'none' :
                return new ToyBoxTopView(this.manager);
            default:
                return new ToyBoxTopView(this.manager);
        }
    }
    
}

//コンフィグアイテムの編集画面
class ToyBoxConfigView extends ComponentBasic {
    private manager:ToyBoxManager;
    private config:ToyBoxConfig;

    constructor(manager:ToyBoxManager,config:ToyBoxConfig){
        super();
        this.config = config;

        this.view = (vnode)=> {
            return [
                m('div',{class:c('l-toybox_mainResizeArea','is-config')}),
                m('div',{class:c('l-toybox_mainView')},[
                    m('div',{class:c('l-toybox_configEditArea')},[
                        m('div',{class:c('c-toybox_configTitle')},[
                            m('span',{class:c('icon')},[
                                m('i',{class:c('fa','fa-gear')})
                            ]),
                            m('span',{class:c('description')},this.config.name),
                            m('div',{class:c('tabs','is-right','is-boxed','l-toybox_configTabArea')},[
                                m('ul',[
                                    m('li',{class:c('l-toybox_configTabBox','is-active')},[
                                        m('a',{href:'#'},[
                                            m('span',{class:c('icon','is-small')},[
                                                m('i',{class:c('fa','fa-file')},)
                                            ]),
                                            m('span',{class:c('description')},'File')
                                        ])
                                    ]),
                                    m('li',{class:c('l-toybox_configTabBox')},[
                                        m('a',{href:'#'},[
                                            m('span',{class:c('icon','is-small')},[
                                                m('i',{class:c('fa','fa-folder')},)
                                            ]),
                                            m('span',{class:c('description')},'Folder')
                                        ])
                                    ])
                                ])
                            ])
                        ]),
                        m('div',{class:c('l-toybox_configPropEditArea')},[
                            m('div',{class:c('c-toybox_configPropTitle','is-active')},[
                                m('span',{class:c('icon')},[
                                    m('i',{class:c('fa','fa-tags')})
                                ]),
                                m('span',{class:c('description')},'Tag'),
                            ]),
                            m('div',{class:c('c-toybox_tagConfigs')},[
                                m(new ToyBoxTagConfigView(this.manager)),
                                m(new ToyBoxTagConfigView(this.manager))
                            ]),
                            m('a',{class:c('c-toybox_configButton')},[
                                m('span',{class:c('icon')},[
                                    m('i',{class:c('fa','fa-tags')})
                                ]),
                                m('span',{class:c('description')},'タグを新規作成')
                            ])
                        ]),
                        m('div',{class:c('l-toybox_configPropEditArea')},[
                            m('div',{class:c('c-toybox_configPropTitle','is-active')},[
                                m('span',{class:c('icon')},[
                                    m('i',{class:c('fa','fa-link')})
                                ]),
                                m('span',{class:c('description')},'Link'),
                            ]),
                            m('div',{class:c('c-toybox_linkConfigs')},[
                                m('div',{class:c('c-toybox_linkConfig')},[
                                    m('div',{class:c('c-toybox_configPropTitleContainer')},[
                                        m('div',{class:c('c-toybox_configPropTitle')},'test link'),
                                        m('input',{class:c('c-toybox_configPropTitleInput','is-active'),value:'test tag'}),
                                        m('div',{class:c('c-toybox_configPropClose')},[
                                            m('span',{class:c('icon')},[
                                                m('i',{class:c('fa','fa-times')})
                                            ])
                                        ])
                                    ]),
                                    m('div',{class:c('c-toybox_linkDetailConfig')},[
                                        m('div',{class:'c-toybox_linkSelect'},[
                                            m('label',{class:c('checkbox')},[
                                                m('input',{type:'checkbox'}),
                                                m('span','フォルダと関連付け')
                                            ])
                                        ]),
                                        m('div',{class:'c-toybox_linkSelect'},[
                                            m('label',{class:c('checkbox')},[
                                                m('input',{type:'checkbox'}),
                                                m('span','ファイルと関連付け')
                                            ])
                                        ])
                                    ])
                                ])
                            ]),
                            m('a',{class:c('c-toybox_configButton')},[
                                m('span',{class:c('icon')},[
                                    m('i',{class:c('fa','fa-link')})
                                ]),
                                m('span',{class:c('description')},'新規リンクを作成')
                            ])
                        ])
                    ]),
                ])
            ]
        }
    }
}

class ToyBoxTagConfigView extends ComponentBasic {
    private manager:ToyBoxManager;

    constructor(manager:ToyBoxManager,){
        super();

        this.view = ()=>{
            return [
                m('div',{class:c('c-toybox_tagConfig')},[
                    m('div',{class:'c-toybox_configPropTitleContainer'},[
                        m('div',{class:c('c-toybox_configPropTitle','is-active')},'test tag'),
                        m('input',{class:c('c-toybox_configPropTitleInput'),value:'test tag'}),
                        m('div',{class:c('c-toybox_configPropClose')},[
                            m('span',{class:c('icon')},[
                                m('i',{class:c('fa','fa-times')})
                            ])
                        ])
                    ]),
                    m('div',{class:c('c-toybox_taglist')},[
                        m('span',{class:c('tag','is-primary')},[
                            m('span',{class:c('description')},'Primary'),
                            m('button',{class:c('delete','is-small')})
                        ])
                    ]),
                    m('a',{class:c('c-toybox_addTag')},[
                        m('span',{class:c('icon')},[
                            m('i',{class:c('fa','fa-tags')})
                        ]),
                        m('span',{class:c('description')},'タグを追加'),
                    ])
                ])
            ]
        }
    }
}

//アイテムのコンフィグ設定
class ToyBoxItemConfigView extends ComponentBasic {
    private manager:ToyBoxManager;

    constructor(manager:ToyBoxManager,item:ToyBoxItem){
        super();

        this.view = (vnode)=>{
            //コンフィグ設定のビュー
            return [
                m('div',{class:c('l-toybox_mainResizeArea','is-config')}),
                m('div',{class:c('l-toybox_mainView')},[
                    m('div',{class:c('l-toybox_configEditArea')},[
                        m('div',{class:c('c-toybox_configItemTitle')},[
                            m('span',{class:c('icon')},[
                                m('i',{class:c('fa','fa-file')})
                            ]),
                            m('span',{class:c('description')},'file'),
                        ]),
                        m('div',{class:c('l-toybox_configPropEditArea')},[
                            m('div',{class:c('c-toybox_configPropTitle','is-active')},[
                                m('span',{class:c('icon')},[
                                    m('i',{class:c('fa','fa-tags')})
                                ]),
                                m('span',{class:c('description')},'Tag')
                            ]),
                            m('div',{class:c('c-toybox_itemTagConfigs')},[
                                m('div',{class:c('c-toybox_tagConfig')},[
                                    m('div',{class:c('c-toybox_configPropTitleContainer')},[
                                        m('div',{class:c('c-toybox_configPropTitle','is-active')},'test tag!')
                                    ]),
                                    m('div',{class:c('c-toybox_taglist')},[
                                        m('span',{class:c('tag','is-primary')},[
                                            m('span',{class:c('description')},'Primary'),
                                            m('button',{class:c('delete','is-small')})
                                        ]),
                                        m('span',{class:c('tag','is-primary')},[
                                            m('span',{class:c('description')},'2nd Tag'),
                                            m('button',{class:c('delete','is-small')})
                                        ])
                                    ]),
                                    m('div',{class:c('c-toybox_addTagItem')},[
                                        m('a',{class:c('icon','c-toybox_addSelectTag')},[
                                            m('i',{class:c('fa','fa-plus')})
                                        ]),
                                        m('p',{class:c('control')},[
                                            m('span',{class:c('select','is-small')},[
                                                m('select',{class:c('c-toybox_selectTags')},[
                                                    m('option','おすすめ記事'),
                                                    m('option','おためし記事')
                                                ])
                                            ]),
                                        ])
                                    ])
                                ]),
                            ])
                        ])
                    ]),
                ])
            ];
        }
    }
}

//ファイルの編集画面
class ToyBoxFileEditView extends ComponentBasic {
    private manager:ToyBoxManager;

    constructor(manager:ToyBoxManager,file:ToyBoxItem){
        super();

        this.view = (vnode)=>{
            return [
                m('div',{class:c('l-toybox_mainResizeArea')}),
                m('div',{class:c('l-toybox_mainView')},[
                    m('div',{class:c('l-toybox_mainEditArea')},[
                        m('div',{class:c('c-toybox_editors')},[
                            m(new ToyBoxEditor())
                        ])
                    ]),
                    m('div',{class:c('l-toybox_previewArea')},[

                    ])
                ])
            ];
        }
    }
}

//初期状態のメイン画面
class ToyBoxTopView extends ComponentBasic {
    private manager:ToyBoxManager;

    constructor(manager:ToyBoxManager){
        super();

        this.view = (vnode)=>{
            return [
                m('div',{class:c('l-toybox_mainResizeArea','is-config')}),
                m('div',{class:c('l-toybox_mainView')},[
                    m('div','content'),
                    m(Test.makeTab())
                ])
            ];
        }
    }
}

class ToyBoxApp {
    public manager:ToyBoxManager;

    constructor(){
        console.log("client/cms/index.js");
        this.manager = new ToyBoxManager();

        window.onload = ()=>{
            console.log('this is awesome app');
            m.route(document.body,'/',{'/':new ToyBoxRoot(this.manager)});
        }
    }
}

new ToyBoxApp();