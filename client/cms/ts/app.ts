/// <reference path="../../../node_modules/@types/mithril/index.d.ts" />

import FirebaseControl from './../../firebase/fireBaseControl';
import * as m from 'mithril';

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

    constructor() {
        super();

        this.oninit = (vnode)=> {
            this.bookID = vnode.attrs['id'];
        }

        this.view = (vnode)=> {
            return [
                m('div','hello mithril')
            ]
        };
    }
}

class ToyBoxApp {
    public firebase:FirebaseControl;

    constructor(){
        console.log("client/cms/index.js");
        this.firebase = new FirebaseControl();

        window.onload = ()=>{
            console.log('this is awesome app');
            m.route(document.body,'wonder',{'wonder':new ToyBoxRoot()});
        }
    }
}

new ToyBoxApp();