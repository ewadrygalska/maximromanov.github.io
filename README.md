#al-Raqmiyyat: Digital Islamic History

The new version of my website, built with Jekyll ~~(and lots of pain and sweat...)~~, using Clean Blog Theme by Start Bootstrap
(The official Jekyll version of the Clean Blog theme by [Start Bootstrap](http://startbootstrap.com/), plus a number of elements from other themes (including [Kasper](https://github.com/rosario/kasper), [Notepad](https://github.com/hmfaysal/Notepad), etc.)

### Some cheatcodes

##### to embed youTube clip
```
<center>
	<iframe width=750 height=450 src="http://youtube.com/embed/0eblr_DGHus" frameborder=0>
	</iframe>
</center>
```

##### to comment out text
There is a Liquid Tag for that :)
```

{% comment %}
This text will be excluded from the final version
{% endcomment %}
```

##### gitHub commands

1. ```git clean -f -d```
	* (removes uncommitted -files and directories; use -n to preview what will be removed; cannot be undone)
1. ```git reset -- hard```
	* (rolls back to previous commit; provide commit id to roll back to specific commit)
1. ```git add --all```
	* adds all new files and changed files to what is to be committed
1. ```git commit -m "text"```
	* commits changes: "text" is the comment that logs what exactly was changed
1. ```git push -u origin master```
	* pushes committed changes to the gitHub repository