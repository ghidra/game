#!/usr/bin/env python  
#http://bogboa.blogspot.com/2012/02/unpacking-websocket-frame.html
  
import struct  
import array   
  
  
##      Frames with a 7 bit payload length  
  
CLIENT7 = (  
    b'\x81\x9c\xb3\x8f\x67\x54\xe1\xe0\x04\x3f\x93\xe6\x13\x74\xc4\xe6'  
    b'\x13\x3c\x93\xc7\x33\x19\xff\xba\x47\x03\xd6\xed\x34\x3b\xd0\xe4'  
    b'\x02\x20'  
    )  
  
SERVER7 = (  
    b'\x81\x1c\x52\x6f\x63\x6b\x20\x69\x74\x20\x77\x69\x74\x68\x20\x48'  
    b'\x54\x4d\x4c\x35\x20\x57\x65\x62\x53\x6f\x63\x6b\x65\x74'  
    )  
  
  
##      Frames with a 16 bit payload length  
  
CLIENT16 = (  
    b'\x81\xfe\x00\xa5\x33\x92\xab\x19\x67\xfa\xc2\x6a\x13\xfb\xd8\x39'  
    b'\x52\xb2\xdd\x7c\x41\xeb\x8b\x75\x5c\xfc\xcc\x39\x5e\xf7\xd8\x6a'  
    b'\x52\xf5\xce\x39\x47\xfa\xca\x6d\x13\xfb\xd8\x39\x5f\xfd\xc5\x7e'  
    b'\x56\xe0\x8b\x6d\x5b\xf3\xc5\x39\x02\xa0\x9e\x39\x51\xeb\xdf\x7c'  
    b'\x40\xb2\xd8\x76\x13\xfb\xdf\x39\x44\xfb\xc7\x75\x13\xf0\xce\x39'  
    b'\x5c\xf4\xcd\x7c\x47\xb2\xdc\x70\x47\xfa\x8b\x78\x13\xa3\x9d\x39'  
    b'\x51\xfb\xdf\x39\x56\xea\xdf\x7c\x5d\xf6\xce\x7d\x13\xe2\xca\x60'  
    b'\x5f\xfd\xca\x7d\x13\xfe\xce\x77\x54\xe6\xc3\x39\x52\xfc\xcf\x39'  
    b'\x47\xfa\xce\x6b\x56\xf4\xc4\x6b\x56\xb2\xdb\x78\x4a\xfe\xc4\x78'  
    b'\x57\xb2\xc7\x7c\x5d\xb2\xd8\x71\x5c\xe7\xc7\x7d\x13\xf0\xce\x39'  
    b'\x56\xe3\xde\x78\x5f\xb2\xdf\x76\x13\xa3\x99\x2f\x1d'  
    )  
  
SERVER16 = (  
    b'\x81\x7e\x00\xa5\x54\x68\x69\x73\x20\x69\x73\x20\x61\x20\x76\x65'  
    b'\x72\x79\x20\x6c\x6f\x6e\x67\x20\x6d\x65\x73\x73\x61\x67\x65\x20'  
    b'\x74\x68\x61\x74\x20\x69\x73\x20\x6c\x6f\x6e\x67\x65\x72\x20\x74'  
    b'\x68\x61\x6e\x20\x31\x32\x35\x20\x62\x79\x74\x65\x73\x20\x73\x6f'  
    b'\x20\x69\x74\x20\x77\x69\x6c\x6c\x20\x62\x65\x20\x6f\x66\x66\x65'  
    b'\x74\x20\x77\x69\x74\x68\x20\x61\x20\x31\x36\x20\x62\x69\x74\x20'  
    b'\x65\x78\x74\x65\x6e\x64\x65\x64\x20\x70\x61\x79\x6c\x6f\x61\x64'  
    b'\x20\x6c\x65\x6e\x67\x74\x68\x20\x61\x6e\x64\x20\x74\x68\x65\x72'  
    b'\x65\x66\x6f\x72\x65\x20\x70\x61\x79\x6c\x6f\x61\x64\x20\x6c\x65'  
    b'\x6e\x20\x73\x68\x6f\x75\x6c\x64\x20\x62\x65\x20\x65\x71\x75\x61'  
    b'\x6c\x20\x74\x6f\x20\x31\x32\x36\x2e'  
    )  
  
def unpack_frame(data):  
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
    return frame  
  
      
if __name__ == '__main__':  
  
    frame = unpack_frame(CLIENT7)  
    print '\nFinal Frame:', bool(frame['fin'])  
    print 'Masked:', bool(frame['masked'])  
    print 'Opcode:', frame['opcode']  
    print 'Payload Length:', frame['length']  
    print 'Payload:', frame['payload']  
  
    frame = unpack_frame(SERVER7)  
    print '\nFinal Frame:', bool(frame['fin'])  
    print 'Masked:', bool(frame['masked'])  
    print 'Opcode:', frame['opcode']  
    print 'Payload Length:', frame['length']  
    print 'Payload:', frame['payload']  
  
    frame = unpack_frame(CLIENT16)  
    print '\nFinal Frame:', bool(frame['fin'])  
    print 'Masked:', bool(frame['masked'])  
    print 'Opcode:', frame['opcode']  
    print 'Payload Length:', frame['length']  
    print 'Payload:', frame['payload']  
  
    frame = unpack_frame(SERVER16)  
    print '\nFinal Frame:', bool(frame['fin'])  
    print 'Masked:', bool(frame['masked'])  
    print 'Opcode:', frame['opcode']  
    print 'Payload Length:', frame['length']  
    print 'Payload:', frame['payload']