---
title: Group Ordering app with Angular2 & Firebase
author: Klaas Cuvelier
layout: layouts/post.njk
permalink: /2016/01/angular2-firebase-ordering-prototype/
comments: true
tags:
  - post
  - tech
  - angular2
  - firebase
  - meetup
  - prototype
  - typescript
---

## TL;DR

Online ordering of food for a group of people can be cumbersome.
I took on the challenge of building a prototype of a tool to improve the ordering of food for groups, in
a limited amount of time, with unfamiliar technologies.

## The problem

[Showpad](http://www.showpad.com), the company I work for, hosts Meetups quite often. For the meet-up of
[SocratesBe](http://www.meetup.com/socratesbe/) I tend to be the person doing preparations and I am also in charge of
ordering the food.

I remember the days there were only a few people joining the meet-up, and ordering the food was a breeze; asking people
personally what food they want, placing the order, collecting the money.

As the SocratesBe group became more popular, more people started coming to the meet-ups, which is a good thing,
obviously. Though, the ordering of the food became a hassle. Ever ordered food for 20 individuals and collected the
money? It's a drag!

Two days before the meetup, I expressed my concerns about this issue on the Slack channel of SocratesBe.
A clever man suggested to start my own pizza chain or maybe write some software to ease the task.

Starting my own pizza chain was not high on my priorities list and I doubt if I'd ever be free to join the actual
meet-ups again in that case.

I had already tweeted the food delivery service we use to ask if they had a solution
to this problem. I assumed we weren't the only ones with this issue.
Sadly they did not reply. [The actual tweets (in Dutch)](https://twitter.com/klaascuvelier/statuses/659094884368912384)

So if I wanted to improve the order process, I'd had to go with "write your own software"&hellip;.

## The challenge

Make it easier for a person to manage food orders for a group (order input, payments, status,&hellip;).

### The requirements

There are 3 main parts to this application; **authentication**, a backend to **store the data** and a
frontend to **put in and present the orders**.

As I was developing this for a meet-up, using Meetup + OAuth2 is the logical choice for authentication.

I've been using Angular 1 a lot for projects and Angular 2 just went in beta, so I decided it was about time
to write some Angular 2 (and TypeScript).

I did not want to invest time in writing a backend to store my data so I was in need for a "datastorage as a service"
thing. I remembered reading a tutorial on Angular 1 and Firebase once, so I decided to try out Firebase&hellip;

### Challenges

As I mentioned, I have no experience with Angular 2 or TypeScript. So prototyping an app using Angular 2 would be quite
a challenge. Also, as it's only in beta stage, there isn't too much documentation and but there are a fair amount of
good tutorials available already.

I've never used Firebase before, but I wasn't really expecting much trouble on that side.

The biggest challenge would obviously be time. Only 2 days until the meet-up and I have a full-time day job, so I was
left with 2 evenings to write code.

### The implementation

I signed up for a free account on Firebase, I did not take the time to check the limitations. I'd figure out a
solution for those if I'd run into any.

Creating an OAuth client in the Meetup API was straight forward as well.

Next step was to start thinking about the code. I knew Angular 2 prefers JSPM to get things working, but I
was not really familiar with it. I did not want to waste my time on figuring out how to set up my dev + production
build process with JSPM I decided to just look for an angular starters pack.

I had some starter packs bookmarked since they were showing up in my Twitter stream quite often.
I went for [ng2-webpack](https://github.com/ocombe/ng2-webpack) by [Olivier Combe](https://twitter.com/ocombe) as I was
already quite familiar with WebPack and his repo had the dev and production build process set up and had some useful
example code available (bootstrapping, routing, &hellip;).

The first thing I wanted to implement was the authentication. Authentication from a JavaScript app using OAuth seemed
pretty straight forward, I had done this before; use the implicit flow, provide my app key and redirect url and ask
for an access_token.

Sadly, it didn't go as smooth as I hoped for. I ran into 2 problems.

First, Meetup did not allow me to use `localhost` as a redirect url. As webpack's dev server runs on `localhost:3000`
this was a problem. I ended up solving this by implementing more code than I intented to; I added storing
the access_token in LocalStorage, this way I could run my code on production, get the code from LocalStorage and use
it locally. There was one up side to this; this way I already implemented some "remember me" functionality.

I did not think about how I'd host my frontend, luckily Firebase provided some hosting with the free account I had, and
they have a great CLI tool. After some configuration I only had to run `npm run build && firebase deploy` to get my
code on production.

The second problem I ran into when I tried doing an AJAX call for the user information&hellip;

[![Screenshot console CORS errors](/public/2016/01/cors.png){: .image-center }](/public/2016/01/cors.png)

Oh god&hellip; All frontend developers have ran into CORS problems, right?

The quickest solution I thought of, was creating a proxy script and running that on my VPS (kind of stupid hosting my
frontend on Firebase but still having to use my VPS in the end). Not the greatest solution, but I was able to solve
my issues quite quickly this way.

Next step was linking the app with Firebase. Although Angular 2 is only in beta for about 2 weeks, somebody already
created [angular2-firebase](https://www.npmjs.com/package/angular2-firebase). Thank you,
[Kyle](https://twitter.com/kylecordes)

I was not familiar with observables yet, still I was able to create some sort of `DataStorage` service.
(This great blog post came just too late: [Taking advantage of Observables in Angular 2](http://blog.thoughtram.io/angular/2016/01/06/taking-advantage-of-observables-in-angular2.html))

{% highlight ts %}
{% raw %}
// datastore.ts
import { observableFirebaseObject, observableFirebaseArray } from 'angular2-firebase';
import \* as Firebase from 'firebase';

import { GroupOrder } from '../../classes/group-order';
import { Order } from '../../classes/order';
import { FIREBASE_ROOT } from '../../../config';

const FIREBASE_ORDER_GROUPS = `${FIREBASE_ROOT}/order-groups`;
const FIREBASE_ORDERS = `${FIREBASE_ROOT}/orders`;

export class DataStore
{
rootRef: Firebase;
orderGroupsRef: Firebase;
ordersRef: Firebase;

    constructor ()
    {
        this.rootRef = new Firebase(FIREBASE_ROOT);
        this.orderGroupsRef = new Firebase(FIREBASE_ORDER_GROUPS);
        this.ordersRef = new Firebase(FIREBASE_ORDERS);
    }

    createGroupOrder (groupOrder: GroupOrder)
    {
        this.orderGroupsRef.child(groupOrder.id).set(groupOrder);
    }

    ...

{% endraw %}
{% endhighlight %}

With these basics implemented, I could start working on the app functionality.

This is when the real Angular 2 fun started, adding routes, creating components, writing views with the new template
syntax:
{% highlight ts %}
{% raw %}
// create-group.html

<div class="content">
    <h2>Create a new group order</h2>

    <form (submit)="createGroupOrder(groupName.value, groupOrderUrl.value, groupDescription.value)">
        <fieldset>
            <label>Group Name</label>
            <input type="text" placeholder="some group name" #groupName>
        </fieldset>

        <fieldset>
            <label>Order description</label>
            <textarea #groupDescription></textarea>
        </fieldset>

        <fieldset>
            <label>Order url</label>
            <input type="url" placeholder="http://www.pizza.be" #groupOrderUrl>
        </fieldset>

        <fieldset>
            <label>Organizer</label>
            <input type="text" disabled value="{{ user.name }}">
        </fieldset>

        <fieldset class="submit">
            <button type="submit">Create group</button>
        </fieldset>
    </form>

</div>
{% endraw %}
{% endhighlight %}

{% highlight ts %}
{% raw %}
// create-group.ts
import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

import { DataStore } from '../../services/datastore/datastore';
import { Authentication } from '../../services/authentication/authentication';
import { UuidGenerator } from '../../services/uuid/uuid-generator';

import { GroupOrder, GroupOrderStatus } from '../../classes/group-order';
import { User } from '../../classes/user';

@Component({
selector: 'create-group',
template: require('./create-group.html'),
styleUrls: [require('./create-group.css')],
providers: [],
directives: [],
pipes: []
})
export class CreateGroupComponent implements OnInit
{
dataStore: DataStore = null;
authentication: Authentication = null;
router: Router = null;
user: User = new User();

    constructor (dataStore: DataStore, authentication: Authentication, router: Router)
    {
        this.dataStore = dataStore;
        this.authentication = authentication;
        this.router = router;
    }

    ngOnInit ()
    {
        // needs login
        this.authentication
            .getUser()
            .then(user => this.user = user)
            .catch(() => this.router.navigate(['Login']));
    }

    createGroupOrder (name, orderUrl, description)
    {
        // Refetch user
        this.authentication.getUser()
            .then(user => {
                this.user = user;

                const id = UuidGenerator.generate();

                const order = GroupOrder.build({
                    id,
                    name,
                    orderUrl,
                    description,
                    creatorName: user.name,
                    creatorId: user.id,
                    status: GroupOrderStatus.OPEN,
                });

                // You'd think this might cause some race condition, but haven't experienced it yet
                this.dataStore.createGroupOrder(order);
                this.router.navigate(['GroupOrder', { id }]);
            })
            .catch(() => {
                alert('You are not authenticated');
            });
    }

}
{% endraw %}
{% endhighlight %}

Once I had basic functionality to create groups and add orders to groups I could start adding in some "administration"
functionality (order statuses, payment statuses,&hellip;) and some quick wins for the people ordering
(remembering the groups they visited, removing orders,&hellip;)

This is what it looked like in the end:

[![Screenshot app about page](/public/2016/01/finish-about.png){: .image-center }](/public/2016/01/finish-about.png)
[![Screenshot app order page admin options](/public/2016/01/finish-order.png){: .image-center }](/public/2016/01/finish-order.png)

Definitely not a masterpiece of UX, but surely good enough to ship and try out on the meet-up.

### Testing it out

I posted the link to my order group on the Slack channel on the day of the meet-up, and people could start adding
their order during the day.

It was still hard to copy over the orders to the actual food order service, but at least it the orders and the payments
were manageable this time.

**Goal accomplished!** The tool did its job!

(To be honest: 1 order was wrong but that was totally a human error, not the tool's fault).

I used the SocratesBe meet-up to give a lightning talk about this challenge. It turned out explaining everything in 10
minutes was even harder than finishing the project in time.

[![Picture of me presenting the challenge](/public/2016/01/lightning-talk.jpeg){: .image-center }](/public/2016/01/lightning-talk.jpeg)

## Looking back on the challenge

I was able to pull this off in under 8 hours, which I am still pretty impressed with myself.
Shortcuts have been taken but the challenge was not to build a perfect app. The challenge was to create a
tool in a short amount of time with services/tools I was not familiar with.

The security of the app is not great; I did not configure Firebase correctly, now everybody can read and write to my
instance (people could mark their order as paid without paying). Authorization itself isn't very secure either, before
doing some data related actions, I check if the logged in user from Meetup matches the owner of a group or an order,
which could by bypassed pretty quick as well.

I guess ideally a "real" backend should be used; it would take care of the CORS issues with Meetup, I could use
[JWT](https://tools.ietf.org/html/rfc7519) for authorization and I would not have to expose any of my
credentials&hellip;

I probably could have easily solved the Meetup redirect issue locally by setting up a host in nginx with
`proxy_pass`, which I've actually done before, but I did not think about it at the time.

The code is available on Github [ng2-group-order](https://github.com/klaascuvelier/ng2-group-order), but keep
in mind the purpose of this challenge&hellip;
This is not the sort of code I wrote in my day job.

I was quite hesitant about TypeScript in the beginning, but I really loved writing typed code and taking advantage of
the decorators!

It's too soon to form an opinion on Angular 2, but I definitely liked writing this app using it.

Hope you enjoyed my write-up. Don't hesitate to contact me if you have any questions or remarks!

## Also want to get started with Angular 2?

There are already quite some tutorials available, but definitely check out the ones by
[Thoughtram](http://blog.thoughtram.io/categories/angular-2/), they are great!

I've used webpack myself to build my little app, there are more options, but this proves you're not tight to JSPM.
I used [ng2-webpack](https://github.com/ocombe/ng2-webpack) and I was very happy how easy it was to get started (and
keep using it when adding extra functionality).
