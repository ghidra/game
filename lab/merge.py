includes=[]

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




includes = parse_list("merge_server.txt")
print_includes()
merge("server_merged.js")
