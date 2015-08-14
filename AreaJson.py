#-*- coding: big5 -*-
#-*- coding: cp950 -*-
import os
import json
import re

#AreaList_ = ['north', 'central', 'south', 'east']
AreaList_ = ['central']
ItemList_ = ['A', 'B', 'C', 'D']

#---------------------
#Area json
def AreaJsonCreate():
    for AreaName in AreaList_:
        NameList = []
        for (dirpath, dirnames, filenames) in os.walk('./' + AreaName):
            NameList.extend(dirnames)

            for name in dirnames:
                Split_ = name.split('-')
                #os.rename(os.path.join(dirpath, name), os.path.join(dirpath, Split_[0]))
            break;

        data = []
        for Name in NameList:
            NewData_ = {}
            Split_ = Name.split('-')

            if(len(Split_) != 3):
                continue            
            
            NewData_['id'] = Split_[0]
            NewData_['school'] = Split_[1]
            NewData_['name'] = Split_[2]
            data.append(NewData_)

        if(len(data) > 0):
            output = open(AreaName + '.json', 'w+')
            output.write(json.dumps({'area' : 'central', 'data' : data}, indent=4, separators=(',', ': '), ensure_ascii=False))
            output.close()

        print 'Area :' + AreaName + ' area json create[OK]\n'


#---------------------
#Teacher json
def getIntro(path):
    if not os.path.exists(path):
        return "";

    text = ""
    
    introFile = open(path, 'r');
    for line in introFile:
        text += line.rstrip()
        text += '<br>'
    introFile.close()
    return text

def getImages(path):
    result  = []

    if not os.path.exists(path):
        return result;
        
    for filename in os.listdir(path):
        data = {}
        if filename.endswith(".jpg") or filename.endswith(".png") or filename.endswith(".JPG") or filename.endswith(".PNG"):
            Name = re.split('\.|-', filename)
            if len(Name) == 3:
                data['file'] = (Name[0].zfill(2) + '.' + Name[2]).decode('big5').encode('utf-8')
                data['name'] = Name[1].decode('big5').encode('utf-8')
                result.append(data)
            else :
                print "[WARNING] Name format failed :" + path + filename + '\n'
    return result;
    
def getVideos(path):
    result  = []

    if not os.path.exists(path):
        return result;
    for filename in os.listdir(path):
        data = {}
        if filename.endswith(".mp4") or filename.endswith(".MP4"):
            Name = re.split('\.|-', filename)
            if len(Name) == 3:
                data['file'] = Name[0].zfill(2) + '.' + Name[2]
                data['name'] = Name[1].decode('big5').encode('utf-8')
                result.append(data)
            else :
                print "[WARNING] Name format failed :" + path + filename + '\n'
    return result;
        
def TeacherJsonCreate():
    for AreaName in AreaList_:
        folderList = []
        for (dirpath, dirnames, filenames) in os.walk('./' + AreaName):
            folderList.extend(dirnames)
            break;
        
        for folder in folderList:
            path = './' + AreaName + '/' + folder + '/';
            folderid = folder.split('-')[0]
            data = {'id':folderid}            

            #A
            Adata = {}
            Adata['intro'] = getIntro(path + 'A/intro.txt');
            data['A'] = Adata

            #B
            Bdata = {}
            Bdata['intro'] = getIntro(path + 'B/intro/intro.txt');
            Bdata['images'] = getImages(path + 'B/images/');
            Bdata['videos'] = getVideos(path + 'B/videos/');
            data['B'] = Bdata
            
            #C
            Cdata = {}
            Cdata['intro'] = getIntro(path + 'C/intro/intro.txt');
            Cdata['images'] = getImages(path + 'C/images/');
            Cdata['videos'] = getVideos(path + 'C/videos/');
            data['C'] = Cdata

            #D
            Ddata = {}
            Ddata['intro'] = getIntro(path + 'D/intro/intro.txt');
            Ddata['images'] = getImages(path + 'D/images/');
            Ddata['videos'] = getVideos(path + 'D/videos/');
            data['D'] = Ddata

            output = open(path + folderid +'.json', 'w+')
            output.write(json.dumps(data, indent=4, separators=(',', ': '), ensure_ascii=False))
            output.close()
            

        print 'Area :' + AreaName + ' teacher json create[OK]\n'

if __name__ == '__main__':
    AreaJsonCreate()
    TeacherJsonCreate()

    
    print 'FINISH'

