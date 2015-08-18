#-*- coding: big5 -*-
#-*- coding: cp950 -*-
import os
import re

#AreaList_ = ['north', 'central', 'south', 'east']
AreaList_ = ['central']
ItemList_ = ['A', 'B', 'C', 'D']

#---------------------
#teacher
def renameImages(path):
    if not os.path.exists(path):
        return
    
    for filename in os.listdir(path):
        if filename.endswith(".jpg") or filename.endswith(".png") or filename.endswith(".JPG") or filename.endswith(".PNG"):
            Name = re.split('\.|-', filename)

            try:
                if len(Name) > 1:
                    newName = (Name[0].zfill(2) + '.' + Name[len(Name) - 1]).decode('big5').encode('utf-8')
                    os.rename(os.path.join(path, filename), os.path.join(path, newName))
                else :
                    print "[WARNING] Name format failed :" + path + filename + '\n'
            except WindowsError:
                print "[WARNING] Name format failed :" + path + filename + '\n'


def renameVideos(path):

    if not os.path.exists(path):
        return
    for filename in os.listdir(path):
        if filename.endswith(".mp4") or filename.endswith(".MP4"):
            Name = re.split('\.|-', filename)

            try:
                if len(Name) > 1:
                    newName = (Name[0].zfill(2) + '.' + Name[len(Name) - 1]).decode('big5').encode('utf-8')
                    os.rename(os.path.join(path, filename), os.path.join(path, newName))
                else :
                    print "[WARNING] Name format failed :" + path + filename + '\n'
            except WindowsError:
                print "[WARNING] Name format failed :" + path + filename + '\n'

def RenameFolder():
    for AreaName in AreaList_:
        NameList = []
        for (dirpath, dirnames, filenames) in os.walk('./' + AreaName):
            NameList.extend(dirnames)
            print AreaName
            for name in dirnames:
                path = './' + AreaName + '/' + name + '/'
                
                #B
                renameImages(path + 'B/images/');
                renameVideos(path + 'B/videos/');
                
                #C
                renameImages(path + 'C/images/');
                renameVideos(path + 'C/videos/');

                #D
                renameImages(path + 'D/images/');
                renameVideos(path + 'D/videos/');

                #folder
                
                Split_ = name.split('-')
                os.rename(os.path.join(dirpath, name), os.path.join(dirpath, Split_[0]))
            break;

        print 'Area :' + AreaName + ' teacher folder rename create[OK]\n'



if __name__ == '__main__':
    RenameFolder()

    
    print 'FINISH'

