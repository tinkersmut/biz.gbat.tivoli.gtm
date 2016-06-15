var HTTP = {};

/**
 * Get the web page for the specified url
 * 
 * @return httppage as a string of HTML
 */
HTTP.getWebPage = function(url){
  var h = new http(url);
  h.username='';
  h.password='';
  var bytes = java.lang.Class.forName("com.trm.javascript.bridge.io.ByteArray").getMethod("getByteArray",null).invoke(h.get.submit().data, null);
  var html = new java.lang.String(bytes,"UTF-8");
  html = html+"";
  // replace the xml declaration at the top if there is one (breaks our xml parser)
  html = html.replace(/^[<][?]xml[^>]+[>]/,'').replace(/^[\s]+/,'');
  return html;
}

/**
 * 
 */
HTTP.UTILS = {};

/**
 * Fetches the HTML for the specified element which is found by the specified classname. Assumes the classname is unique to that specific element.
 */
HTTP.UTILS.getElementByClassName = function(httppage, classname, elementname){
 var match = httppage.match(new RegExp('[<]'+elementname+'[^>]+class[=]["]'+classname+'["][^>]+[>]'));
 var start = httppage.indexOf(match[0]);
 var endtag = "</"+elementname+">";
 var end = httppage.indexOf(endtag, start);
 httppage = httppage.substring(start,(end+endtag.length));
 httppage = httppage.replace(/[&][a-z]+[;]/g,'"');
 return new XML(httppage); 
}

var CCC = {};

/**
 * @return Array of column names (i.e CB 1, CB 2...etc)
 */
CCC.getColumns = function(table){
  var headers = table.TR[1].TH;
  var retval = new Array(headers.length());
  for(var i in headers){
    retval[i] = headers[i].text();
  }
  return retval;
}

/**
 * @return Object associating column headers with their descriptions (i.e CB=Chemical and biological weapons)
 */
CCC.getColumnDescriptions = function(table, columns){
  // column header abbreviations (i.e CB, NS, etc) in order
  var columnabrs = new Array();
  for(var i in columns){
    var abr = columns[i].match(/\w{2}/)[0];
    if(!columnabrs[abr]){
      columnabrs[abr] = true;
      columnabrs.push(abr);
    }
  }
  
  var headers = table.TR[0].TH;
  var retval = new Object();
  for(var i in headers){
    // countries
    if(i == 0){
      continue;
    }
    retval[columnabrs[i-1]] = headers[i].text();
  }
  return retval;
}

/**
 * @return Array of country names as listed in the table
 */
CCC.getCountries = function(table){
  var retval = new Array(); 
  var rows = table.TR;
  for(var i in rows){
    if(rows[i].TD.length() < 1){
      continue;
    }
    retval.push(rows[i].TD[0].text());
  }
  return retval;
}

CCC.createSQLForRow = function(row, columns){
  var sql = "insert into CCLCHART (country, licensetype) values ('";
  
  // *special case...right now just marking as always needing licenses
  if(row.TD.length() == 2){
    for(var i in columns){
      var insertsql = sql + row.TD[0].text();
      insertsql += "', '";
      insertsql += columns[i];
      insertsql += "')";
      out.println(insertsql);
    }
    return;
  }
  
  // each column with an X means you need a license
  for(var i in row.TD){
    // country
    if(i == 0){
      continue;
    }
    // no license
    if(row.TD[i].text() != 'X'){
      continue;
    }
    if((i-1) >= columns.length){
      logger.error("i too big!");
      throw 'index out of bounds '+(i-1);
    }
    var insertsql = sql + row.TD[0].text();
    insertsql += "', '";
    insertsql += columns[i-1];
    insertsql += "');";
    out.println(insertsql);
  }
  
}

/**
 * 
 */
CCC.createSQL = function(table){
  var columns = CCC.getColumns(table);
  var descs = CCC.getColumnDescriptions(table, columns);
  var countries = CCC.getCountries(table);
  
  // create an insert for each X in the table
  var rows = table.TR;
  for(var i in rows){
    
    // header row
    if(rows[i].TD.length() < 1){
      continue;
    }
    CCC.createSQLForRow(rows[i], columns);
  }
}


var url = 'http://ecfr.gpoaccess.gov/cgi/t/text/text-idx?c=ecfr&sid=59ee1d5eeb8f1d444ba88927fa1eaaff&rgn=div9&view=text&node=15:2.1.3.4.24.0.1.5.27&idno=15';
var html = HTTP.getWebPage(url);
var table = HTTP.UTILS.getElementByClassName(html, 'gpotbl_table', 'TABLE');
CCC.createSQL(table);