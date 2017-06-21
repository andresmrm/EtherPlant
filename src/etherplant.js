/*
 * @preserve
 * etherplant
 * 
 * Module name: etherplant
 * Version:     to be completed
 * Created:     20 Nov 2014 by andresmrm
 * 
 * Copyleft (C) 2014 - 2015 andresmrm
 * Copyleft (C) 2015 - 2015 Orange
 * 
 * GNU AFFERO GENERAL PUBLIC LICENSE Version 3
 * 
 */

// URL to PlantUML Server. Don't forget the last "/"
var PLANTUML_SERVER="http://plantuml.com/plantuml/";
// Use (or not) plantuml proxy mode for latest diagram URL.
// This option is set to false because it doesn't work with the latest PlantUML server proxy mode !!!

var USE_PROXY_PLANTUML_MODE=false;

var lastContent = "";
var imgType="img";
var cod;
var posX;
var posY;
var previousEvent;
var selectedDynamicType="svg";
var elaspedTime=0;
var timer;
var refreshMode=10;
var urlParam;

var typeTranslations={
    "svg": "SVG",
    "txt": "ASCII Art",
    "img": "PNG"
};

function launchRefreshTimer() {
    if (refreshMode==0) {
        clearInterval(timer);
 		$("#next-refresh").hide();
    } else {
		$("#next-refresh").text(refreshMode+"s");
 		$("#next-refresh").show();
		elaspedTime=0;
		clearInterval(timer);
		timer=setInterval(function() {
            elaspedTime++;
            if (elaspedTime>=refreshMode) {
				updateImage();
				elaspedTime=0;
            }
			var nextRefresh=refreshMode-elaspedTime;
            $("#next-refresh").text(nextRefresh+"s");
		}, 1000);
    }
}

function compress(s) {
    //Check if text changed
    if (lastContent != s){
        clearInterval(timer);
		lastContent = s;
		$("#refresh-mode").attr("disabled", "disabled");
        $("#refresh-button").attr("disabled", "disabled");
		//UTF8
		cod=convertTxt(s);
		// force link refresh for first image generation
		$("#export-links").change();
		$("#diagram").on("load", function() {
			launchRefreshTimer();
			$("#refresh-button").removeAttr("disabled");
			$("#refresh-mode").removeAttr("disabled");
		}).attr("src", linkTo(cod, imgType));
    }
}

function convertTxt(s) {
    //UTF8
    s = unescape(encodeURIComponent(s));
    s = RawDeflate.deflate(s);
    return Base64.encode(s);
}


function linkTo(cod, type) {
    return PLANTUML_SERVER+type+"/"+cod;
}

function updateImage() {
    $.ajax({
		url: urlParam+"/export/txt",
		success: function( response ) {
			compress( response ); // server response
		}
    });
}

function draggable(e) {
    e.preventDefault();
    
    posX=$("#viewer").scrollLeft();
    posY=$("#viewer").scrollTop();
    
    previousEvent = e;
    $(document).on('mousemove', drag);
    $(document).on('mouseup', removeDrag);
}

function removeDrag() {
    $(document).off('mouseup');
    $(document).off('mousemove');
}

function drag(e) {
    e.preventDefault();

    posX -= (e.pageX -previousEvent.pageX);
    posY -= (e.pageY - previousEvent.pageY);

    previousEvent = e;
    $("#viewer").scrollTop(posY);
    $("#viewer").scrollLeft(posX);
}


