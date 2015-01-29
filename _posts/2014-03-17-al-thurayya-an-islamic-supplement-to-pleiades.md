---
title:			"al-Thurayyā Gazetteer: An Islamic Supplement to Pleiades"
author:			Maxim Romanov
layout:			post
image:			/images/loc_photos/pilgriims_04654u.jpg
imagecredit:	"Mecca, ca. 1910. Camel caravan of pilgrims to Mecca<br>
				<a href='http://www.loc.gov/pictures/item/mpc2004003659/PP/' target='_blank'>
				Library of Congress, LC-DIG-matpc-04654
				</a>"
categories:
  - Geography
tags:
  - Atlas du monde islamique
  - Cornu
  - Gazetteer
  - Islamic Gazetteer
  - Mapping
  - al-Thurayyā
---

![A Screenshot of al-Thurayyā]({{ site.url }}/images/CornuGazetteerExample.jpg)
<center>*[View in full screen]({{ site.url }}/projects/althurayya_01/)*</center>

With Teams Pelagios and Pleiades&#8212;in alphabetical order: Elton Barker, Tom Elliot, Leif Isaksen, Rainer Simon&#8212;visiting Tufts University within the framework of the Perseids Named Entity Hackathon (organized and led by Bridget Almas) at the Perseus Project, we had a chance to test how their systems work with Arabic texts.<sup><a href="#footnote_0_1071" id="identifier_0_1071" class="footnote-link footnote-identifier-link" title="For more details, see Marie-Claire Beaulieu&rsquo;s post on Perseids Website.">1</a></sup> Pelagios offers a convenient workflow for “geographical” reading of texts, which consists of two main steps: first, one tags places that occur in the text, then one “geo-resolves” tagged places into geographical locations that get displayed on an interactive geographical map (For more details, see <a href="http://pelagios-project.blogspot.com/">Pelagios Website</a>). The first step is smooth and easy and works nice for texts in any language as long as it is provided in Unicode. The second step depends on the availability of relevant gazetteers, to which Pelagios is or can be connected. Thus, Pelagios does a great job when it comes to the “geo-resolution” of toponyms included into Pleiades, which now has almost 35,000 places from the Ancient world. Since there is no gazetteer for the classical Islamic world, “geo-resolution” of classical Arabic sources is problematic at the moment. A gazetteer for the Islamic world is badly needed in general.

As is the case with a creation of any database, creating a gazetteer is an extremely time-consuming task. The key seems to be in generating a snowball effect: creating enough database entries that would encourage a community of potentially interested individuals to start contributing to an already substantial databank by offering new data, references, corrections and additions. Pleiades has successfully used this model. Having incorporated content from such extensive editions as “Digital Atlas of Roman and Medieval Civilizations” (<a href="http://darmc.harvard.edu/icb/icb.do">DARMC</a></span><span style="line-height: 1.7;">) and “Barrington Atlas of the Greek and Roman World” (<a href="http://www.unc.edu/depts/cl_atlas/">BAGRW</a></span><span style="line-height: 1.7;">), Pleiades offered a significant foundation for potential users to contribute to. It seems only logical to follows in the footsteps of such a successful project as Pleiades, and to use their infrastructure for developing an Islamic gazetteer, which will feature in Pleiades as <em>al-Thurayya: a Supplement for the Islamic World</em>. (In this light, the name al-Thurayya, Arabic for Pleiades, seems quite appropriate; Tom Elliot, one of the managing editors of Pleiades, will be providing support for the integration of al-Thurayya into Pleiades.)

In the case of the classical Islamic world, there are, unfortunately, very few publications that offer geographical data of magnitude that would be comparable to that of DARMC and BAGRW. In fact, there is only one edition that can provide a solid backbone of geographical data for the initial stage of the creation of an Islamic gazetteer: Georgette Cornu’s <em>Atlas du monde arabo-islamique à l&#8217;époque classique: IXe-Xe siècles</em> (Brill, 1985; maps by Olivier Chareire). Largely based on M.J. de Goeje’s <em>Bibliotheca Geographorum Arabicorum</em>, this Atlas represents early geographical and travelogue literature in Arabic and, to some extent, in Persian (9 geographical treatises from BGA, plus 18 other works).

