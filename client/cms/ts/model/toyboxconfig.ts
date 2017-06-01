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

export default class ToyBoxConfig {
    //設定ファイルのID
    private ID:number;

    //設定
    private prop:Array<Config>;

    constructor(){
        
    }
}

class Config {
    private type:PropType;
    private tags:Array<string>;
    private linkType:LinkType;

    constructor(type:PropType){
        this.type = type;
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

    //リンクタイプをセット
    public setLinkType = (linkType:LinkType)=>{
        this.linkType = linkType;
    }
}