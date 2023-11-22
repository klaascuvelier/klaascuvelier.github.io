---
id: 5097
title: Angular applyAsync + httpBackend
author: Klaas Cuvelier
layout: layouts/post.njk
guid: http://www.klaascuvelier.be/?p=5097
permalink: /2015/09/angular-applyasync-httpbackend/
tags:
  - post
  - tech
---

While trying to update our application to use Angular 1.4, we ran into some troubles.  
Unit tests started failing without a clear reason (oh yes, we have unit tests). Some hours of debugging later we found out \`useApplyAsync\` was the cause of our troubles.

useApplyAsync is a method to enable/disable the combined processing of http responses. Basically, with this option enabled, only one $digest cycle is triggered for multiple http request around the same time. (<a title="Angular $http docs" href="https://docs.angularjs.org/api/ng/provider/$httpProvider" target="\_blank">https://docs.angularjs.org/api/ng/provider/$httpProvider</a>)  
This is supposed to be a huge performance improvement for big Angular applications, which actually totally makes sense after reading the explanation, so we enabled this option.

Once we found out disabling \`applyAsync \`fixed our unit tests, we found out pretty soon, that using multiple \`$httpBackend.flush()\` calls fixed our tests when \`applyAsync\` is enabled. I have a small jsfiddle here which recreates the problem: <a href="http://jsfiddle.net/klaascuvelier/q752t51q/" target="_blank">http://jsfiddle.net/klaascuvelier/q752t51q/</a>  
If you edit the source code you&#8217;ll see the multiple flushes or disabling \`applyAsync\` fixes the test.

Knowing the multiple flushes fixes the issue, I dove into the source code of the $httpBackend service of the angular-mocks.  
This is how the flush method looks:

(<a title="Angular mocks source code" href="https://github.com/angular/bower-angular-mocks/blob/master/angular-mocks.js#L1530-L1545" target="_blank">https://github.com/angular/bower-angular-mocks/blob/master/angular-mocks.js#L1530-L1545</a>)

{% highlight javascript %}
{% raw %}
$httpBackend.flush = function(count, digest) {
    if (digest !== false) $rootScope.$digest();
if (!responses.length) throw new Error('No pending request to flush !');

    if (angular.isDefined(count) && count !== null) {
      while (count--) {
        if (!responses.length) throw new Error('No more pending request to flush !');
        responses.shift()();
      }
    } else {
      while (responses.length) {
        responses.shift()();
      }
    }
    $httpBackend.verifyNoOutstandingExpectation(digest);

};
{% endraw %}
{% endhighlight %}

By default, a \`$rootScope.$digest\` is triggered, and then the code loops over the responses (either all, or some), and executes those.  
Those responses are actually callbacks created by the wrapResponse method, which point to the \`done\` method in the angular $http service:

(<a title="Angular $http source code" href="https://github.com/angular/angular.js/blob/master/src/ng/http.js#L1265-L1285" target="_blank">https://github.com/angular/angular.js/blob/master/src/ng/http.js#L1265-L1285</a>)

{% highlight javascript %}
{% raw %}  
function done(status, response, headersString, statusText) {

    if (cache) {
        if (isSuccess(status)) {
            cache.put(url, [status, response, parseHeaders(headersString), statusText]);
        } else {
            // remove promise from the cache
            cache.remove(url);
        }
    }

    function resolveHttpPromise() {
        resolvePromise(response, status, headersString, statusText);
    }

    if (useApplyAsync) {
        $rootScope.$applyAsync(resolveHttpPromise);
    } else {
        resolveHttpPromise();
        if (!$rootScope.$$phase) $rootScope.$apply();
    }

}
{% endraw %}
{% endhighlight %}

The interesting part here are the last lines; when using \`applyAsync\`, a \`$digest\` is scheduled through \`$applyAsync\`, when not using \`applyAsync\`, a digest is triggered immediately.  
This is the explanation for the problem we are seeing;

When not using \`applyAsync\`, this is the flow, in psuedo code:

{% highlight javascript %}
{% raw %}
do a first $http.get request
the response callback gets pushed onto the responses array
trigger $httpBackend.flush()
loop over all responses is started (length is 1 at this moment):
pop callback from responses and execute (responses length becomes 0)
$digest gets triggered (other promises get resolved/rejected)
the $digest triggers an action to do another $http.get request
second $http.get gets done, response gets pushed onto the responses array (length becomes 1)
pop callback from responses and execute (responses length becomes 0)
$digest gets triggered
// (no more responses)
end loop
// all is good
{% endraw %}
{% endhighlight %}

And this is the pseudo code for using \`applyAsync\`

{% highlight javascript %}
{% raw %}
do a first $http.get request
the response callback gets pushed onto the responses array
trigger $httpBackend.flush()
loop over all responses is started (length is 1 at this moment):
pop callback from responses and execute (responses length becomes 0)
// no digest
$digest gets triggered
(no more responses)
end loop
// 2nd $http.get did not get executed
{% endraw %}
{% endhighlight %}

So our issue is that there is no next tick which flushes the applyAsync queue before we&#8217;re moving to the next item of the responses array.  
We can easily solve this by adding \`$rootScope.$digest\` at the end of the loop.

In my opinion it would make sense to trigger a \`$digest\` at that point. When you don&#8217;t have \`applyAsync\` enabled, angular (mocks) will execute your first http call, take care of the other promises, execute the second http call and take care of the other promises in 1 flush.  
Why would the \`applyAsync\` option require the unit test to do a double flush to make sure all http calls are done? Shouldn&#8217;t it be the httpBackend which takes care of the applyAsync changes instead of the unit test?
