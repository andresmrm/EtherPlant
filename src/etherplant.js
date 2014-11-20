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
	//$('#im').src = "http://www.plantuml.com/plantuml/svg/"+encode64(e.data);
	$("#png-link").attr("href", "http://www.plantuml.com/plantuml/png/"+encode64(e.data));
	$("#svg-link").attr("href", "http://www.plantuml.com/plantuml/svg/"+encode64(e.data));
	$.ajax({
		url: "http://www.plantuml.com/plantuml/svg/"+encode64(e.data),
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

	if (url_param.substr(0,4) == "http") {
		$(".not-working").hide();
		setInterval( "updateImage()", 5000 );
		$("#pad-iframe").attr("src", url_param+"?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=true");
	} else {
		$(".working").hide();
		$(".not-working").show();
	}
});

