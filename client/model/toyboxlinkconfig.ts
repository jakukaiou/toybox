import ToyBoxProp from './toyboxprop';

export default class ToyBoxLinkConfig extends ToyBoxProp {
    private linkType:string;

    constructor(){
        super();
    }

    //リンクタイプをセット
    public setLinkType = (linkType:string)=>{
        this.linkType = linkType;
    }
}