The Atlas consists of 20 maps, which cover the extent of the Islamic world in 9-10th centuries, and an extensive gazetteer that briefly characterizes every place, providing succinct verbal description of its geographical location, its place in the geographical hierarchy, and coded references to primary and secondary sources. Maps vary in scale, but, in general, they are very detailed, dense in places and provide trade routes.<sup><a href="#footnote_1_1071" id="identifier_1_1071" class="footnote-link footnote-identifier-link" title="It is not clear what the lines of the trade routes are based on. Unlike maps/cartograms of trade and postal routes created by Aloys Sprenger (Die Post- und Reiserouten des Orients, Leipzig 1864) and Guy Le Strange (The Lands of the Eastern Caliphate, Cambridge 1905), who connected locations with straight lines, Cornu&rsquo;s maps offer realistic routes.">2</a></sup>

![A Screenshot of al-Thurayyā]({{ site.url }}/images/CornuCoverage-1024x681.jpg)
<center>*Geographical Coverage of Cornu’s <em>Atlas</em>*</center>


Cornu’s <em>Atlas</em> represents most of early Islamic geographical sources in general, but none of them in particular&#8212;peculiarities of each geographer are preserved in the gazetteer, but not reflected on maps. Although somewhat a “Frankenstein” of the early Islamic geography, Cornu’s <em>Atlas</em> is an incredible piece of scholarly work that does offer the best starting point for studying Islamic geography as well as various topics in Islamic history with digital methods.

Unlike DARMC and BARGW, Cornu’s <em>Atlas</em> was published only once<sup><a href="#footnote_2_1071" id="identifier_2_1071" class="footnote-link footnote-identifier-link" title="The gazetteer was published in three gradually updated versions.">3</a></sup> in 1980s and has never made it into a digital form (at least to my knowledge). Nor does the gazetteer offer coordinates for places. So, creating a digital gazetteer is a bit of a methodological challenge. The most effective way is to &#8220;georeference&#8221; Cornu’s maps in a GIS program (for example, QGIS) and then to collect necessary geographical features from these georeferenced maps. &#8220;Georeferencing&#8221; can be described as a process of deforming the image of a map in such a way that its coordinate grid corresponds to the coordinates within a GIS software. In other words, if one georeferences specific points&#8212;for example, intersections of parallels of latitude and meridians of longitude&#8212;a GIS program will deform the image of a map in such a way that all geographical features&#8212;cities, villages, and trade routes&#8212;will correspond to their geographical locations. In most cases&#8230;

![A Screenshot of al-Thurayyā]({{ site.url }}/images/CornuGeoreferencedA-1024x702.jpg)
<center>*Georeferenced Cornu’s <em>Atlas</em>*</center>


As a method, georeferencing is precise, but its results depend on the quality of original maps, and some particular factors often complicate things. Ideally, for georeferencing one needs to know the projection of the map&#8212;something which all Cornu’s maps lack (as is the case with most historical academic maps). Fortunately, Cornu’s maps have rather detailed coordinate grids, in most cases covering every or every other degree of latitude and longitude.<sup><a href="#footnote_3_1071" id="identifier_3_1071" class="footnote-link footnote-identifier-link" title="In this regard, maps from Brill&rsquo;s An Historical Atlas of Islam (1981, 2002) are not suitable for this task, since they lack information on projection, and do not provide values for the coordinate grid, which significantly affects the precision of georeferencing. See this example: A georeferenced map of Iran in the 4th-5th / 10th-11th Centuries. NB: Routes are straight lines between two points; georeferenced in QGIS.">4</a></sup> By georeferencing coordinate grids one can still produce quite reliable overlays. An example below shows a section of one of Cornu’s maps overlaid on top of Google physical map: medieval al-Mawsil corresponds to modern Mosul, and medieval Tall A‘far&#8212;to modern Tal Afar, while some other features&#8212;in this case, the Tigris river&#8212;are slightly off.

