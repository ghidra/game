#http://stackoverflow.com/questions/10152290/python-websocket-handshake-rfc-6455
import socket
import threading
import struct
import hashlib
from base64 import b64encode
from hashlib import sha1
import array

class web_socket(object):

	_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	_port = 55555#71180
	_clients = []

	def __init__(self,port):
		self._port = port
		#s = socket.socket()
		self._socket.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1)
		self._socket.bind(('',port))
		self._socket.listen(1)
		while 1:
			conn, addr = self._socket.accept()
			self.connected(addr)
			self._clients.append(conn)
			threading.Thread(target=self.handle,args=(conn, addr)).start()
			
	def handle(self,s,addr):
		data = s.recv(1024)
		s.send(self.handshake(data))
		#print data
		#print '---------------'
		#print self.handshake(data)
		lock = threading.Lock()
		while 1:
			self.waiting(s,addr)
			data = s.recv(1024)
			if not data:
				self.no_data()
				break
			data = self.unpack_frame(data)
			self.received(addr,data)#get data then	
			# Broadcast received data to all clients
			lock.acquire()
			[ conn.send( self.send( data ) ) for conn in self._clients ]
			lock.release()

		print 'Client closed:', addr
		lock.acquire()
		self._clients.remove(s)
		lock.release()
		s.close()
	
	def handshake(self,data):

		GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
		lines = data.splitlines()
		for line in lines:
			parts = line.partition(": ")
			if parts[0] == "Sec-WebSocket-Key":
				key = parts[2]
			'''elif parts[0] == "Host":
				host = parts[2]
			elif parts[0] == "Origin":
				origin = parts[2]'''

		token = b64encode(sha1(key + GUID).digest())

		#"HTTP/1.1 101 WebSocket Protocol Handshake\r\n"
		#"HTTP/1.1 101 Switching Protocols\r\n"
		#"Sec-WebSocket-Protocol: chat\r\n\r\n"
		#"Sec-WebSocket-Origin: %s\r\n"
		#"Sec-WebSocket-Location: ws://%s/\r\n"

		return (
			"HTTP/1.1 101 WebSocket Protocol Handshake\r\n"
			"Upgrade: websocket\r\n"
			"Connection: Upgrade\r\n"
			"Sec-WebSocket-Accept: %s\r\n\r\n"
			) % (
			token)

	def unpack_frame(self,data):  
		#http://bogboa.blogspot.com/2012/02/unpacking-websocket-frame.html
	    frame = {}  
	    byte1, byte2 = struct.unpack_from('!BB', data)  
	    frame['fin'] = (byte1 >> 7) & 1  
	    frame['opcode'] = byte1 & 0xf  
	    masked = (byte2 >> 7) & 1  
	    frame['masked'] = masked  
	    mask_offset = 4 if masked else 0  
	    payload_hint = byte2 & 0x7f  
	    if payload_hint < 126:  
	        payload_offset = 2  
	        payload_length = payload_hint                 
	    elif payload_hint == 126:  
	        payload_offset = 4  
	        payload_length = struct.unpack_from('!H',data,2)[0]  
	    elif payload_hint == 127:  
	        payload_offset = 8  
	        payload_length = struct.unpack_from('!Q',data,2)[0]  
	    frame['length'] = payload_length  
	    payload = array.array('B')  
	    payload.fromstring(data[payload_offset + mask_offset:])  
	    if masked:  
	        mask_bytes = struct.unpack_from('!BBBB',data,payload_offset)  
	        for i in range(len(payload)):  
	            payload[i] ^= mask_bytes[i % 4]  
	    frame['payload'] = payload.tostring()  
	    #return frame 
	    '''no i just need to get this data ans jason with it'''
	    return payload.tostring()

	#-------------------
	#-------------------
	def received(self,addr,data):
		print 'Data from', addr, ':', data
		
	def send(self,data):
		#http://stackoverflow.com/questions/14758111/getting-websockets-to-work-on-server-domain
		data = str(data)
        # Empty message to start with
		message = ""

        # always send an entire message as one frame (fin)
		TEXT = 0x01
		BINARY = 0x02
		b1 = 0x80

        # in Python 2, strs are bytes and unicodes are strings
		if type(data) == unicode:
			b1 |= TEXT
			payload = data.encode("UTF8")

		elif type(data) == str:
			b1 |= TEXT
			payload = data

        # Append 'FIN' flag to the message
		message += chr(b1)

        # never mask frames from the server to the client
		b2 = 0

        # How long is our payload?
		length = len(payload)
		if length < 126:
			b2 |= length
			message += chr(b2)

		elif length < (2 ** 16) - 1:
			b2 |= 126
			message += chr(b2)
			l = struct.pack(">H", length)
			message += l

		else:
			l = struct.pack(">Q", length)
			b2 |= 127
			message += chr(b2)
			message += l

		# Append payload to message
		#message = str(message)
		message += payload
        # Send to the client
       	# self.client.send(str(message))

		message = str(message)
        #remove the single quote and replace them with double quotes
		message = message.replace("'",'"')

		return message
	
	def connected(self,addr):
		print 'Connected by', addr	
		
	def waiting(self,s,addr):
		return True
		#print "Waiting for data from", s, addr
	
	def no_data(self):
		print 'no data'