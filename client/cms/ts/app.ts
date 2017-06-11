/// <reference path="../../../node_modules/@types/mithril/index.d.ts" />

import ToyBoxManager from './toyboxmanager';
import FirebaseControl from './../../firebase/fireBaseControl';
import * as m from 'mithril';
import * as c from 'classnames';
import * as _ from 'lodash';

import ToyBoxItem from './model/toyboxitem';
import ToyBoxFile from './model/toyboxfile';
import ToyBoxFolder from './model/toyboxfolder';
import ToyBoxConfig from './model/toyboxconfig';

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
                    m(this.mainVIew)
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
            this.makeItem(state,state.root.addItems);
        }

        this.onupdate = (vnode)=> {
            if(state.root.addItems){
                this.makeItem(state,state.root.addItems);
            }
        }

        this.view = (vnode)=> {

            return [
                m('div',{class:'f-toybox_side-container',},[
                    m('div',{class:c('l-toybox_side',(state.sideOpen)?'is-active':null)},[
                        m('div',{class:c('c-toybox_siteTitleBar')},[
                            m('div',{class:c('c-toybox_siteTitle','is-edit')},[
                                m('span',{class:c('icon')},[
                                    m('i',{class:c('fa','fa-caret-down')})
                                ]),
                                m('span',{class:c('description')},state.site)
                            ]),
                            m('div',{class:c('c-toybox_sideToolbar',(state.addFile)? 'is-active':null)},[
                                m('span',{
                                    class:c('icon','addItemIcon'),
                                    onclick:()=>{
                                        state.target.parent.addItem(new ToyBoxFolder('新規フォルダ',state.target.parent));
                                        m.redraw();
                                    }
                                },[
                                    m('i',{class:c('fa','fa-plus')}),
                                    m('i',{class:c('fa','fa-folder')})
                                ]),
                                m('span',{
                                    class:c('icon','addItemIcon'),
                                    onclick:()=>{
                                        state.target.parent.addItem(new ToyBoxFile('新規ファイル',state.target.parent));
                                        m.redraw();
                                    }
                                },[
                                    m('i',{class:c('fa','fa-plus')}),
                                    m('i',{class:c('fa','fa-file')})
                                ]),
                                m('span',{
                                    class:c('icon','addItemIcon'),
                                    onclick:()=>{
                                        state.target.parent.addItem(new ToyBoxConfig('新規コンフィグ',state.target.parent));
                                        m.redraw();
                                    }
                                },[
                                    m('i',{class:c('fa','fa-plus')}),
                                    m('i',{class:c('fa','fa-gear')})
                                ]),
                            ])
                        ]),
                        m('div',{
                            class:'l-toybox_fileTree',
                            onmouseover:()=>{state.addFile = true;},
                            onmouseleave:()=>{
                                if(!state.target){
                                    state.addFile = false;
                                }
                            }
                        },[
                            _.map(this.itemNodes,(item:ComponentBasic)=>{return m(item)})
                        ])
                    ]),
                    m('div',{class:'l-toybox_sideResizer'},[
                        m('div',{class:'l-toybox_sideResizeToggle',onclick:()=>{state.sideOpen = !state.sideOpen}},[
                            m("i.fa.fa-angle-left")
                        ])
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
        switch(this.state.editmode){
            case 'config':
                return new ToyBoxConfigView(this.state,this.state.target);
            default:
                return new ToyBoxConfigView(this.state,this.state.target);
        }
    }
    
}

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
                                ])
                            ])
                        ])
                    ])
                ])
            ]
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