![A Screenshot of al-Thurayyā]({{ site.url }}/images/CornuGeoreferencedExample.jpg)
<center>*A section of a georeferenced Cornu’s map overlaid on top of Google physical map*</center>

<span style="line-height: 1.7;">Converted into a digital dataset, contents of Cornu’s <em>Atlas</em> will become the backbone of geographical data that can be improved, expanded, corrected. An example of a searchable digital map based on one the maps from Cornu’s <em>Atlas</em> can be found below: the map on the left shows dynamic clustering of toponyms; the map in the middle shows places; the map on the right shows trade routes (click on the image to view dynamic searchable map; layers can be switched on/off in the upper right corner of the map). <strong>NB</strong>: “Place Filter” supports search using Arabic and simplified transliteration (omitting <em>hamza</em>s and ‘<em>ayn</em>s, and disregarding macrons of long vowels and dots of emphatic consonants). Make sure to switch on the Places layer. There may be typos in transliteration (and Arabic, since it is Arabic names are automatically converted from transliteration); I will appreciate if you email corrections/suggestions.</span>


![A Screenshot of al-Thurayyā]({{ site.url }}/images/CornuGazetteerExample.jpg)
<center>*[View in full screen]({{ site.url }}/projects/althurayya_01/)*</center>
<center>*Toponymic data from the map of Greater Syria (Province du Šām).<br /> Special thanks to Rainer Simon @ Pelagios and Adam Tavares @ Perseus for their help with building this interactive map.*</center>


**Footnotes**

<ol class="footnotes">
  <li id="footnote_0_1071" class="footnote">
    For more details, see Marie-Claire Beaulieu&#8217;s post on <a href="http://sites.tufts.edu/perseids/news-and-updates/pelagios-used-in-tufts-classes/">Perseids Website</a>. [<a href="#identifier_0_1071" class="footnote-link footnote-back-link">&#8617;</a>]
  </li>
  <li id="footnote_1_1071" class="footnote">
    It is not clear what the lines of the trade routes are based on. Unlike maps/cartograms of trade and postal routes created by Aloys Sprenger (<em>Die Post- und Reiserouten des Orients</em>, Leipzig 1864) and Guy Le Strange (<em>The Lands of the Eastern Caliphate</em>, Cambridge 1905), who connected locations with straight lines, Cornu’s maps offer realistic routes. [<a href="#identifier_1_1071" class="footnote-link footnote-back-link">&#8617;</a>]
  </li>
  <li id="footnote_2_1071" class="footnote">
    The gazetteer was published in three gradually updated versions. [<a href="#identifier_2_1071" class="footnote-link footnote-back-link">&#8617;</a>]
  </li>
  <li id="footnote_3_1071" class="footnote">
    In this regard, maps from Brill’s An Historical Atlas of Islam (1981, 2002) are not suitable for this task, since they lack information on projection, and do not provide values for the coordinate grid, which significantly affects the precision of georeferencing. See this example: <a href="http://alraqmiyyat.org/projects2/hai_online_iran_in4_5th.html">A georeferenced map of Iran in the 4th-5th / 10th-11th Centuries</a>. <strong>NB</strong>: Routes are straight lines between two points; georeferenced in QGIS. [<a href="#identifier_3_1071" class="footnote-link footnote-back-link">&#8617;</a>]
  </li>
</ol>

 [1]: http://alraqmiyyat.org/althurayya/CornuCoverage.html
 [2]: http://alraqmiyyat.org/althurayya/SampleMap.html