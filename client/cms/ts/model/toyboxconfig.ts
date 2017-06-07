import ToyBoxItem from './toyboxitem';

enum PropType{
    TAG,
    LINK
}

enum LinkType {
    NONE,
    FILE,
    FOLDER,
    BOTH
}

export default class ToyBoxConfig extends ToyBoxItem {
    //設定ファイルのID
    private ID:number;

    //設定
    private tagProp:Array<TagConfig>;
    private linkProp:Array<LinkConfig>;

    constructor(name){
        super(name);
    }

    public addTagConfig = ()=>{
        this.tagProp.push(new TagConfig());
    }

    public addLinkConfig = ()=>{
        this.linkProp.push(new LinkConfig());
    }
}

class LinkConfig {
    private linkType:LinkType;

    constructor(){
        
    }

    //リンクタイプをセット
    public setLinkType = (linkType:LinkType)=>{
        this.linkType = linkType;
    }
}

class TagConfig {
    private tags:Array<string>;

    constructor(){
        this.tags = [];
    }

    //タグを追加
    public addTag = (tagname:string)=>{
        this.tags.push(tagname);
    }

    //タグをひとつ削除
    public removeTag = (tagnumber:number)=>{
        this.tags.splice(tagnumber,1);
    }
}