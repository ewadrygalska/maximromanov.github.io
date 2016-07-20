import re, sys, collections, random
from datetime import datetime
import glob, os, shutil
from os.path import join, getsize
import textwrap

def freqList(fileName, freqNum):
    print("======================================================")
    with open(fileName, "r", encoding="utf-8") as items:
        collectedItems = items.read()        
    collectedItems = collectedItems.split('\n')
    collectedItemsValue = "{:,}".format(len(collectedItems))
    #print("- calculating frequencies items...")
    freqItems = collections.Counter(collectedItems)
    print("- number of items: %s (a list with frequencies %d up)" % (collectedItemsValue, freqNum))
    freqListItems = ""
    counter = 0
    for k , v in freqItems.items():
        if v >= freqNum:
            freqListItems = freqListItems + "%08d" % v + '\t' + k + '\n'
        counter = counter + 1
        if counter % 10000 == 0:
            print("- %d " % counter, end="")
    #print("- sorting (Z-A) the freqList of items...")
    freqListItems = freqListItems.split('\n')
    freqListItems = sorted(freqListItems, reverse=True)
    freqListValue = "{:,}".format(len(freqListItems))
    complexity = "{0:.2f}%".format(len(freqListItems)/float(len(collectedItems))*100)
    print("\n- number of freqList items: %s (complexity factor: %s)" % (freqListValue,complexity))
    # volume of top 100, 200, and 300
    for top in [100,200,300]:
        topTemp = freqListItems[0:top]
        topTemp = "\n".join(topTemp)
        topTemp = re.findall("\d+", topTemp)
        topTemp = sum(list(map(int, topTemp)))
        topTempF = "{:,}".format(topTemp)
        volume = "{0:.2f}%".format(float(topTemp)/len(collectedItems)*100)
        print("- top%s ammounts to %s (%s of the entire volume)" % (top,topTempF,volume))
        
    
    freqListItems = "\n".join(freqListItems)
    freqListItems = re.sub('\n$', '', freqListItems)
    print(freqListItems)
    with open(fileName[:-4]+"_Freq.txt", "w", encoding="utf-8") as freqFile:
        freqFile.write(freqListItems)
    print("======================================================")
    return freqListItems

freqList("allproducts.txt", 1)
