---
layout: page
title: al-Thurayyā
description: "a Gazetteer of the Classical Islamic World"
permalink: /althurayya/
---

<section class="post-topmatter">

<section class="share"> 
<a class="icon-twitter" href="http://twitter.com/share?text=About Maxim Romanov&amp;url=http://maximromanov.github.io/about/"
onclick="window.open(this.href, 'twitter-share', 'width=550,height=235');return false;">
<span class="hidden">Twitter</span>
</a>
<a class="icon-facebook" href="https://www.facebook.com/sharer/sharer.php?u=http://maximromanov.github.io/about/"
onclick="window.open(this.href, 'facebook-share','width=580,height=296');return false;">
<span class="hidden">Facebook</span>
</a>
<a class="icon-google-plus" href="https://plus.google.com/share?url=http://maximromanov.github.io/about/"
onclick="window.open(this.href, 'google-plus-share', 'width=490,height=530');return false;">
<span class="hidden">Google+</span>
</a>
</section>
</section>

_al-Ṯurayyā_ (_al-Thurayyā_) is a Gazetter of the Classical Islamic World, and a part and parcel of another project in progress—_Ṣūraŧ al-arḍ_, a geospatial model of the Classical Islamic World (being developed in collaboration with Cameron Jackson, a Senior, double majoring in Arabic and Computer Science @ Tufts University, 2013).

<figure class="fit">
	<a href="{{ site.url }}/projects/althurayya_02/" title="A Screenshot of al-Thurayyā">
		<img src="{{ site.url }}/images/althurayya_02_01.png">
	</a>
</figure>

This is our first usable demo of **al-Ṯurayyā Gazetteer**. Currently it includes over 2,000 toponyms and almost as many route sections georeferenced from Georgette Cornu’s *Atlas du monde arabo-islamique à l'époque classique: IXe-Xe siècles* (Leiden: Brill, 1983). The gazetteer is searchable (upper left corner), although English equivalents are not yet included; in other words, look for Dimashq/دمشق, not Damascus.


## Blog posts on major milestones of the project: 

{% for tag in site.tags order:ascending %}
{% if tag[0] == 'al-Thurayyā' %}
<ul class="post-list">
{% assign pages_list = tag[1] %}  
{% for post in pages_list %}
{% if post.title != null %}
{% if group == null or group == post.group %}
<li><a href="{{ site.url }}{{ post.url }}">{{ post.title }}<span class="entry-date"><time datetime="{{ post.date | date_to_xmlschema }}" itemprop="datePublished">{{ post.date | date: "%B %d, %Y" }}</time></a></li>
{% endif %}
{% endif %}
{% endfor %}
{% assign pages_list = nil %}
{% assign group = nil %}
</ul>
{% endif %}
{% endfor %}