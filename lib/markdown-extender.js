var ApiDoc = function (params) {
	var dest = params.dest;
	var url = params.url;
	this.urlToHTML = function() {
		var textfile;
		if (window.XMLHttpRequest)
		{       
		    textfile = new XMLHttpRequest();
		}       
		textfile.onreadystatechange = function ()
		{       
		    if (textfile.readyState == 4 && textfile.status == 200) 
		    {       
		            document.getElementById(dest).innerHTML = toHTML(textfile.responseText);
		    }       
		}       
		textfile.open("GET", url, true);
		textfile.send();
	};      
}

function toHTML(input) {

    var resources = [];

    // Parse resources outputing them as divs and pulling 
	var myExt = function(){
		var resourceFilter = [
            { type: 'lang', filter: function(source) {
                return source.replace(/(GET|POST)\s+(\/.+)/g, function(match, reqType, reqPath) {
					return '<div class="resource ' + reqPath + '" onclick=toggleLinks("' + reqPath + '")>' + reqType + '<em>' + ' ' + reqPath + ' ' + '</em>' + '</div>';
                });
            }},
            { type: 'lang', filter: function(source) {
                return source.replace(/^>(\s+.+)/gm, function(match, request) {
                    return '<pre class="request">' + request + '</pre>';
                });
            }}, 
            { type: 'lang', filter: function(source) {
                return source.replace(/^<(\s+.+)/gm, function(match, response) {
                    return '<pre class="response">' + response + '</pre>';
                }); 
            }} 			
		];	
        return resourceFilter;
	};
        var converter = new Showdown.converter({extensions: [myExt]});
        var ret = converter.makeHtml(input);	
    return ret;
};

function generateTOC(input){
    var myDiv = document.getElementById('content'); 

    // Use querySelectorAll if it exists
    // This includes all modern browsers
    if(myDiv.querySelectorAll){
        var toc = myDiv.querySelectorAll('h2');
	var list = document.createElement('ul');
	
	for(var i = 0; i < toc.length; i++) {
        var listItem = document.createElement('li');
		var title = toc[i].innerHTML;
		var link = document.createElement('a');
		var linkText = document.createTextNode(title);
		
		link.appendChild(linkText);
		link.href = '#' + toc[i].id;
		listItem.appendChild(link);
		list.appendChild(listItem);
        }
	document.getElementById('toc').innerHTML = document.getElementById('toc').innerHTML +  list.innerHTML;	
    }
}

function groupCodeExamples() {
    var all = document.getElementById('content').children;
    var initialElements = all.length;    
    var final = document.createElement('div');
	for (var i = 0; i < initialElements; i++) {
        var currElement = all[i];
        var copy;
        if (["request","response"].indexOf(currElement.className) > -1) {
            var currClass = currElement.className;
            var exampleDiv = document.createElement('div');
            exampleDiv.className = currClass;
            do
              {
            copy = currElement.cloneNode(true);
            exampleDiv.appendChild(copy);
            currElement = all[++i];
              }
            while ((currElement.className).indexOf(currClass) > -1); 
            final.appendChild(exampleDiv);
            --i;
        } else {
            copy = currElement.cloneNode(true);
            final.appendChild(copy);
        }
	}
    document.getElementById('content').innerHTML = final.innerHTML;
}

function toggleCodeLang(lang) {
        var hide = document.getElementsByClassName("lang")
        for(var i = 0; i < hide.length; i++) {
            hide[i].style.display = "none";
            }
        var buttons = document.getElementsByClassName("toggleLang");
        for(var i = 0; i < buttons.length; i++) {
                buttons[i].removeAttribute("style");
        }
        var show = document.getElementsByClassName("lang " + lang);
        for(var i = 0; i < show.length; i++) {
            show[i].style.display = "block";
        }
		document.getElementsByClassName("toggleLang " + lang)[0].style.color = "#FF5714";
}

function generateLangOptions(options) {
        var list = document.createElement('ul');

        for(var i = 0; i < options.length; i++) {
                var listItem = document.createElement('span');
		listItem.innerHTML = '<button class="toggleLang ' + options[i] + '" onclick=toggleCodeLang("' + options[i] + '")>' + options[i] + '</button>';
                list.appendChild(listItem);
	}
        document.getElementById('langs').innerHTML = list.innerHTML;
}

function toggleLinks(requestPath) {
	var parent = document.getElementsByClassName("resource " + requestPath);
	var path = document.getElementById(requestPath);
	var links = ["Live => https://sgraph.opendns.com", "Proxy => https://proxy-sgraph.apiary.io"];
	if (!path) {
		var allLinks = document.createElement('ul');
		allLinks.id = requestPath;
		for (var i = 0; i < links.length; i++) {
			var link = document.createElement('li'); 
			link.innerHTML = links[i] + requestPath;
			allLinks.appendChild(link);
		}
		allLinks.style.display = "block";
		parent[0].appendChild(allLinks);
	} else if (path.style.display == "block") {
		path.style.display = "none";
	} else {
		path.style.display = "block";
	}
} 

