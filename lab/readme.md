2 things.

"multi user map" and "ascii editor (aed)"

Multi User Map:

First get a node server running with relevant modules (express, socketio) instructions in server directory

I have 2 setups that are "compiled" using python scripts.

Local: merge.py
For my local test build, use "merge.py". It reads "merge_server.txt" to compile the relevant js files into a a single server "app.js" file for node to run.

Remote: merge_remote.py
For my remote build, which has specific directory structure requirements.
It also uses "merge_server.txt", however, there are extra rules to append of modify specific paths in "includes.js", and "index.html".
"app.js" is created same as before, however the save path is specific to remote directorues. 
"includes.js" is not modified, a new (gitignored) "includes_remote.js" is created.
"index.html" is not modified, a new (gitignored) "includes.html" is created with new paths for internal include files, in the correct directory.

There is also a "local" mode when running this python script. which is the DEAFAULT behavior for the script. It creates a "index_remote.html" a directory up for testing locally. To run it on the remote server use an argument when running the script "python merge_remote.py 1" (the 1 has no relevance, it just needs ANYTHING as an argument)

ASCII EDITOR:
