export default class LinkConfig {
    private linkType:string;

    constructor(){
        
    }

    //リンクタイプをセット
    public setLinkType = (linkType:string)=>{
        this.linkType = linkType;
    }
}