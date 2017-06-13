import * as m from 'mithril';
import * as c from 'classnames';

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

export default class ToyBoxEditor extends ComponentBasic {
    constructor(){
        super();

        this.view = (vnode)=>{
            return [
                m('div',{class:c('c-toybox_editor'),id:'component-edit0'},[
                    m('div',{class:c('c-toybox_editorHead')},[
                        m('div',{class:c('editorTitle')},'markdown'),
                        m('a',{class:c('c-toybox_editorClose')},[
                            m('span',{class:c('icon')},[
                                m('i',{class:c('fa','fa-times')})
                            ]),
                        ])
                    ]),
                    m('textarea',{class:c('c-toybox_editorEditArea')},'editorEditArea')
                ])
            ]
        }
    }
}