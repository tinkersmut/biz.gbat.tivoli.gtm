String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, '');
}

scripterrors.THROW=true;

wordWrap = function(thestring, m, b, c){
    var i, j, s, r = thestring.split("\n");
    if(m > 0) {
      for(i in r){
        for(s = r[i], r[i] = ""; s.length > m;
            j = c ? m : (j = s.substr(0, m).match(/\S*$/)).input.length - j[0].length
            || m,
            r[i] += s.substr(0, j) + ((s = s.substr(j)).length ? b+"    " : "")
        );
        r[i] += s;
      }
    }
    return r.join("\n");
};

//return the identifier corresponding to a given product name.
getProductId = function(productName,jdbcConnection) {
  productName = productName.toLowerCase();
  return jdbcConnection.PRODUCTS.subset(" LOWER(name) = '" + productName + "'" )[0].id;
}


//if a comment starts with 
//VERIFIED use that comment else take the first one.
getPrintableComment = function(cmnts) {    
  var dfltComment = cmnts[0].thetext;
  for (var i = 0; i < cmnts.length; i++){
    var currComment = "" + cmnts[i].thetext;
    currComment = currComment.trim();
    if(currComment.indexOf("VERIFIED") == 0)
      return wordWrap(currComment.substr("VERIFIED".length));    
  }
  return dfltComment;
}

//return all the rows of the specified field of the given table
//with an optional where clause.
getColumn = function(jdbcConnection,table,field,whereClause) {
  var column = new Array();
  if(whereClause == undefined || whereClause == "")
    var set = jdbcConnection[table].subset('1 = 1');
  else 
    var set = jdbcConnection[table].subset(whereClause);
  
  println("set " + set);    
  for(var i =0;i< set.length;i++) {
    column.push("" + set[i][field]);
  }
  return column;
}

println("starting");
var j = new JDBCConnection("jdbc:mysql://sourcesafe:3306/bugs","root","","org.gjt.mm.mysql.Driver");

//get the desired product id.
var products = getColumn(j,"PRODUCTS","name");
println("Product options: " + products);
var product = inquire("What is the Product?");
var productId = getProductId(product,j);

//get the milestone.
var milestones = getColumn(j,"MILESTONES","value"," product_id = '" + productId + "' " );
println(" Possible milestones: " + milestones);
var milestone = inquire("What is the target milestone? ");
milestone = "'" + milestone + "'";
milestone = milestone.replace(",","','");

//get the destination file name.
var filename = inquire("Enter Destination Filename: ")


var mainset = j.BUGS.subset("product_id='"+productId+"' and bug_status in('VERIFIED','CLOSED') and target_milestone in(" + milestone + ") and resolution not in ('INVALID') ");
println(mainset)
println(mainset.length)

var html = <html/>;
html.body.h3 = "Bugs Found: ";
html.body.h3.@size="+2";
html.body.table.tr = "";
html.body.table.@border=1;
html.body.table.@width="80%";
html.body.table.tr[0].th[0]="Bug #";
html.body.table.tr[0].th[1]="Severity";
html.body.table.tr[0].th[3]="Description";
var tblrow=0;

var totalBugs = 0;
var severities = ['blocker','critical','major','normal','minor','trivial','enhancement'];
for(var s = 0;s< severities.length;s++)
{
  tblrow++;
  var set = mainset.subset(" bug_severity='" + severities[s] + "' ");
  var len = set.length;
  println("s " + s + " severities " + severities[s] + " "+ set.length);
  
  html.body.table.tr[tblrow] = "";
  html.body.table.tr[tblrow].td[0] ="";
  html.body.table.tr[tblrow].td[0].bold = "";
  html.body.table.tr[tblrow].td[0].bold.A = severities[s].toUpperCase();
  html.body.table.tr[tblrow].td[0].bold.A.@name=severities[s];
  html.body.table.tr[tblrow].td[0].@colspan = "3";
          
  
  for (var i = 0;i<len;i++){
    tblrow++;
    html.body.table.tr[tblrow]="";
    html.body.table.tr[tblrow].td[0] = "";
    html.body.table.tr[tblrow].td[0].A = set[i].bug_id;
    html.body.table.tr[tblrow].td[0].A.@name = set[i].bug_id;
    html.body.table.tr[tblrow].td[0].@width = "5%"
    
    if (set[i].bug_severity == "major" || set[i].bug_severity == "critical" || set[i].bug_severity == "blocker"){
      html.body.table.tr[tblrow].td[1] = "";
      html.body.table.tr[tblrow].td[1].font.b = set[i].bug_severity
      html.body.table.tr[tblrow].td[1].font.@color="red";
    }
    else{
        html.body.table.tr[tblrow].td[1] = set[i].bug_severity
    }
    html.body.table.tr[tblrow].td[1].@width = "5%"

    html.body.table.tr[tblrow].td[2] = set[i].short_desc;

    //look up comments
    var cmnts = j.LONGDESCS.subset("bug_id = '"+set[i].bug_id+"'");
    if (cmnts.length > 0){
        tblrow++;
        html.body.table.tr[tblrow] = "";
        html.body.table.tr[tblrow].td[0] ="";
        html.body.table.tr[tblrow].td[1] ="";
        html.body.table.tr[tblrow].td[2] ="";
        html.body.table.tr[tblrow].td[2].pre[0] ="";
        html.body.table.tr[tblrow].td[2].pre = getPrintableComment(cmnts);
        //html.body.table.tr[tblrow].td[1].@colspan = "2";       
    }//comments
  }//for each bug.

  totalBugs +=len;
} //for each severity.
  
  html.body.h3 += totalBugs;
  var f = new File("c:/trmscriptengine/temp/"+filename);
  if (!f.exists){
    f.create();
  }
  f.setLines(new Array(""));
  f.append(html);
  println(f.fullpath)
