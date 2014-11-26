url_param = window.location.search.substr(1);
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

var deflater = window.SharedWorker && new SharedWorker('rawdeflate.js');
if (deflater) {
	deflater.port.addEventListener('message', done_deflating, false);
	deflater.port.start();
} else if (window.Worker) {
	deflater = new Worker('rawdeflate.js');
	deflater.onmessage = done_deflating;
}

function done_deflating(e) {
	cod = encode64(e.data);
	//$('#im').src = "http://www.plantuml.com/plantuml/svg/"+encode64(e.data);
	$("#png-link").attr("href", link_to_png(cod));
	$("#svg-link").attr("href", link_to_svg(cod));
	$.ajax({
		url: link_to_svg(cod),
		dataType: 'text',
		success: function( response ) {
			$("#sv").html(response);
		}
	});
}

function compress(s) {
	//Check if text changed
	if (last_content != s){
		last_content = s;

		//UTF8
		s = unescape(encodeURIComponent(s));

		if (deflater) {
			if (deflater.port && deflater.port.postMessage) {
				deflater.port.postMessage(s);
			} else {
				deflater.postMessage(s);
			}
		} else {
			setTimeout(function() {
				done_deflating({ data: deflate(s) });
			}, 100);
		}
	}
}

function convert_txt(s) {
	//UTF8
	s = unescape(encodeURIComponent(s));
	s = deflate(s);
	return encode64(s);
}

function link_to_svg(cod) {
	return "http://www.plantuml.com/plantuml/svg/"+cod;
}
function link_to_png(cod) {
	return "http://www.plantuml.com/plantuml/png/"+cod;
}
function link_to_dinamic_svg(pad_url) {
	return window.location.toString().replace('?', "?svg&");
}

function updateImage() {
	$.ajax({
		url: url_param+"/export/txt",
		success: function( response ) {
			compress( response ); // server response
		}
	});
}

$(function() {
	var resizehandler = {
		handles: 'n,s,e,w,sw,se,ne,nw'
	};
	$(".moveable").resizable(resizehandler);

	// Working page
	if (url_param.substr(0,4) == "http") {
		$(".not-working").hide();
		setInterval( "updateImage()", 5000 );
		$("#pad-iframe").attr("src", url_param+"?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=true");
		$("#svg-dinamic").attr("href", link_to_dinamic_svg(url_param));
	
	// Redirect to the SVG image
	} else if(url_param.substr(0,8) == "svg&http"){
		$(".working").hide();
		$(".not-working").hide();
		$('body').append('<p>Rederecting to image...</p>');
		$.ajax({
			url: url_param.substr(4)+"/export/txt",
			success: function( response ) {
				encoded = convert_txt(response);
				window.location = link_to_svg(encoded);
			}
		});

	// Main-Help page
	} else{
		$(".working").hide();
		$(".not-working").show();
	}
});
