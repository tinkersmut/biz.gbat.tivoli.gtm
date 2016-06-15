/**
 * 
 * @param eccn
 * @param desc
 * @param parent
 * @returns {USML}
 */
function USML(eccn, desc, parent){
    this.eccn = eccn;
    this.parent = parent;
    this.description = desc;
    this.notes = "";
    
    /**
     * used to track sub cat of this usml
     */ 
    this.setSub = function(sub){
      this.sub = sub;
    }
    /**
     * Sub category name assuming this is not a category definition usml
     */
    this.getNextSub = function(){
      return String.fromCharCode(this.sub.charCodeAt(0)+1);
    }
        
    /**
     * Adds a line to this note
     */
    this.addNote = function(note){
      note = note.replace(/[']/,'"');
      if(!this.notes){
        this.notes = note;
      }
      else{
        this.notes += note;
      }
    }
    
    /**
     * 
     */
    this.toSQL = function(){
      var retval = "insert into ECCN (eccn,";
      if(this.parent){
        retval += " parent,";
      }
      retval += " iscategory, isitar, description, notes) values ('";
      retval += this.eccn;
      retval += "', ";
      if(this.parent){
        retval += ("'"+this.parent.eccn)
        retval += "', 0, ";
      }else{
        retval += "1, "
      }
        retval += "1, '"
      retval += this.description.replace("[']","");
      retval += "', '";
      retval += this.notes;
      retval += "')";
      return retval;
    }
}

/**
 * 
 * @returns {USMLParser}
 */
function USMLParser(){
  this.html = undefined;
  this.lines = undefined;
  
  /**
   * 
   */
  this.constructor = function(){
    var url = 'http://www.gpo.gov/fdsys/pkg/CFR-2002-title22-vol1/xml/CFR-2002-title22-vol1-chapI-subchapM.xml';
    var h = new http(url);
    h.username='';
    h.password='';
    var bytes = java.lang.Class.forName("com.trm.javascript.bridge.io.ByteArray").getMethod("getByteArray",null).invoke(h.get.submit().data, null);
    this.html = new java.lang.String(bytes,"UTF-8");
    this.html = this.html+"";
    this.html = this.html.replace(/^[<][?]xml[^>]+[>]/g,'').replace(/^[\s]+/,'');
    this.xml = new XML(this.html);
    this.parse();
  }
  
  /**
   * Parses into categories
   */
  this.parse = function(){
    var parts = this.xml..PART;
    for(var i in parts){
      if(parts[i].EAR.text().match(/Pt[.] 121/)){
        this.setPart(parts[i]);
        // done
        break;
      }
    }
  }
  
  /**
   * 
   */
  this.setPart = function(part){
    var sections = part..SECTION;
    for(var i in sections){
      if(sections[i].SECTNO.text().match(/121[.]1/) && sections[i].EXTRACT){
        this.setExtract(sections[i].EXTRACT.children());
        // done
        break;
      }
    }
  }
  
  this.setExtract = function(extract){
    for( var i in extract){
      // cat def
      if(extract[i].name() == 'HD'){
        this.defineCategory(extract[i].text());
        continue;
      }
      
      // USML number
      else if(extract[i].name() == 'P'){
        this.defineUSML(extract[i].text()+'');
      }
      //note
      else if(this.lastusml){
        this.lastusml.addNote(extract[i].text()+'');
      }
    }
  }
  
  /**
   * 
   */
  this.defineCategory = function(name){
    var match = name.match(/[XIV]+[—]/)
    // glitch?
    if(!match || match.length != 1){
      logger.info("Bad Category "+name);
      return;
    }
    var eccn = match[0].replace(/[—]/,'');
    var desc = name.substr(name.indexOf('-')+1);
    var usml = new USML(eccn, desc);
    this.currentcat = usml;
    if(this.lastusml){
      logger.info(this.lastusml.toSQL());
    }
    this.lastusml = null;
    logger.info(usml.toSQL());
  }
  
  /**
   * 
   */
  this.defineUSML = function(name){
    if(this.currentcat == null){
      logger.error("No current category!"+name);
    }
    var match = name.match(/^[*]?\s*[(][0-9a-zA-Z]+[)]\s+/)
    
    // sanity check
    if(!match || match.length != 1){
      if(name == 'NOTE TO PARAGRAPH'){
        return;
      }
      if(this.lastusml){
        this.lastusml.addNote(name);
      }
      return;
    }
    
    var sub = match[0].replace(/[*]/,'').replace(/[(]/,'').replace(/[)]/,'').replace(' ','');
    
    // note!
    if(this.lastusml && this.lastusml.getNextSub() != sub){
      this.lastusml.addNote(name);
      return;
    }
    
    // parse as usml
    var eccn = this.currentcat.eccn+"("+sub+")"
    var desc = name.substr(match[0].length);
    var usml = new USML(eccn, desc, this.currentcat);
    
    usml.setSub(sub);
    
    // keep this in case we drop to another sub
    if(this.lastusml){
      logger.info(this.lastusml.toSQL());
    }
    this.lastusml = usml;
  }
  
  this.dump = function(){
  }
  
  this.dummy = this.constructor();
}

var parser = new USMLParser();
parser.dump();
if(parser.lastusml){
  logger.info(parser.lastusml.toSQL());
}