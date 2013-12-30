showdown-extender
=================

Markdown to HTML converter extension that generates code examples and TOC

What Does This Do?
---

This is an extension for [Showdown](https://github.com/coreyti/showdown). It can generate a table of contents by looking at the H2 headers in the document specified. It (will eventually) also generate code samples from templates that are provided by the user. 

How Do I Use It?
---

In index.html:

`var apidoc = new ApiDoc({
    element: 'content', 
	url: 'docs.md',
	toc: true,
	langs: ["HTTP", "Curl", "JavaScript", "Node.js", "Python", "PHP", "Ruby"] 
    });`

* `element` is the id of the element where the converted markdown will go.
* `url` is the location of the markdowsn file to be converted.
* `toc` can be true or false. If it is true, a table of contents will be generated from all of the H2 headers in the converted markdown.
* `langs` is where the languages of the code samples should be placed. Currently, this takes extra work to function properly. See below.

Using 'langs' parameter in Apidoc
---

For now, 'langs' takes in an array of strings, where each string is the language of the code example. From this array, buttons are created for each object in the array, and links to the anchor 'lang {language of code example}'. In the markdown, the user must also specify where the code examples are and specify the divs with the class set to 'lang {language of code example}'.

Example:

`
REQRESEX

GET /domains/score/{name}

<div class="lang HTTP">
> This is an HTTP 
> example request
</div>
<div class="lang Curl">
> This is 
> a Curl example 
</div>
<div class="lang JavaScript">
> This is 
> a JavaScript
> example
</div>

< This is an example response

/REQRESEX
`

* `REQRESEX` specifies where the code example begins and ends.
* `<div class="lang {language of code example}"` is what the generated buttons from the `langs` parameter will link to.
* `>` specifies a request.
* `<` specifies a response.
In this example, the `langs` parameter would be ["HTTP", "Curl", "JavaScript"]

While this this is not ideal, this is the first phase. In the future, the code examples will be generated from templates provided by you and there will be no need for manually insterting the divs in an example. You will only have to specify a few response and request lines and the template(s) will be filled out.


 
