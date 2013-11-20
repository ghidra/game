from src.sockets.web_socket import *
import json

class server(web_socket):
	def __init__(self):
		web_socket.__init__(self,55555)
	
	def received(self,addr,data):
		'''
			data here also comes with more data that I really need.
			what I care about is payload. I need to make sure that it is JSON compatible, it looks a bit weird though
		'''

		'''
			im not sure i even care when i get data, because it appears that I am am just turning around and sending it right back out
			I guess that if I want to I can compare it to the stuff that has come in before
		'''
		read = json.loads(data)

		print 'Data from', addr, ':', read['user'], ':from server class'
		return

	def send(self,data):
		'''
			so the "data" coming in here, is the whole payload, that is not JSON. it is the data that pytonh
			deterimines from what it gets from javascript plus data length and weather it was masked, etc
			other attributes that I dont need to send bac to javascript
		'''

		'''
			what i am going to need to do is determine if I even need to send any data, to save on bandwidth,
			otherwise, if there are say 64 users, that means that each user is going to have 64 pings, so 64 times 64, seems over kill
			be interesting to see if it can handle it
		'''

		read = json.loads(data)#conver the data to something usefull

		temp = {'user':read['user']}
		temp = json.dumps(temp)

		return super(server, self).send(temp)
		#return super(server, self).send(data)
		

	def connected(self,addr):
		print 'Connected by', addr, ':from server class'	

	def waiting(self,s,addr):
		#return True
		print "Waiting for data from", s, addr, ':from server class'

	def no_data(self):
		print 'no data :from server class'
		
server = server()