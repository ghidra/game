
f = open("game/game.js")

li = []
toggle = False #toggle weather we are keeping lines for importing

for l in f:
	
	l_clean = l.strip()
	keep = True #hack that lets me not keep the first '//include'
	if l_clean == '//include':
		if(toggle):
			toggle = False
		else:
			toggle = True
			keep = False

	if toggle and keep:
		li.append(l_clean)

f.close()

print li