$(function() {
    $("#diagram").on('mousewheel DOMMouseScroll', function(e) {
		var deltaY = 0;
		e.preventDefault();
		if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
			$(this).css("width", "+=25%");
		}else {
			$(this).css("width", "-=25%");
		}
    });
    $("#diagram").on('mousedown', draggable);

    $("#refresh-button").on("click", function() {
		elaspedTime=0;
		updateImage();
    });

    $("#refresh-mode").change(function(){
        var selected=$( "#refresh-mode option:selected" );
		refreshMode=selected.val();
		launchRefreshTimer();
		window.location.hash = refreshMode;

    });

    $("#export-links").change(function(){
        var selected=$( "#export-links option:selected" );
        if (m=selected.val().match(/^(current|last)-(svg|img|txt)$/)) {
			if (m[1]=="last") {
				if (USE_PROXY_PLANTUML_MODE) {
					$("#export-link").show();
					$("#export-input").hide();
					$("#export-link").attr("href", PLANTUML_SERVER+"proxy?src="+urlParam+"/export/txt&fmt="+m[2]).text("Last diagram "+typeTranslations[m[2]]+" link");
				}else {
					$("#export-link").hide();
					$("#export-input").show();
					$("#export-input").val(window.location.toString().replace('?', "?"+m[2]+"&"));
				}
			} else {
				$("#export-link").show();
				$("#export-input").hide();
				$("#export-link").attr("href", linkTo(cod, m[2])).text(typeTranslations[m[2]]+" diagram");
			}
        } else {
			$("#export-link").show();
			$("#export-input").hide();
			$("#export-link").attr("href", "?fs&"+urlParam).text("Auto-refresh diagram");
		}
    });
    
    $("#padurl").keypress(function (e) {
		if (e.which == 13) {
			$("#load-pad").trigger("click");
		}
    });

    $("#load-pad").on("click", function() {
		urlParam=$("#padurl").val();
		window.location="?"+urlParam;
    });
    
    urlParam = window.location.search.substr(1);
    // Bug fix : replace %20 (space) in pad name by _
    urlParam=urlParam.replace(/%20/g, "_");

    if (m=window.location.hash.match(/^#(0|5|10|15|20|30)$/)) {
		refreshMode=m[1];
    }

    // Retrieve pad name in etherpad URL
    if (urlParam && urlParam.match(/.*\/(.*)$/)) {
		var pad_name=urlParam.match(/.*\/(.*)$/)[1];
		if (pad_name) {
			document.title = "EtherPlant - "+pad_name;
		}
    }

    if(m=urlParam.substr(0,8).match(/^(svg|img|txt)&http$/)){
        // Just result view
        $("body > div").hide();
		$("frame").hide();
		urlParam=urlParam.substr(4);
		$('body').append('<p>Rederecting to image...</p>');
		$.ajax({
			url: urlParam+"/export/txt",
			success: function( response ) {
				encoded = convertTxt(response);
				window.location = linkTo(encoded, m[1]);
			}
		});
    } else {
		// Main page with Etherpad and Result view
		$(".not-working").hide();
		var layout=$('body').layout({
			north__size: 50,
			north__minSize: 50,
			north__maxSize: 50,
			north__resizable: false,
			south__size: 30,
			south__minSize: 30,
			south__maxSize: 30,
			south__resizable: false,
			west__minSize: 0,
			west__size: .50,
			west__maskContents: true,
			center__size: .50,
			center__minSize: 0,
			center__maskContents: true,
			stateManagement__enabled: true
		});
		if (window.location.hash.match(/svg/)) {
			// If hash #svg use SVG for display image result. Fix limitations on PNG generated with plantuml.com server
			imgType="svg";
		}
		if (m=urlParam.substr(0,7).match(/^(fs&)?http/)) {
			if (m[1]=="fs&") {
				layout.hide( "west" );
				layout.open( "center" );
				layout.hide( "north" );
				layout.hide( "south" );
				urlParam=urlParam.substr(3);
			} else {
				$("#padurl").val(urlParam);
				layout.open( "west" );
				layout.open( "center" );
				layout.open( "north" );
				layout.open( "south" );
				$("#pad-iframe").attr("src", urlParam+"?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=true");
			}
			$("#refresh-mode").val(refreshMode);
			launchRefreshTimer();
			updateImage();
		} else{
			// No pad name given
			$(".working").hide();
			$(".not-working").show();
		}
    }
});
