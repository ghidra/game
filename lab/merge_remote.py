import sys

includes=[]
save_path="../../../"
content_path="public/game/lab/"
merging_remote=True

if (len(sys.argv)<2):
    save_path=""
    content_path="lab/"
    merging_remote=False

#read in file
def parse_list(list):
    comp_list_file=open("merge_server.txt","r")
    lines=comp_list_file.readlines();
    files=[]
    for line in lines:
        line = line.rstrip("\n")
        if(line[0]!="#"):#ignore commented out file paths
            files.append(line.rstrip("\n"))
    return files;

def print_includes():
    global includes
    for f in includes:
        print(f)

#now append it all together
def merge(filename):
    global includes
    with open(filename,"wb") as outfile:
      for f in includes:
        outfile.write(("\n//----------------"+f+"\n").encode())
        with open(f,"rb") as infile:
          outfile.write(infile.read())

###---- duplicate index with modified path in JS include files

def fix_path(line,src,newsrc):
    global content_path
    l = line.split(src)
    if len(l)>1:
        return l[0]+content_path+newsrc+l[1]
    else:
        return line

def duplicate_index(filename):
    rad_source = "rad/rad.js"
    include_source="includes.js"
    new_include_source="includes_remote.js"
    socket_source = "node_modules/socket.io-client/dist/socket.io.js" #i just need to set this for local tests
    
    #i need to make a new includes file... to get the correct path there too
    with open(new_include_source,"wb") as include_outfile:
        include_file=open("includes.js","r")
        ilines=include_file.readlines();
        threshold = False
        for iline in ilines:
            il = iline.rstrip("\n")
            if(threshold):
                if(il!="]);"):
                    ls = il.split('"')
                    il = ls[0]+'"'+content_path+ls[1]+'"'+ls[2]
                    #print(new_l)
            if(il=="rad.includes.source(["):
                threshold = True
            include_outfile.write( (il+"\n").encode())

    #now rewrite the index file
    with open(filename,"wb") as outfile:
        index_file=open("index.html","r")
        lines=index_file.readlines();
        for line in lines:
            l = fix_path(line,rad_source,rad_source)
            l = fix_path(l,include_source,new_include_source)
            if not merging_remote:
                l = fix_path(l,socket_source,socket_source)
            outfile.write(l.encode())
        
        

    return False

###---- start script
includes = parse_list("merge_server.txt")
#print_includes()
merge(save_path+"app.js")
if(merging_remote):
    duplicate_index(save_path+"index.html")
else:
    duplicate_index("../index_remote.html")