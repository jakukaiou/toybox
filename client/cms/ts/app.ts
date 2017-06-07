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
    private items:Array<ComponentBasic>;

    constructor(state:ToyBoxManager) {
        super();
        this.items = new Array();

        this.oninit = (vnode)=>{
            this.makeItem(state.root.items);
        }

        this.view = (vnode)=> {

            return [
                m('div',{class:'f-toybox_side-container'},[
                    m('div',{class:c('l-toybox_side',(state.sideOpen)?'is-active':null)},[
                        m('div',{class:c('c-toybox_siteTitleBar')},[
                            m('div',{class:c('c-toybox_siteTitle','is-edit')},[
                                m('span',{class:c('icon')},[
                                    m('i',{class:c('fa','fa-caret-down')})
                                ]),
                                m('span',{class:c('description')},state.site)
                            ]),
                            m('div',{class:c('c-toybox_sideToolbar','is-active')},[
                                m('span',{class:c('icon')},[
                                    m('i',{class:c('fa','fa-plus')}),
                                    m('i',{class:c('fa','fa-folder')})
                                ]),
                                m('span',{class:c('icon')},[
                                    m('i',{class:c('fa','fa-plus')}),
                                    m('i',{class:c('fa','fa-file')})
                                ]),
                                m('span',{class:c('icon')},[
                                    m('i',{class:c('fa','fa-plus')}),
                                    m('i',{class:c('fa','fa-gear')})
                                ]),
                            ])
                        ]),
                        m('div',{class:'l-toybox_fileTree'},[
                            _.map(this.items,(item:ComponentBasic)=>{return m(item)})
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

    private makeItem(items:{[key: number]: ToyBoxItem;}){
        _.each(items,(item:ToyBoxItem)=>{
            switch(item.constructor.name){
                case 'ToyBoxFile':
                    this.items.push(new ToyBoxFileItem(<ToyBoxFile>item));
                    break;
                case 'ToyBoxFolder':
                    this.items.push(new ToyBoxFolderItem(<ToyBoxFolder>item));
                    break;
                case 'ToyBoxConfig':
                    this.items.push(new ToyBoxConfigItem(<ToyBoxConfig>item));
                    break;
            }
        });
    }
}

//サイドバー上でのファイルアイテム
class ToyBoxFileItem extends ComponentBasic {
    private nameEdit:boolean;

    constructor(file:ToyBoxFile){
        super();
        this.nameEdit = false;

        this.view = (vnode)=> {
            return [
                m('div',{class:c('c-toybox_treeItem','c-toybox_file','c-toybox_treeItemName',(this.nameEdit)? 'is-edit':null)},[
                    m('span',{class:c('icon')},[
                        m('i',{class:c('fa','fa-file'),onclick:()=>{this.nameEdit = !this.nameEdit}})
                    ]),
                    m('span',{class:c('description')},file.name),
                    m('input',{class:c('description'),value:file.name})
                ])
            ]
        };
    }
}

//サイドバー上でのフォルダアイテム
class ToyBoxFolderItem extends ComponentBasic {
    private nameEdit:boolean;
    private open:boolean;
    private items:Array<ComponentBasic>;

    constructor(folder:ToyBoxFolder){
        super();
        this.nameEdit = false;
        this.items = new Array();
        this.open = false;

        this.oninit = (vnode)=> {
            folder.addItem(new ToyBoxFile('内部ファイル'));
            console.log(folder);
            this.makeItem(folder.items);
        }

        this.view = (vnode)=> {
            return [
                m('div',{class:c('c-toybox_treeItem','c-toybox_dir')},[
                    m('div',{class:c('c-toybox_dirName','c-toybox_treeItemName',(this.nameEdit)? 'is-edit':null),onclick:()=>{this.open = !this.open}},[
                        m('span',{class:c('icon')},[
                            m('i',{class:c('fa',(this.open)? 'fa-folder-open':'fa-folder'),onclick:(e:MouseEvent)=>{this.nameEdit = !this.nameEdit; e.stopPropagation();}})
                        ]),
                        m('span',{class:c('description')},folder.name),
                        m('input',{class:c('description'),value:folder.name})
                    ]),
                    m('div',{class:c('l-toybox_files',(this.open)?'is-active':null)},[
                        _.map(this.items,(item:ComponentBasic)=>{return m(item)})
                    ])
                ])
            ]
        };
    }

    private makeItem(items:{[key: number]: ToyBoxItem;}){
        _.each(items,(item:ToyBoxItem)=>{
            switch(item.constructor.name){
                case 'ToyBoxFile':
                    this.items.push(new ToyBoxFileItem(<ToyBoxFile>item));
                    break;
                case 'ToyBoxFolder':
                    this.items.push(new ToyBoxFolderItem(<ToyBoxFolder>item));
                    break;
                case 'ToyBoxConfig':
                    this.items.push(new ToyBoxConfigItem(<ToyBoxConfig>item));
                    break;
            }
        });
    }
}

//サイドバー上でのコンフィグアイテム
class ToyBoxConfigItem extends ComponentBasic {
    private nameEdit:boolean;

    constructor(config:ToyBoxConfig){
        super();
        this.nameEdit = false;

        this.view = (vnode)=> {
            return [
                m('div',{class:c('c-toybox_treeItem','c-toybox_config','c-toybox_treeItemName',(this.nameEdit)? 'is-edit':null)},[
                    m('span',{class:c('icon')},[
                        m('i',{class:c('fa','fa-gear'),onclick:()=>{this.nameEdit = !this.nameEdit}})
                    ]),
                    m('span',{class:c('description')},config.name),
                    m('input',{class:c('description'),value:config.name})
                ])
            ]
        };
    }
}

class ToyBoxMainView extends ComponentBasic {
    constructor(state:ToyBoxManager) {
        super();


        this.view = (vnode)=> {
            return [
                m('div','hello MainView')
            ]
        };
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