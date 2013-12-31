OpenDNS Security Graph REST API
===

introductions
---

Welcome to the OpenDNS Security Graph API. Access to this API requires an access token, configurable from your [account settings](https://sgraph.opendns.com/tokens-view). This service allows the querying of the OpenDNS DNS database and goes beyond traditional DNS results to show security events and correlations in our datasets. 
The Security Graph is the interface to the security data collated by our research team. The RESTful API opens up the power of the Security Graph’s classification results, correlation, and history and is based on 50 billion DNS queries per day, seen by over 19 data centers serving 40 million users in 150+ countries. 
These results are generated dynamically and in real time, acting as a counter to today’s advanced persistent threats targeting enterprises that rely on traditionally static defense devices.

The OpenDNS Security Graph API is organized around the principles of [REST](http://en.wikipedia.org/wiki/Representational_State_Transfer).
Our API lets you gather results from Security Graph with anything that can send an HTTP request, including cURL and modern internet browsers.
There are many things you can do with our REST API, for example:

* Check the security status of a domain, IP address or subset of domains that appear in the logs from your firewall, UTM or other Internet egress points
* Determine whether other related, co-occuring domains were accessed at the same time as the domain or IP you're looking up
* Find a historical record for this domain or IP address in our DNS database to see what has changed
* Query large numbers of domains quickly to find out whether they're scored as malicious and require further investigation


about the API
---

The information provided in the OpenDNS Security API is the result of statistical analysis run against DNS traffic and oriented toward security research. These results are generated from the terabytes of DNS traffic to the OpenDNS DNS resolvers and not from samples of infected websites or clients.  As such, they are considered to be predictors or indicators of potentially malicious domains or IPs.
With the exception of the Domain Score, the scores generated for any given IP or domain are intended to assist with predictive analysis and to find additional information regarding network activity deemed suspicious as part of research into security incidents.

OpenDNS reserves the right to add fields to the API endpoints and methods listed below. However, we will not remove any of the endpoints listed below in future versions of the API.



authentication
---

You authenticate to the Security Graph API by providing one of your API access tokens in the request. You can create and manage your API access tokens from your [account settings](https://sgraph.opendns.com/tokens-view). You can have multiple API access tokens active for use at a given time. Your API access tokens carry many privileges, so be sure to keep them secret and do not expose them on public web resources! 

Authentication to the API occurs by providing your access token in the authorization header *via [HTTP Basic Auth](http://en.wikipedia.org/wiki/Basic_access_authentication).* Provide your API access token as the basic auth username for API queries; there's no need to provide your username or password from the Security Graph user interface.

All API requests must be made over [HTTPS](http://en.wikipedia.org/wiki/HTTP_Secure). Calls made over plain HTTP will fail. You must supply a valid access token in all requests.

Authentication to the Security Graph GUI is controlled by the [account settings](https://sgraph.opendns.com/account-view).  This is where you can add additional administrative accounts and provision or delete API tokens.




requests
---

All of the API endpoints listed below conform to the same syntax of being appended to the end of an authenticated query, which will always begin with `https://sgraph.api.opendns.com/`.  Once you have your access token, follow the syntax in this example. Using the cURL command line, substitute your token for the %variable%:

`curl -i -H "Authorization: Bearer %YourToken%" "https://sgraph.api.opendns.com/dnsdb/name/a/example.com.json"`

This request should return HTTP/1.1 200 OK and results from the Security Graph.  If it does not, look to the HTTP codes to determine if the command or token are valid.
For future queries, remove the `-i` to return only results from Security Graph. Nearly all requests to Security Graph are GET requests; the only exception is a POST request Domain Scores for multiple domains.

Requests can also be done directly in a browser that's already authenticated with the Security Graph by entering the URL of the query in the address bar.



error handling
---

Security Graph uses conventional HTTP response codes to indicate success or failure of an API request. 
In general, codes in the 2xx range indicate success, codes in the 4xx range indicate an error that resulted from the provided information, and codes in the 5xx range indicate an error with OpenDNS's servers.

*HTTP Responses:*

* **`200 OK`** - Everything worked as expected.
* **`204 OK`** - Everything worked as expected but no content was returned. The domain classifier service returns this for domains OpenDNS has no information on.
* **`400 Bad Request`** - Likely missing a required parameter, or malformed JSON. Please check the syntax on your query.
* **`403 Unauthorized`** - Request had Authorization header but token was missing or invalid. Please ensure your API token is valid.
* **`404 Not Found`** - The requested item doesn't exist, check the syntax of your query or ensure the IP and/or domain are valid.
* **`500, 502, 503, 504 Server errors`** - something went wrong on our end.


domain scores
---

This API method is the quickest and easiest way to know whether a domain has been flagged as malicious by
the Umbrella security team (score of -1), if it is believed to be safe (score of 1), or if it hasn't been
categorized yet (score of 0). _This score should be considered authoritive over all other Security Graph scores_. 

To query for more than 1 domain at a time, use the POST example below and post a list of domains as an array. 
This method will accept up to 1000 domains in a single request.

sample query for a single domain: `curl -H "Authorization: Bearer %YourToken%" "https://sgraph.api.opendns.com/domains/score/example.com"`

sample query for multiple domains:
`curl -H "Authorization: Bearer %YourToken%" ---request POST "https://sgraph.api.opendns.com/domains/score/" -d '["example.net","example.org,","example.com"]'`

**Parameter for input**

<table>
    <thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    <tr>
    </thead>
    <tr>
        <td>name</td><td>string</td><td>domain name</td>
    </tr>
</table>

**Returned value for output if Success 200**

<table>
    <thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    <tr>
    </thead>
    <tr>
        <td>score</td><td>string</td><td>The score will be "-1" if the domain is believed to be malicious, "1" if the domain is believed to be benign, "0" if it hasn't been classified yet</td>
    </tr>
</table>


### REQUEST AND RESPONSE EXAMPLES  

REQRESEX

GET /domains/score/{name}

<div class="lang HTTP">
> Authorization: Bearer %YourToken%
</div>
<div class="lang Curl">
> curl --include --header "Authorization: Bearer %YourToken%" \
>     "https://sgraph.apiary.io/domains/score/{name}"
</div>
<div class="lang JavaScript">
> var Request = new XMLHttpRequest();

> Request.open('GET', 'https://sgraph.opendns.com/domains/score/{name}');

> Request.setRequestHeader('Authorization', 'Bearer %YourToken%');

> Request.onreadystatechange = function () {
>   if (this.readyState === 4) {
>     console.log('Status:', this.status);
>     console.log('Headers:', this.getAllResponseHeaders());
>     console.log('Body:', this.responseText);
>   }
> };

> Request.send(JSON.stringify(body));
</div>
<div class="lang Node.js">
> var request = require('request');

> request({
>   method: 'GET'
>   url: 'https://sgraph.opendns.com/domains/score/{name}',
>   headers: {
>     'Authorization': 'Bearer %YourToken%'
>   }undefined}, function (error, response, body) {
>   console.log('Status:', response.statusCode);
>   console.log('Headers:', JSON.stringify(response.headers));
>   console.log('Response:', body);
> });
</div>
<div class="lang Python">
> from urllib2 import Request, urlopen

> headers = {
>   'Authorization': 'Bearer %YourToken%'
> }

> request = Request('https://sgraph.opendns.com/domains/score/{name}', headers=headers)

> response_body = urlopen(request).read()
> print response_body
</div>
<div class="lang PHP">
> $ch = curl_init();

> curl_setopt($ch, CURLOPT_URL, "https://sgraph.opendns.com/domains/score/{name}");
> curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
> curl_setopt($ch, CURLOPT_HEADER, FALSE);
 
> curl_setopt($ch, CURLOPT_HTTPHEADER, array(
>   "Authorization: Bearer %YourToken%"
> ));
 
> $response = curl_exec($ch);
> curl_close($ch);
 
> var_dump($response);
</div>
<div class="lang Ruby">
> require 'rubygems'
> require 'rest_client'

> response = RestClient.GET 'https://sgraph.opendns.com/domains/score/{name}', headers
> puts response
</div>

#### HTTP 200

< Content-Type: application/json
< {
<    "example.com":1
< }

/REQRESEX

REQRESEX

POST /domains/score/

<div class="lang HTTP">
> Authorization: Bearer %YourToken%
> ["example.org", "example.net", "example.com"]
</div>

<div class="lang Curl">
> curl --include --header "Authorization: Bearer %YourToken%" \ --request POST \ --data-binary "[\"example.org\", \"example.net\", \"example.com\"]" \ "https://sgraph.opendns.com/domains/score/"
</div>

<div class="lang JavaScript">
> var Request = new XMLHttpRequest();

> Request.open('POST', 'https://sgraph.opendns.com/domains/score/');

> Request.setRequestHeader('Authorization', 'Bearer %YourToken%');

> Request.onreadystatechange = function () {
>   if (this.readyState === 4) {
>     console.log('Status:', this.status);
>     console.log('Headers:', this.getAllResponseHeaders());
>     console.log('Body:', this.responseText);
>  }
> };

> var body = [
>  'example.org',
>   'example.net',
>   'example.com'
> ];

> Request.send(JSON.stringify(body));
</div>

<div class="lang Node.js">
> var request = require('request');

> request({
>   method: 'POST'
>   url: 'https://sgraph.opendns.com/domains/score/',
>   headers: {
>    'Authorization': 'Bearer %YourToken%'
>   },
>   body: [
>     'example.org',
>     'example.net',
>     'example.com'
>   ]
> }, function (error, response, body) {
>   console.log('Status:', response.statusCode);
>   console.log('Headers:', JSON.stringify(response.headers));
>   console.log('Response:', body);
> });
</div>

<div class="lang Python">
> from urllib2 import Request, urlopen

> values =   [
>     'example.org',
>     'example.net',
>     'example.com'
>   ]

> headers = {
>   'Authorization': 'Bearer %YourToken%'
> }

> request = Request('https://sgraph.opendns.com/domains/score/', data=values, headers=headers)

> response_body = urlopen(request).read()
> print response_body
</div>

<div class="lang PHP">
> $ch = curl_init();

> curl_setopt($ch, CURLOPT_URL, "https://sgraph.opendns.com/domains/score/");
> curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
> curl_setopt($ch, CURLOPT_HEADER, FALSE);

> curl_setopt($ch, CURLOPT_POST, TRUE);

> curl_setopt($ch, CURLOPT_POSTFIELDS, "[
>   \"example.org\",
>   \"example.net\",
>   \"example.com\"
> ]");

> curl_setopt($ch, CURLOPT_HTTPHEADER, array(
>   "Authorization: Bearer %YourToken%"
> ));

> $response = curl_exec($ch);
> curl_close($ch);

> var_dump($response);
</div>

<div class="lang Ruby">
> require 'rubygems'
> require 'rest_client'

> values = '[
>   \'example.org\',
>   \'example.net\',
>   \'example.com\'
> ]'

> headers = {
>   :authorization => 'Bearer %YourToken%'
> }

> response = RestClient.POST 'https://sgraph.opendns.com/domains/score/', values, headers
> puts response
</div>

#### HTTP 200

< Content-Type: application/json
< {
<    "example.net":1,
<    "example.org":1,
<    "example.com":1
< }

/REQRESEX

co-occurrences for a domain
---

This API method returns a list of co-occurences for the specified domain. A co-occurrence is when two or more domains are being accessed by the same users within a small window of time. Being a co-occurrence isn't necessarily a bad thing, legitimate sites co-occur with each other as a part of normal web activity.  However, unusual or suspicious co-occurence can provide additional information regarding attacks.

To determine co-occurrences for a domain, a small time window of traffic across all of our datacenters is taken.  Then, we look at the sites that end users were visiting before and after the domain requested in the API call. 
[Read more here](http://labs.umbrella.com/2013/07/24/co-occurrences/)


sample query: `curl -H "Authorization: Bearer %YourToken%" "https://sgraph.api.opendns.com/recommendations/name/malware.com.json"`

**Parameter for input**

<table>
    <thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    <tr>
    </thead>
    <tr>
        <td>name</td><td>string</td><td>domain name</td>
    </tr>
</table>


**Returned value for output if Success 200**

<table>
    <thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    <tr>
    </thead>
    <tr>
        <td>pfs2</td><td>array</td><td>Array of [domain name, scores] tuples. The values range between 0 and 1 and should not exceed 1. all co-occurences of requests from client IPs are returned for the previous 7 days whether the co-occurence is suspicious or not.</td>
    </tr>
    <tr>
        <td>found</td><td>boolean</td><td>Returns true if results available. Nothing is returned if no results available.</td>
    </tr>
    </tr>
</table>

### REQUEST AND RESPONSE EXAMPLE

REQRESEX

GET /recommendations/name/{name}.json

<div class="lang HTTP">
> Authorization: Bearer %YourToken%
> {
>  "name" : "example.com"
> }
</div>

<div class="lang Curl">
> curl --include --header "Authorization: Bearer %YourToken%" \ --request GET \ --data-binary "{ \"name\" : \"example.com\" }" \ "https://sgraph.opendns.com/recommendations/name/{name}.json"
</div>

<div class="lang JavaScript">
> var Request = new XMLHttpRequest();

> Request.open('GET', 'https://sgraph.opendns.com/recommendations/name/{name}.json');
 
> Request.setRequestHeader('Authorization', 'Bearer %YourToken%');
 
> Request.onreadystatechange = function () {
>   if (this.readyState === 4) {
>     console.log('Status:', this.status);
>     console.log('Headers:', this.getAllResponseHeaders());
>     console.log('Body:', this.responseText);
>   }
> };

> var body = {
>   'name': 'example.com'
> };

> Request.send(JSON.stringify(body));
</div>

<div class="lang Node.js">
> var request = require('request');

> request({
>   method: 'GET'
>   url: 'https://sgraph.opendns.com/recommendations/name/{name}.json',
>   headers: {
>     'Authorization': 'Bearer %YourToken%'
>   },
>   body: {
>     'name': 'example.com'
>   }
> }, function (error, response, body) {
>   console.log('Status:', response.statusCode);
>   console.log('Headers:', JSON.stringify(response.headers));
>   console.log('Response:', body);
> });
</div>

<div class="lang Python">
> from urllib2 import Request, urlopen

> headers = {
>   'Authorization': 'Bearer %YourToken%'
> }

> request = Request('https://sgraph.opendns.com/recommendations/name/{name}.json', headers=headers)

> response_body = urlopen(request).read()
> print response_body
</div>

<div class="lang PHP">
> $ch = curl_init();

> curl_setopt($ch, CURLOPT_URL, "https://sgraph.opendns.com/recommendations/name/{name}.json");
> curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
> curl_setopt($ch, CURLOPT_HEADER, FALSE);

> curl_setopt($ch, CURLOPT_POSTFIELDS, "{
>   \"name\": \"example.com\"
> }");

> curl_setopt($ch, CURLOPT_HTTPHEADER, array(
>   "Authorization: Bearer %YourToken%"
> ));

> $response = curl_exec($ch);
> curl_close($ch);

> var_dump($response);
</div>

<div class="lang Ruby">
> require 'rubygems'
> require 'rest_client'

> values = '{
>   \'name\': \'example.com\'
> }'

> headers = {
>   :authorization => 'Bearer %YourToken%'
> }

> response = RestClient.GET 'https://sgraph.opendns.com/recommendations/name/{name}.json', values, headers
> puts response
</div>

#### HTTP 200

< Content-Type: application/json
< {
< "pfs2":[["download.example.com",0.9320288065469468],["query.example.com",0.06797119345305325]],
< "found":true
< }

/REQRESEX

related domains for a domain
---

This API method returns a list of domain names that have been frequently seen requested b
around the same time (up to 60 seconds before or after) as the given domain name, but that are not frequently associated
with other domain names.

sample query: `curl -H "Authorization: Bearer %YourToken%" "https://sgraph.api.opendns.com/links/name/example.com.json"`

**Parameter for input**

<table>
    <thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    <tr>
</thead>
    <tr>
        <td>name</td><td>string</td><td>domain name</td>
    </tr>
</table>


**Returned value for output if Success 200**

<table>
    <thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    <tr>
    </thead>
    <tr>
        <td>tb1</td><td>array</td><td>Array of [domain name, scores] tuples where score is the number of client IP requests to the site around the same time as the site being looked up.  This is a score reflecting the number of client IPs looking up related sites within 60 seconds of the original request. </td>
    </tr>
    <tr>
        <td>found</td><td>boolean</td><td>Returns true if results available. Nothing is returned if no results available.</td>
        </tr>
</table>

### REQUEST AND RESPONSE EXAMPLE

REQRESEX

GET /links/name/{name}.json

<div class="lang HTTP">
> Authorization: Bearer %YourToken%
> {
>  "name" : "example.com"
> }
</div>

<div class="lang Curl">
> curl --include --header "Authorization: Bearer %YourToken%" \ --request GET \ --data-binary "{ \"name\" : \"example.com\" }" \ "https://sgraph.opendns.com/links/name/{name}.json"
</div>

<div class="lang JavaScript">
> var Request = new XMLHttpRequest();

> Request.open('GET', 'https://sgraph.opendns.com/links/name/{name}.json');

> Request.setRequestHeader('Authorization', 'Bearer %YourToken%');

> Request.onreadystatechange = function () {
>   if (this.readyState === 4) {
>     console.log('Status:', this.status);
>     console.log('Headers:', this.getAllResponseHeaders());
>     console.log('Body:', this.responseText);
>   }
> };
 
> var body = {
>   'name': 'example.com'
> };

> Request.send(JSON.stringify(body));
</div>

<div class="lang Node.js">
> var request = require('request');

> request({
>  method: 'GET'
>   url: 'https://sgraph.opendns.com/links/name/{name}.json',
>   headers: {
>     'Authorization': 'Bearer %YourToken%'
>   },
>   body: {
>    'name': 'example.com'
>   }
> }, function (error, response, body) {
>   console.log('Status:', response.statusCode);
>   console.log('Headers:', JSON.stringify(response.headers));
>   console.log('Response:', body);
> });
</div>

<div class="lang Python">
> from urllib2 import Request, urlopen

> headers = {
>   'Authorization': 'Bearer %YourToken%'
> }

> request = Request('https://sgraph.opendns.com/links/name/{name}.json', headers=headers)

> response_body = urlopen(request).read()
> print response_body
</div>

<div class="lang PHP">
> $ch = curl_init();

> curl_setopt($ch, CURLOPT_URL, "https://sgraph.opendns.com/links/name/{name}.json");
> curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
> curl_setopt($ch, CURLOPT_HEADER, FALSE);

> curl_setopt($ch, CURLOPT_POSTFIELDS, "{
>   \"name\": \"example.com\"
> }");

> curl_setopt($ch, CURLOPT_HTTPHEADER, array(
>   "Authorization: Bearer %YourToken%"
> ));

> $response = curl_exec($ch);
> curl_close($ch);

> var_dump($response);
</div>

<div class="lang Ruby">
> require 'rubygems'
> require 'rest_client'

> values = '{
>   \'name\': \'example.com\'
> }'

> headers = {
>   :authorization => 'Bearer %YourToken%'
> }

> response = RestClient.GET 'https://sgraph.opendns.com/links/name/{name}.json', values, headers
> puts response
</div>

#### HTTP 200

< Content-Type: application/json
< {"tb1":[["www.example1.com",10.0],["info.example2.com",9.0],["support.example.com",3.0]],
< "found":true}

/REQRESEX

security information for a domain
---

The security information API method contains multiple scores or security features, each of which can be used to determine relevant datapoints to build insight
on the reputation or security risk posed by the site.  No one security information feature is conclusive, instead these features should be looked at in 
conjuction with one another as part of your security research.

sample query: `curl -H "Authorization: Bearer %YourToken%" "https://sgraph.api.opendns.com/security/name/example.com.json"`

**Parameter for input**

<table>
    <thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    <tr>
    </thead>
    <tr>
        <td>name</td><td>string</td><td>domain name</td>
    </tr>
</table>



**Returned value for output if Success 200**

<table>
    <thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    <tr>
    </thead>
    <tr>
        <td>dga_score</td><td>float</td><td><a href="http://labs.umbrella.com/2013/10/24/mysterious-dga-lets-investigate-sgraph/">Domain Generation Algorithm.</a>  This score is generated based on the likeliness of the domain name being generated by an algorithm rather than a human. This algorithm is designed to identify domains which have been created using an automated randomization strategy, which is a common evasion technique in malware kits or botnets. This score ranges from -100 (suspicious) to 0 (benign)</td>
        </tr>
        <tr>
        <td>perplexity</td><td>float</td><td>A second score on the likeliness of the name to be algorithmically generated, on a scale from 0 to 1.  This score is to be used in conjunction with DGA.</td>
        </tr>
        <tr>
        <td>entropy</td><td>float</td><td>The number of bits required to encode the domain name, as a score. This score is to be used in conjunction with DGA and Perplexity.</td>
        </tr>
        <tr>
        <td>securerank2</td><td>float</td><td>Suspicious rank for a domain that reviews based on the lookup behavior of client IP for the domain.  Securerank is designed to identify hostnames requested by known infected clients but never requested by clean clients, assuming these domains are more likely to be bad. Scores returned range from -100 (suspicious) to 0 (benign).<a href="http://labs.umbrella.com/2013/03/28/secure-rank-a-large-scale-discovery-algorithm-for-predictive-det... here to learn more.</a></td>
        </tr>
        <tr>
        <td>pagerank</td><td>float</td><td>Popularity according to Google's pagerank algorithm</td>
        </tr>
        <tr>
        <td>asn_score</td><td>float</td><td>ASN reputation score, ranges from -100 to 0 with -100 being very suspicious</td>
        </tr>
        <tr>
        <td>prefix_score</td><td>float</td><td>Prefix ranks domains given their IP prefixes (An IP prefix is the first three octets in an IP address) and the reputation score of these prefixes. Ranges from -100 to 0, -100 being very suspicious</td>
        </tr>
        <tr>
        <td>rip_score</td><td>float</td><td>RIP ranks domains given their IP addresses and the reputation score of these IP addresses. Ranges from -100 to 0, -100 being very suspicious</td>
        </tr>
        <tr>
        <td>fastflux</td><td>boolean</td><td>if the domain is a candidate to be a <a href="http://en.wikipedia.org/wiki/Fast_flux/">fast flux</a> domain, either true or false</td>
        </tr>
        <tr>
        <td>popularity</td><td>float</td><td>The number of unique client IPs visiting this site, relative to the all requests to all sites. A score of how many different client/unique IPs go to this domain compared to others.</td>
        </tr>
        <tr>
        <td>geodiversity</td><td>array</td><td>A score representing the number of queries from clients visiting the domain, broken down by country. Score is a non-normalized ratio between 0 and 1</td>
        </tr>
        <tr>
        <td>geodiversity_normalized</td><td>array</td><td>A score representing the amount of queries for clients visiting the domain, broken down by country. Score is a normalized ratio between 0 and 1</td>
        </tr>
        <tr>
        <td>geoscore</td><td>float</td><td>A score that represents how far the different physical locations serving this name are from each other</td>
        </tr>
        <tr>
        <td>ks_test</td><td>float</td><td>Kolmogorov–Smirnov test on geodiversity. 0 means that the client traffic matches what is expected for this TLD</td>
        </tr>
        <tr>
        <td>found</td><td>boolean</td><td>returns true if results available. Nothing is returned if no results available.</td>
        </tr>
    </tr>
</table>


### REQUEST AND RESPONSE EXAMPLE

REQRESEX

GET /security/name/{name}.json

<div class="lang HTTP">
> Authorization: Bearer %YourToken%
> {
>  "name" : "example.com"
> }
</div>

<div class="lang Curl">
> curl --include --header "Authorization: Bearer %YourToken%" \ --request GET \ --data-binary "{ \"name\" : \"example.com\" }" \ "https://sgraph.opendns.com/security/name/{name}.json"
</div>

<div class="lang JavaScript">
> var Request = new XMLHttpRequest();

> Request.open('GET', 'https://sgraph.opendns.com/security/name/{name}.json');

> Request.setRequestHeader('Authorization', 'Bearer %YourToken%');

> Request.onreadystatechange = function () {
>   if (this.readyState === 4) {
>     console.log('Status:', this.status);
>     console.log('Headers:', this.getAllResponseHeaders());
>     console.log('Body:', this.responseText);
>   }
> };

> var body = {
>   'name': 'example.com'
> };

> Request.send(JSON.stringify(body));
</div>

<div class="lang Node.js">
> var request = require('request');

> request({
>   method: 'GET'
>   url: 'https://sgraph.opendns.com/security/name/{name}.json',
>   headers: {
>     'Authorization': 'Bearer %YourToken%'
>   },
>   body: {
>     'name': 'example.com'
>   }
> }, function (error, response, body) {
>   console.log('Status:', response.statusCode);
>   console.log('Headers:', JSON.stringify(response.headers));
>   console.log('Response:', body);
> });
</div>

<div class="lang Python">
> from urllib2 import Request, urlopen

> headers = {
>   'Authorization': 'Bearer %YourToken%'
> }

> request = Request('https://sgraph.opendns.com/security/name/{name}.json', headers=headers)

> response_body = urlopen(request).read()
> print response_body
</div>

<div class="lang PHP">
> $ch = curl_init();

> curl_setopt($ch, CURLOPT_URL, "https://sgraph.opendns.com/security/name/{name}.json");
> curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
> curl_setopt($ch, CURLOPT_HEADER, FALSE);

> curl_setopt($ch, CURLOPT_POSTFIELDS, "{
>   \"name\": \"example.com\"
> }");

> curl_setopt($ch, CURLOPT_HTTPHEADER, array(
>   "Authorization: Bearer %YourToken%"
> ));

> $response = curl_exec($ch);
> curl_close($ch);

> var_dump($response);
</div>

<div class="lang Ruby">
> require 'rubygems'
> require 'rest_client'

> values = '{
>   \'name\': \'example.com\'
> }'

> headers = {
>   :authorization => 'Bearer %YourToken%'
> }

> response = RestClient.GET 'https://sgraph.opendns.com/security/name/{name}.json', values, headers
> puts response
</div>

#### HTTP 200

< Content-Type: application/json
< {
< "dga_score":38.301771886101335,
< "perplexity":0.4540313302593146,
< "entropy":2.5216406363433186,
< "securerank2":-1.3135141095601992,
< "pagerank":0.0262532,
< "asn_score":-29.75810625887133,
< "prefix_score":-64.9070502788884,
< "rip_score":-75.64720536038982,
< "popularity":25.335450495507196,
< "fastflux":false,
< "geodiversity":[["UA",0.24074075],["IN",0.018518519]],
< "geodiversity_normalized":[["AP",0.3761535390278368],["US",0.0005015965168831449]],
< "tld_geodiversity":[],
< "geoscore":0.0,
< "ks_test":0.0,
< "found":true
< }

/REQRESEX


DNS RR History for a Type and Domain Name
---

The DNS database can be used to do DNS queries directly against the OpenDNS DNS resolver database for domains.  
The most common use case is to obtain the RRs (Resource Record) history for a given domain, passing in the record query type as a parameter, to help build intelligence around an IP or a range of IPs. 
This API method returns the history of a DNS resource record for a given name, such as the list of IP addresses that a name maps to, and used
to map to. The information provided is from within the last 90 days.


sample query: `curl -H "Authorization: Bearer %YourToken%" "https://sgraph.api.opendns.com/dnsdb/name/a/example.com.json"`

**Parameter for input**

<table>
<thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    <tr>
    </thead>
    <tr>
        <td>type</td><td>string</td><td>DNS record query type (A, NS, MX, TXT and CNAME are supported)</td>
    </tr>
    <tr>
        <td>name</td><td>string</td><td>domain name</td>
    </tr>
</table>
  
  
**Returned value for output if Success 200**




**Response Class:**  
Resource Records


<table>
    <thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    </tr>
    </thead>
    <tr>
        <td>first_seen</td><td>string</td><td>Date when the domain was first seen to our DNS database</td>
    </tr>
    <tr>
        <td>last_seen</td><td>string</td><td>Date when domain was last seen in our DNS database</td>
    </tr>
    <tr>
        <td>name</td><td>string</td><td>Name of the domain</td>
    </tr>
    <tr>
        <td>ttl</td><td>integer</td><td>Time to live for this record</td>
    </tr>
    <tr>
        <td>class</td><td>string</td><td>DNS class type</td>
    </tr>
    <tr>
        <td>type</td><td>string</td><td>Query type</td>
    </tr>
    <tr>
        <td>rr</td><td>string</td><td>Resource record IP for the domain</td>
    </tr>
</table>


**Response Class:**  
Features


<table>
    <thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    </tr>
    </thead>

    <tr>
        <td>age</td><td>integer</td><td>The day in days between now and the last request for this domain. this value is only useful if present.  a low score helps isolate attack domains that are short-lived.</td>
    </tr>
    <tr>
        <td>ttls_min</td><td>integer</td><td> Minimum amount of time set that DNS records should be cached</td>
    </tr>
    <tr>
        <td>ttls_max</td><td>integer</td><td> Maximum amount of time set that DNS records should be cached</td>
    </tr>
    <tr>
        <td>ttls_mean</td><td>integer</td><td> Average amount of time set that DNS records should be cached</td>
    </tr>
    <tr>
        <td>ttls_median</td><td>integer</td><td>Median amount of time set that DNS records should be cached</td>
    </tr>
    <tr>
        <td>ttls_stddev</td><td>integer</td><td> Standard deviation of the amount of time set that DNS records should be cached</td>
    </tr>
    <tr>
        <td>country_codes</td><td>array</td><td> List of country codes (ex: US, FR, TW) for the IPs the name maps to</td>
    </tr>
    <tr>
        <td>country_count</td><td>integer</td><td> Number of countries the IPs are hosted in</td>
    </tr>
    <tr>
        <td>asns</td><td>array</td><td>List of ASN numbers the IPs are in</td>
    </tr>
    <tr>
        <td>asns_count</td><td>integer</td><td>Number of ASNs the IPs map to</td>
    </tr>
    <tr>
        <td>prefixes</td><td>array</td><td>List of network prefixes the IPs map to</td>
    </tr>
    <tr>
        <td>prefixes_count</td><td>float</td><td>Number of network prefixes the IPs map to</td>
    </tr>
    <tr>
        <td>rips_count</td><td>integer</td><td>Number of IPs seen for the domain name</td>
    </tr>
    <tr>
        <td>rips_diversity</td><td>float</td><td> The number of prefixes over the number of IPs</td>
    </tr>
    <tr>
        <td>locations</td><td>array</td><td>List of geo coordinates (WGS84 datum, decimal format) the IPs are mapping to</td>
    </tr>
    <tr>
        <td>locations_count</td><td>integer</td><td> Number of distinct geo coordinates the IPs are mapping to</td>
    </tr>
    <tr>
        <td>geo_distance_sum</td><td>float</td><td> Minimum sum of distance between locations, in kilometers</td>
    </tr>
    <tr>
        <td>geo_distance_mean</td><td>float</td><td>Mean distance between the geo median and each location, in kilometers</td>
    </tr>
    <tr>
        <td>non_routable</td><td>boolean</td><td>If one of the IPs is in a reserved, non-routable IP range</td>
    </tr>
    <tr>
        <td>mail_exchanger</td><td>boolean</td><td>If an MX query for this domain name has been seen</td>
    </tr>
    <tr>
        <td>cname</td><td>boolean</td><td>Returns true if a CNAME record has been seen for this domain name</td>
    </tr>
    <tr>
        <td>ff_candidate</td><td>boolean</td><td>If the domain name looks like a candidate for <a href="http://en.wikipedia.org/wiki/Fast_flux/">fast flux</a></td>
    </tr>
    <tr>
        <td>rips_stability</td><td>float</td><td> 1.0 divided by the number of times the set of IP addresses changed</td>
    </tr>
</table>


### REQUEST AND RESPONSE EXAMPLE

REQRESEX

GET /dnsdb/name/{type}/{name}.json

<div class="lang HTTP">
> Authorization: Bearer %YourToken%
> {
>  "type" : "a",
>  "name" : "example.com"
> }
</div>

<div class="lang Curl">
> curl --include --header "Authorization: Bearer %YourToken%" \ --request GET \ --data-binary "{ \"type\" : \"a\", \"name\" : \"example.com\" }" \ "https://sgraph.opendns.com/dnsdb/name/{type}/{name}.json"
</div>

<div class="lang JavaScript">
> var Request = new XMLHttpRequest();

> Request.open('GET', 'https://sgraph.opendns.com/dnsdb/name/{type}/{name}.json');

> Request.setRequestHeader('Authorization', 'Bearer %YourToken%');

> Request.onreadystatechange = function () {
>   if (this.readyState === 4) {
>     console.log('Status:', this.status);
>     console.log('Headers:', this.getAllResponseHeaders());
>     console.log('Body:', this.responseText);
>   }
> };

> var body = {
>   'type': 'a',
>   'name': 'example.com'
> };

Request.send(JSON.stringify(body));
</div>

<div class="lang Node.js">
> var request = require('request');

> request({
>   method: 'GET'
>   url: 'https://sgraph.opendns.com/dnsdb/name/{type}/{name}.json',
>   headers: {
>     'Authorization': 'Bearer %YourToken%'
>   },
>   body: {
>     'type': 'a',
>     'name': 'example.com'
>   }
> }, function (error, response, body) {
>   console.log('Status:', response.statusCode);
>   console.log('Headers:', JSON.stringify(response.headers));
>   console.log('Response:', body);
> });
</div>

<div class="lang Python">
> from urllib2 import Request, urlopen

> headers = {
>   'Authorization': 'Bearer %YourToken%'
> }

> request = Request('https://sgraph.opendns.com/dnsdb/name/{type}/{name}.json', headers=headers)

> response_body = urlopen(request).read()
> print response_body
</div>

<div class="lang PHP">
> $ch = curl_init();

> curl_setopt($ch, CURLOPT_URL, "https://sgraph.opendns.com/dnsdb/name/{type}/{name}.json");
> curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
> curl_setopt($ch, CURLOPT_HEADER, FALSE);

> curl_setopt($ch, CURLOPT_POSTFIELDS, "{
>   \"type\": \"a\",
>   \"name\": \"example.com\"
> }");

> curl_setopt($ch, CURLOPT_HTTPHEADER, array(
>   "Authorization: Bearer %YourToken%"
> ));

> $response = curl_exec($ch);
> curl_close($ch);

> var_dump($response);
</div>

<div class="lang Ruby">
> require 'rubygems'
> require 'rest_client'

> values = '{
>   \'type\': \'a\',
>   \'name\': \'example.com\'
> }'

> headers = {
>   :authorization => 'Bearer %YourToken%'
> }

> response = RestClient.GET 'https://sgraph.opendns.com/dnsdb/name/{type}/{name}.json', values, headers
> puts response
</div>

#### HTTP 200

< Content-Type: application/json
< {"rrs_tf":
< [
< {"first_seen":"2013-07-31","last_seen":"2013-10-17",
< "rrs":[{"name":"example.com.","ttl":86400,"class":"IN","type":"A","rr":"93.184.216.119"}]},
< {"first_seen":"2013-07-30","last_seen":"2013-07-30",
< "rrs":[{"name":"example.com.","ttl":172800,"class":"IN","type":"A","rr":"192.0.43.10"},
< {"name":"example.com.","ttl":86400,"class":"IN","type":"A","rr":"93.184.216.119"}]},
< {"first_seen":"2013-07-18","last_seen":"2013-07-29","rrs":[{"name":"example.com.","ttl":172800,"class":"IN","type":"A","rr":"192.0.43.10"}]}
< ],
< "features":
< {"age":91,
< "ttls_min":86400,"ttls_max":172800,"ttls_mean":129600.0,"ttls_median":129600.0,"ttls_stddev":43200.0,
< "country_codes":["US"],"country_count":1,
< "asns":[15133,40528],"asns_count":2,
< "prefixes":["93.184.208.0","192.0.43.0"],"prefixes_count":2,
< "rips":2,"div_rips":1.0,
< "locations":
< [{"lat":38.0,"lon":-97.0},{"lat":33.78659999999999,"lon":-118.2987}],"locations_count":2,
< "geo_distance_sum":1970.1616237100388,"geo_distance_mean":985.0808118550194,
< "non_routable":false,"mail_exchanger":false,"cname":false,"ff_candidate":false,"rips_stability":0.5}
< }

/REQRESEX

DNS RR History for an IP Address
---

The DNS database can be used to do DNS queries directly against the OpenDNS DNS resolver database for domains.  
The most common use case is to obtain the RRs (Resource Record) history for a given IP, passing in the record query type as a parameter, to help build intelligence around an IP or a range of IPs. The information provided is from within the last 90 days. 

This API method can be used to get RR (Resource Record) history for a given IP address, passing in the resource record type (A, MX, etc) as a parameter.
This API method returns the history of records that mapped to an IP
Name servers. Queries against name servers should be specified as an IP address. The input must be specified as IP addresses.

sample query: `curl -H "Authorization: Bearer %YourToken%" "https://sgraph.api.opendns.com/dnsdb/ip/a/93.184.216.119.json"`

**Parameter for input**


<table>
<thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    <tr>
    </thead>
    <tr>
        <td>type</td><td>string</td><td>IP DNS resource record type (A, NS are supported)</td>
    </tr>
    <tr>
        <td>name</td><td>string</td><td>IP Address</td>
    </tr>
</table>
  

**Returned value for output if Success 200**  


**Response Class:**  
Resource Records


<table>
    <thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    <tr>
    </thead>
    
    <tr>
        <td>rr</td><td>string</td><td>Resource record owner</td>
    </tr>
    <tr>
        <td>ttl</td><td>integer</td><td>Time to live for this record</td>
    </tr>
    <tr>
        <td>class</td><td>string</td><td>DNS class type</td>
    </tr>
    <tr>
        <td>type</td><td>string</td><td>Query type</td>
    </tr>
    <tr>
        <td>ip</td><td>string</td><td>The looked up IP address</td>
    </tr>
</table>
  

**Response Class:**  
Features


<table>
    <thead>
    <tr>
        <th>field</th><th>type</th><th>description</th>
    </tr>
    </thead>
    <tr>
        <td>rr_count</td><td>integer</td><td>Number of records of that type mapping to the given IP</td>
    </tr>
    <tr>
        <td>ld2_count</td><td>integer</td><td>Number of 2-level names mapping to the given IP (for www.example.com, this considers example.com)</td>
    </tr>
    <tr>
        <td>ld3_count</td><td>integer</td><td>Number of 3-level names mapping to the given IP (for www.example.com, this considers www.example.com)</td>
    </tr>
    <tr>
        <td>ld2_1_count</td><td>integer</td><td>Number of 2-level names, without the TLD, mapping to the given IP (for www.example.com, this considers example)</td>
    </tr>
    <tr>
        <td>ld2_2_count</td><td>integer</td><td>Number of 3-level names, without the TLD, mapping to a given IP (for www.example.com, this considers www.example)</td>
    </tr>
    <tr>
        <td>div_ld2</td><td>float</td><td>ld2_count divided by the number of records</td>
    </tr>
    <tr>
        <td>div_ld3</td><td>float</td><td>ld3_count divided by the number of records</td>
    </tr>
    <tr>
        <td>div_ld2_1</td><td>float</td><td>ld2_1_count divided by the number of records</td>
    </tr>
    <tr>
        <td>div_ld2_2</td><td>float</td><td>ld2_2_count divided by the number of records</td>
    </tr>
</table>

### REQUEST AND RESPONSE EXAMPLE

REQRESEX

GET /dnsdb/ip/{type}/{ip}.json

<div class="lang HTTP">
> Authorization: Bearer %YourToken%
> {
>  "type" : "a",
>  "ip" : "93.184.216.119"
> }
</div>

<div class="lang Curl">
> curl --include --header "Authorization: Bearer %YourToken%" \ --request GET \ --data-binary "{ \"type\" : \"a\", \"ip\" : \"93.184.216.119\" }" \ "https://sgraph.opendns.com/dnsdb/ip/{type}/{ip}.json"
</div>

<div class="lang JavaScript">
> var Request = new XMLHttpRequest();

> Request.open('GET', 'https://sgraph.opendns.com/dnsdb/ip/{type}/{ip}.json');

> Request.setRequestHeader('Authorization', 'Bearer %YourToken%');

> Request.onreadystatechange = function () {
>   if (this.readyState === 4) {
>     console.log('Status:', this.status);
>     console.log('Headers:', this.getAllResponseHeaders());
>     console.log('Body:', this.responseText);
>   }
> };

> var body = {
>   'type': 'a',
>   'ip': '93.184.216.119'
> };

> Request.send(JSON.stringify(body));
</div>

<div class="lang Node.js">
> var request = require('request');

> request({
>   method: 'GET'
>   url: 'https://sgraph.opendns.com/dnsdb/ip/{type}/{ip}.json',
>   headers: {
>     'Authorization': 'Bearer %YourToken%'
>   },
>   body: {
>     'type': 'a',
>     'ip': '93.184.216.119'
>   }
> }, function (error, response, body) {
>  console.log('Status:', response.statusCode);
>  console.log('Headers:', JSON.stringify(response.headers));
>  console.log('Response:', body);
> });
</div>

<div class="lang Python">
> from urllib2 import Request, urlopen

> headers = {
>   'Authorization': 'Bearer %YourToken%'
> }

> request = Request('https://sgraph.opendns.com/dnsdb/ip/{type}/{ip}.json', headers=headers)

> response_body = urlopen(request).read()
> print response_body
</div>

<div class="lang PHP">
> $ch = curl_init();

> curl_setopt($ch, CURLOPT_URL, "https://sgraph.opendns.com/dnsdb/ip/{type}/{ip}.json");
> curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
> curl_setopt($ch, CURLOPT_HEADER, FALSE);

> curl_setopt($ch, CURLOPT_POSTFIELDS, "{
>   \"type\": \"a\",
>   \"ip\": \"93.184.216.119\"
> }");

> curl_setopt($ch, CURLOPT_HTTPHEADER, array(
>   "Authorization: Bearer %YourToken%"
> ));

> $response = curl_exec($ch);
> curl_close($ch);

> var_dump($response);
</div>

<div class="lang Ruby">
> require 'rubygems'
> require 'rest_client'

> values = '{
>   \'type\': \'a\',
>   \'ip\': \'93.184.216.119\'
> }'

> headers = {
>   :authorization => 'Bearer %YourToken%'
> }

> response = RestClient.GET 'https://sgraph.opendns.com/dnsdb/ip/{type}/{ip}.json', values, headers
> puts response
</div>

#### HTTP 200

< Content-Type: application/json
< {
< "rrs":
< [{"rr":"www.example.com.","ttl":86400,"class":"IN","type":"A","name":"93.184.216.119"},
< {"rr":"www.example.net.","ttl":86400,"class":"IN","type":"A","name":"93.184.216.119"},
< {"rr":"www.example.org.","ttl":86400,"class":"IN","type":"A","name":"93.184.216.119"},
< {"rr":"examplewww.vip.icann.org.","ttl":30,"class":"IN","type":"A","name":"93.184.216.119"}],
< "features":
< {
< "rr_count":19,
< "ld2_count":10,"ld3_count":14,
< "ld2_1_count":7,"ld2_2_count":11,
< "div_ld2":0.5263157894736842,
< "div_ld3":0.7368421052631579,
< "div_ld2_1":0.3684210526315789,
< "div_ld2_2":0.5789473684210527}
< }

/REQRESEX

