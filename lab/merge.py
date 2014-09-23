#read in file
comp_list_file=open("merge_server.txt","r")
lines=comp_list_file.readlines();
files=[]
for line in lines:
  files.append(line.rstrip("\n"))

#now append it all together
with open("server_merged.js","wb") as outfile:
  for f in files:
    with open(f,"rb") as infile:
      outfile.write(infile.read())
