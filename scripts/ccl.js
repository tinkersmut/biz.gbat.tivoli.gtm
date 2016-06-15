var CCLECCNInserts = new Array();

/**
 * 
 * @param name
 * @param desc
 * @returns {Category}
 */
function Category(name, desc){
  this.name = name;
  this.description = desc;
  this.subcats = new Array();
  this.lines = new Array();
  
  /**
   * Add a line to this category. This will then parse each line looking for subcats etc
   */
  this.addLine = function(line){
  
    // declaration of a sub cat
    var match = line.match(/^[A-Z]+[.]\s*/);
    if(match){
      var subname = match[0].replace(/[.]\s*/g,'');
      var desc = line.replace(/^[A-Z]+[.]\s*/g,'').replace(/[<][/]p[>]/g,'').replace(/[&]rdquo[;]/g,'"').replace(/[&]ldquo[;]/g,'"');
      this.subcats.push(new SubCategory(this, subname, desc));
      return;
    }
    
    // not a declaration...put line in last subcat
    if(this.subcats.length > 0){
      this.subcats[this.subcats.length - 1].addLine(line);
      return;
    }
    
    // part of the header of this cat
    this.lines.push(line);
  }
  
  /**
   * 
   */
  this.toXML = function(){
    var retval = "<Category name='"+this.name+"'>\n";
    retval += "  <description><![CDATA["+this.description+"]]></description>\n";
    for(var i in this.subcats){
      retval += this.subcats[i].toXML();
    }
    retval += "</Category>";
    return retval;
  }
  
  /**
   * 
   */
  this.toSQL = function(){
	  var retval = "insert into ECCN (eccn, iscategory, isitar, description) values ('";
	  retval += this.name;
	  retval += "', 1, 0, '";
	  retval += this.description.replace(/[']/g,"");
	  retval += "');"
	  for(var i in this.subcats){
		  retval += "\n"+this.subcats[i].toSQL();
	  }
	  return retval;
  }
}

/**
 * 
 * @param category
 * @param name
 * @param desc
 * @returns {SubCategory}
 */
function SubCategory(category, name, desc){
  this.name = name;
  this.parent = category;
  this.description = desc;
  this.eccns = new Array();
  this.lines = new Array();
  
  /**
   * Add a line to this sub category
   */
  this.addLine = function(line){
    // declaration of eccn 
    var match = line.match(/^[<][B|b][>]\s*["]?\s*\d[A-Z]\d{3}\s*/);
    if(match){
      var eccnname = match[0].replace(/[<][b|B][>]\s*["]?\s*/,'').replace(/\s+/,'');
      var desc = line.replace(/[<][b|B][>]/,'').replace(/[<][/][b|B][>]/,'').replace(/^\s*["]?\s*\d[A-Z]\d{3}\s*/,'');
      var subcat = this;
      if(eccnname.indexOf(this.getName()) != 0){        
        subcat = new SubCategory(this.parent, eccnname.substr(1,1), 'N/A');
        this.parent.subcats.push(subcat);        
      }
      subcat.eccns.push(new ECCN(subcat, eccnname, desc));
      return;
    }
    if(this.eccns.length > 0){
      this.eccns[this.eccns.length - 1].addLine(line);
    }
//    logger.info(line);
  }
  
  /**
   * Get the name of this sub category (i.e 0A or 1B) 
   */
  this.getName = function(){
    return ''+this.parent.name + this.name;
  }
  
  this.toXML = function(){
    var retval = "  <SubCategory name='"+this.getName()+"'>\n";
    retval += "    <description><![CDATA["+this.description+"]]></description>\n";
    for(var i in this.eccns){
      retval += this.eccns[i].toXML();
    }
    retval += "  </SubCategory>\n";
    return retval;
  }
  
  /**
   * 
   */
  this.toSQL = function(){
	  var retval = "insert into ECCN (eccn, parent, iscategory, isitar, description) values ('";
	  retval += this.getName();
	  retval += "', '";
	  retval += this.parent.name;
	  retval += "', 1, 0, '";
	  retval += this.description.replace(/[']/g,"");
	  retval += "');"
      for(var i in this.eccns){
        retval += "\n"+this.eccns[i].toSQL();
      }
	  return retval;
  }

}

/**
 * 
 * @param subcat
 * @param name
 * @param desc
 * @returns {ECCN}
 */
function ECCN(subcat, name, desc){
  this.parent = subcat;
  this.name = name;
  this.description = desc;
  this.items = new Array();
  this.reasons = null;
  /**
   * @return Classification of this type
   */
  this.getECCN = function(){
	  return this.name;
  }
 
  /**
   * Look for items
   */
  this.addLine = function(line){
    var match = line.match(/^\s*[<][i|I][>]\s*["]?\s*Items[:]/);
    if(match){
      line = line.replace(/^\s*[<][i|I][>]\s*["]?\s*Items[:]\s*[<][/][i|I][>]\s*/,'');
      if(this.isItem(line)){
        this.addItem(line);
      }
      return;
    }
    // found items already...nothing else to parse but items
    if(this.items.length > 0){

      if(this.isNote(line)){
        return;
      }
      if(this.isItem(line)){
        this.addItem(line);
      }
     return; 
    }
    
    // Look for reasons for control
    match = line.match(/^\s*[<][i|I][>]\s*Reasons? for Control[:]/);
    if(match){
      line = line.replace(/^\s*[<][i|I][>]\s*Reasons? for Control[:]\s*[<][/][i|I][>]\s*/,'');
      var tblstart = line.indexOf("<");
      if(tblstart > 0){
        this.reasons = line.substring(0,tblstart).split(/[,]\s*/);
      }
      else{
        return;
      }
      var table = line.substr(tblstart);
      table = table.replace(/[&][a-z]+[;]/g,'');
      var xml = new XML("<WRAP>"+table+"</WRAP>");
      this.controls = new Array();
      var rows = xml..TR;
      for(var i in rows){
        // headers
        if(rows[i].TD.length() == 0){
          continue;
        }
        
        // one column means just description and no ccc columns..applies to whole eccn
        if(rows[i].TD.length() == 1){
          var text = ''+rows[i].TD[0].text();
          for(var j in this.reasons){
            if(!text.match(new RegExp("(?:\\s|^)"+this.reasons[j]+"\\s"))){
              continue;
            }
            this.controls.push(this.reasons[j]);
            this.controls[this.reasons[j]] = text;
          }
          return;
        }
        if(rows[i].TD.length() > 2){
          logger.error("Not handling more than 2 columns for Reason Controls");
          return;
        }
        var col = ''+rows[i].TD[1].text();
        var desc = ''+rows[i].TD[0].text();
        if(col.toLowerCase().indexOf('column') > -1){
          col = col.replace(/Column\s/gi,'');
          if(col.match(/[A-Z]{2}\s\d/)){
            col = col.match(/[A-Z]{2}\s\d/)[0];
            this.controls.push(col);
            this.controls[col] = desc;
          }else{
            if(desc.match(/^[A-Z]{2}\s/)){
              desc += ". "+col;
              col = desc.match(/^[A-Z]{2}/)[0]
              this.controls.push(col);
              this.controls[col] = desc;
            }else{
              logger.error('not handling this '+col)
            }
          }
        }
        
      }
    }
      
    
    
  }
  
  /**
   * Test if this line is a note for the previous item
   */
  this.isNote = function(line){
    var item = this.items[this.items.length - 1];
    
    // not in a note...see if defining one
    if(!item.innote){

      // pull out full notes (notes that are ended on this line)
      var match = line.match(/[<]font[^>]*[>].+[<][/]font[>]/);
      if(match){
        
        this.addNote(item,match);
      
        line = line.replace(/[<]font[^>]*[>].+[<][/]font[>]/g,'');
        
      }
            
      // note continues past this line
      var unendedMatch = line.match(/[<]font[^>]*[>].+$/)
      if(unendedMatch){
        item.innote = true;
        this.addNote(item,unendedMatch);
        return true;
      }
      
      // parsed out a note...skip this line
      if(match){
        return true;
      }
    }
    
    // in a note already
    else{
      // see if open note ends on this line
      if(line.replace(/[<]font[^>]*[>].+[<][/]font[>]/g,'').match(/[<][/]font[>]/)){
        item.innote = false;
      }
      line = line.replace(/[<]font[^>]*[>]/g,'').replace(/[<][/]font[>]/g,'');
      item.note = (item.note + ' ' + line);
      
      return true;
    }
    
    // note a note
    return false;
  }
  
  /**
   * 
   */
  this.addNote = function(item, match){
    // can't use for in loop for match (repeats data)
    for(var i = 0; i < match.length; i++){
      if(!match[i]){
        continue;
      }
      var note = ''+match[i];
      note = note.replace(/[<]font[^>]*[>]/g,'').replace(/[<][/]font[>]/g,'');
      
      if(!item.note){
        item.note = note;
      }
      else{
        item.note = (item.note + ' ' + note);
      }
    }
  }
  
  /**
   * 
   */
  this.isItem = function(line){
    var match = line.match(/^["]?\s*[a-z][a-z0-9.]*\s+/);
    if(match){
      return true;
    }
    return false;
  }
  
  this.addItem = function(line){
    var itemname = (line.match(/^["]?\s*[a-z][a-z0-9.]*\s+/))[0].replace(/[.]\s/,'').replace(/["]/,'').replace(/\s+/,'');
    var desc = line.replace(/^["]?\s*[a-z][a-z0-9.]*\s+/,'');
    var item = new Item(this, itemname, desc);
    this.items.push(item);
  }
  
  /**
   * ECCN as xml
   */
  this.toXML = function(){
    var retval = "    <ECCN name='"+this.name+"'>\n";
    retval += "      <description><![CDATA["+this.description+"]]></description>\n";
    if(this.controls){
      retval += "      <reason><![CDATA["+this.controls.join(',')+"]]></reason>\n";
    }
    for(var i in this.items){
      retval += this.items[i].toXML();
    }
    retval += "    </ECCN>\n";
    return retval;
  }
  
  /**
   * 
   */
  this.toSQL = function(){
	  var retval = "insert into ECCN (eccn, parent, iscategory, isitar, description";
	  retval += ") values ('";
	  retval += this.getECCN();
	  retval += "', '"
	  retval += this.parent.getName();
	  retval += "', 0, 0, '";
	  retval += this.description.replace(/[']/g,"");
	  retval += "');"
	    
    // do items
    for(var i in this.items){
      retval += "\n"+this.items[i].toSQL();
    }
	  
	  if(!this.controls){
	    return retval;
	  }
	  
	  // do reasons for control
	  for(var i = 0; i < this.controls.length; i++){
	    var insert = "insert into CCLECCN (eccn, licensetype, description) values ('";
	    insert += this.getECCN();
	    insert += "', '";
	    insert += this.controls[i];
	    insert += "', '";
	    insert += this.controls[this.controls[i]].replace(/[']/g,"");
	    insert += "');";
	    CCLECCNInserts.push(insert);
	  }
	  return retval;
  }

}

/**
 * 
 * @param eccn
 * @param name
 * @param desc
 * @returns {Item}
 */
function Item(eccn, name, desc){
  this.parent = eccn;
  this.name = name;
  this.note = '';
  this.description = desc;
  /**
   * @return Classification of this type
   */
  this.getECCN = function(){
	  return this.parent.getECCN()+"."+this.name;
  }
  /**
   * 
   */
  this.toXML = function(){
    var retval = "      <Item name='"+this.name+"'>\n";
    retval += "        <description><![CDATA["+this.description+"]]></description>\n";
    if(this.note){
      retval += "        <note><![CDATA["+this.note+"]]></note>\n";
    }
    retval += "      </Item>\n";
    return retval;
  }
  
  this.toSQL = function(){
	  var retval = "insert into ECCN (eccn, parent, iscategory, isitar, description";
	  if(this.note){
		  retval += ", notes"
	  }
	  retval += ") values ('";
	  retval += this.getECCN();
	  retval += "', '"
	  retval += this.parent.getECCN();
	  retval += "', 0, 0, '";
	  retval += this.description.replace(/[']/g,"");
	  if(this.note){
	    retval += "', '"
  	    retval += this.note.replace(/[']/g,"");
	  }
	  retval += "');"
	  return retval;
  }
}

/**
 * 
 */
function CCLParser(){
  this.html = undefined;
  this.lines = undefined;
  this.categories = undefined;
  
  /**
   * 
   */
  this.constructor = function(){
    var url = 'http://ecfr.gpoaccess.gov/cgi/t/text/text-idx?c=ecfr&sid=c5cc9a1c749a6f225283bdfa124431d0&rgn=div9&view=text&node=15:2.1.3.4.45.0.1.3.87&idno=15';
    var h = new http(url);
    h.username='';
    h.password='';
    this.html = h.get.submit().data.getString();
    this.lines = this.html.split(/[\n]/);
    // TODO: find "current as of <date>" and parse out date
    var i;
    for(i in this.lines){
      if(this.lines[i].match(/Category \d+/g)){
        break;
      }
    }
    
    this.html = this.lines[i];
    this.html = this.html.replace(/[&]rdquo[;]/g,'"').replace(/[&]ldquo[;]/g,'"').replace(/[&]nbsp[;]/g,'');
    this.html = this.html.replace(/[&]rsquo[;]/g,"'").replace(/[&]lsquo[;]/g,"'");
    this.lines = this.html.replace(/[<]h5[>].*[<][/]h5[>]/,'').replace(/^[<]p[>]/,'').replace(/[<][/]p[>]/g,'').split(/[<]p[>]/);
    this.categories = new Array();
  }
  
  /**
   * Parses into categories
   */
  this.parse = function(){
    var category;
    for(var i in this.lines){
      var line = this.lines[i];
      var match = line.match(/^Category \d+/);
      
      // not a category
      if(!match){
        if(category){
          category.addLine(line);
        }
        continue;
      }
      
      match = match[0].match(/\d+/);
      var catnum = new Number(match[0]);
      var description = line.replace(/Category \d+([&]mdash[;])?/,'');
      if(description){
        if(!this.categories[catnum]){
          this.categories[catnum] = new Category(catnum,description);
          category = this.categories[catnum];
          continue;
        }
      }
      
      // never found catagory definition...could have data for previous cat
      if(category){
        category.addLine(line);
      }

    }
  }
  
  /**
   * 
   */
  this.toXML = function(){
    var retval = '';
    for(var i in this.categories){
      retval += this.categories[i].toXML();
    }   
    return retval;
  }
  
  /**
   * 
   */
  this.toSQL = function(){
    for(var i in this.categories){
    	out.println(this.categories[i].toSQL());
    }
	  
  }
  
  this.dummy = this.constructor();
}


var parser = new CCLParser();
parser.parse();
parser.toSQL();
for(var i in CCLECCNInserts){
  out.println(CCLECCNInserts[i]);
}
