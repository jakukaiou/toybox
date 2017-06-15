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
    private mainVIew:ComponentBasic;

    constructor(state:ToyBoxManager) {
        super();

        this.oninit = (vnode)=> {
            this.bookID = vnode.attrs['id'];
            this.sidebar = new ToyBoxSideBar(state);
            this.nav = new ToyBoxNav(state);
            this.mainVIew = new ToyBoxMainView(state);
        }

        this.view = (vnode)=> {
            return [
                m(this.nav),
                m('div',{class: 'f-toybox_base-container'},[
                    m(this.sidebar),
                    m(this.mainVIew),
                    m('div',{class: c('l-toybox_fadeLayer','is-active')})
                ])
            ]
        };
    }
}

class ToyBoxNav extends ComponentBasic {
    constructor(state:ToyBoxManager) {
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

    constructor(state:ToyBoxManager) {
        super();
        this.itemNodes = {};

        this.oninit = (vnode)=>{
            
        }

        this.onupdate = (vnode)=> {
            
        }

        this.view = (vnode)=> {

            return [
                m('div',{class:'f-toybox_side-container',},[
                    m('div',{class:c('l-toybox_side','is-active')},[
                        m('div',{class:c('c-toybox_siteTitleBar')},[
                            m('div',{class:c('c-toybox_siteTitle','is-edit')},[
                                m('span',{class:c('icon')},[
                                    m('i',{class:c('fa','fa-caret-down')})
                                ]),
                                m('span',{class:c('description')},'site name')
                            ]),
                            m('div',{class:c('c-toybox_sideToolbar','is-active')},[
                                m('span',{
                                    class:c('icon','addItemIcon'),
                                    onclick:()=>{
                                        //フォルダ追加処理
                                    }
                                },[
                                    m('i',{class:c('fa','fa-plus')}),
                                    m('i',{class:c('fa','fa-folder')})
                                ]),
                                m('span',{
                                    class:c('icon','addItemIcon'),
                                    onclick:()=>{
                                        //ファイル追加処理
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
                            },
                            onmouseleave:()=>{
                                if(!state.target){
                                    //addFileフラグを外す
                                }
                            }
                        },[
                            _.map(this.itemNodes,(item:ComponentBasic)=>{return m(item)})
                        ])
                    ]),
                    m('div',{class:'l-toybox_sideResizer'},[
                        m('div',{class:'l-toybox_sideResizeToggle',onclick:()=>{
                            //サイドの開閉処理
                        }},[
                            m("i.fa.fa-angle-left")
                        ])
                    ])
                ])
            ]
        };
    }
}

class ToyBoxSideItem extends ComponentBasic {
    public itemID:number;
    public state:ToyBoxManager;

    constructor(state:ToyBoxManager,itemID:number){
        super();
        this.state = state;
        this.itemID = itemID;
    }
}

//サイドバー上でのファイルアイテム
class ToyBoxFileItem extends ToyBoxSideItem {
    private nameEdit:boolean;
    private editName:string;

    private file:ToyBoxFile;

    constructor(state:ToyBoxManager,file:ToyBoxFile,itemID:number){
        super(state,itemID);
        this.file = file;

        this.nameEdit = false;
        this.editName = this.file.name;

        this.view = (vnode)=> {
            return [
                m('div',{
                    class:c('c-toybox_treeItem','c-toybox_file','c-toybox_treeItemName',(this.nameEdit)? 'is-edit':null, (state.target === file)? 'is-target':null),
                    onclick:()=>{
                        state.target = file;
                    }
                },[
                    m('span',{class:c('icon')},[
                        m('i',{
                            class:c('fa','fa-file'),
                            onclick:(e:MouseEvent)=>{
                                if(state.target === this.file){
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
                            console.log(name);
                            this.editName = name
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

    constructor(state:ToyBoxManager,folder:ToyBoxFolder,itemID:number){
        super(state,itemID);
        this.folder = folder;

        this.nameEdit = false;
        this.editName = this.folder.name;
        this.itemNodes = {};
        this.open = false;

        this.onupdate = (vnode)=> {
            if(this.folder.addItems){
                this.makeItem(state,this.folder.addItems);
            }
        }

        this.oninit = (vnode)=> {
            this.makeItem(state,folder.addItems);
        }

        this.view = (vnode)=> {
            return [
                m('div',{class:c('c-toybox_treeItem','c-toybox_dir')},[
                    m('div',{
                        class:c('c-toybox_dirName','c-toybox_treeItemName',(this.nameEdit)? 'is-edit':null,(state.target === folder)? 'is-target':null),
                        onclick:()=>{
                            this.open = !this.open;
                            state.target = folder;
                        }
                    },[
                        m('span',{class:c('icon')},[
                            m('i',{
                                class:c('fa',(this.open)? 'fa-folder-open':'fa-folder'),
                                onclick:(e:MouseEvent)=>{
                                    if(state.target === this.folder){
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

    private makeItem(state:ToyBoxManager,items:Array<ToyBoxItem>){
        while(items.length){
            const item = items.pop();
            if(item){
                switch(item.constructor.name){
                    case 'ToyBoxFile':
                        this.itemNodes[item.ID] = new ToyBoxFileItem(state,<ToyBoxFile>item,item.ID);
                        break;
                    case 'ToyBoxFolder':
                        this.itemNodes[item.ID] = new ToyBoxFolderItem(state,<ToyBoxFolder>item,item.ID);
                        break;
                    case 'ToyBoxConfig':
                        this.itemNodes[item.ID] = new ToyBoxConfigItem(state,<ToyBoxConfig>item,item.ID);
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

    constructor(state:ToyBoxManager,config:ToyBoxConfig,itemID:number){
        super(state,itemID);
        this.config = config;

        this.nameEdit = false;
        this.editName = this.config.name;

        this.view = (vnode)=> {
            return [
                m('div',{
                    class:c('c-toybox_treeItem','c-toybox_config','c-toybox_treeItemName',(this.nameEdit)? 'is-edit':null,(state.target === config)? 'is-target':null),
                    onclick:()=>{
                        state.target = config;
                    }
                },[
                    m('span',{class:c('icon')},[
                        m('i',{
                            class:c('fa','fa-gear'),
                            onclick:(e:MouseEvent)=>{
                                if(state.target === this.config){
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
                            console.log(name);
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
    private state:ToyBoxManager;

    constructor(state:ToyBoxManager) {
        super();
        this.state = state;

        this.view = (vnode)=> {
            return [
                m('div',{class:c('f-toybox_mainView-container')},[
                    m('div',{class:c('l-toybox_mainResizeArea','is-config')}),
                    m('div',{class:c('l-toybox_mainView')},[
                        m(this.targetMainView())
                    ])
                ])
            ]
        };
    }

    private targetMainView():ComponentBasic{
        switch(this.state.view.editmode){
            case 'config':
                return new ToyBoxConfigView(this.state,this.state.target);
            case 'file' :
                return new ToyBoxFileEditView(this.state,this.state.target);
            default:
                return new ToyBoxConfigView(this.state,this.state.target);
        }
    }
    
}

//コンフィグアイテムの編集画面
class ToyBoxConfigView extends ComponentBasic {
    private state:ToyBoxManager;

    constructor(state:ToyBoxManager,config:ToyBoxItem){
        super();

        this.view = (vnode)=> {
            return [
                m('div',{class:c('l-toybox_configEditArea')},[
                    m('div',{class:c('c-toybox_configTitle')},[
                        m('span',{class:c('icon')},[
                            m('i',{class:c('fa','fa-gear')})
                        ]),
                        m('span',{class:c('description')},'Config'),
                    ]),
                    m('div',{class:c('l-toybox_configPropEditArea')},[
                        m('div',{class:c('c-toybox_configPropTitle','is-active')},[
                            m('span',{class:c('icon')},[
                                m('i',{class:c('fa','fa-tags')})
                            ]),
                            m('span',{class:c('description')},'Tag'),
                        ]),
                        m('div',{class:c('c-toybox_tagConfigs')},[
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
            ]
        }
    }
}

//ファイルの編集画面
class ToyBoxFileEditView extends ComponentBasic {
    private state:ToyBoxManager;

    constructor(state:ToyBoxManager,file:ToyBoxItem){
        super();

        this.view = (vnode)=>{
            return [
                m('div',{class:c('l-toybox_mainEditArea')},[
                    m('div',{class:c('c-toybox_editors')},[
                        m(new ToyBoxEditor())
                    ])
                ]),
                m('div',{class:c('l-toybox_previewArea')},[

                ])
            ];
        }
    }
}

class ToyBoxApp {
    public firebase:FirebaseControl;
    public state:ToyBoxManager;

    constructor(){
        console.log("client/cms/index.js");
        this.firebase = new FirebaseControl();
        this.state = new ToyBoxManager();

        window.onload = ()=>{
            console.log('this is awesome app');
            m.route(document.body,'/',{'/':new ToyBoxRoot(this.state)});
        }
    }
}

new ToyBoxApp();