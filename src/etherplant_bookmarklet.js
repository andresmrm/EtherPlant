//$.getScript("//code.jquery.com/ui/1.11.2/jquery-ui.min.js");
$.getScript("https://github.com/johan/js-deflate/raw/master/rawdeflate.js");
last_content = "";                                
function encode64(data) {
        r = "";
        for (i=0; i<data.length; i+=3) {
                 if (i+2==data.length) {
                        r +=append3bytes(data.charCodeAt(i), data.charCodeAt(i+1), 0);
                } else if (i+1==data.length) {
                        r += append3bytes(data.charCodeAt(i), 0, 0);
                } else {
                        r += append3bytes(data.charCodeAt(i), data.charCodeAt(i+1), data.charCodeAt(i+2));
                }
        }
        return r;
}
function append3bytes(b1, b2, b3) {
        c1 = b1 >> 2;
        c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
        c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
        c4 = b3 & 0x3F;
        r = "";
        r += encode6bit(c1 & 0x3F);
        r += encode6bit(c2 & 0x3F);
        r += encode6bit(c3 & 0x3F);
        r += encode6bit(c4 & 0x3F);
        return r;
}
function encode6bit(b) {
        if (b < 10) {
                 return String.fromCharCode(48 + b);
        }
        b -= 10;
        if (b < 26) {
                 return String.fromCharCode(65 + b);
        }
        b -= 26;
        if (b < 26) {
                 return String.fromCharCode(97 + b);
        }
        b -= 26;
        if (b == 0) {
                 return '-';
        }
        if (b == 1) {
                 return '_';
        }
        return '?';
}
function compress(s) {
  //UTF8
  s = unescape(encodeURIComponent(s));
  s =deflate(s);
  return encode64(s);
}
function updateImage() {
    texto = "";
    lista = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").find("div");
    $.each(lista, function( index, value ) {
        id = value.id;
        content = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#"+id).text()
        texto = texto + content + "\n";

    //console.log( index + ": " + value.innerHTML);

    });

    

    //texto = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").text();

    if (last_content != texto){

    //last_content = texto;

    compressed = compress( texto );

    //console.log(texto);

    //console.log(compressed);

    $.ajax({

    url: "http://www.plantuml.com/plantuml/svg/"+compressed,

    dataType: 'text',

    success: function( response ) {

    $("#sv").html(response);

    //$("#viewer").attr("href","http://www.plantuml.com/plantuml/svg/"+compressed);

    }

    });

    }

}
$('body').append('<div id="viewer" class="moveable working" style="width:500px; height:500px; z-index:1000; left:600px; position: absolute; top: 150px;"><div id="sv" style="width:500px; height:500px"></div></div>');
//$('body').append('<iframe href="" id="viewer" class="moveable working" style="width:500px; height:500px; z-index:1000; left:600px; position: absolute;"></iframe>');
$(function() {

    setInterval( "updateImage()", 5000 );

//var resizehandler = {            handles: 'n,s,e,w,sw,se,ne,nw'    };
//$(".moveable").resizable(resizehandler);
});
//console.log($('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").text());
