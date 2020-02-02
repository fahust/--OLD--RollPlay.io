import socket
import threading
import json
 
userdata = {}
clientlist = []
userevents = {}
userdata = {}
use = {}
prev = {}
splitter = "[{//V//}]"
 
def savevariable(name,data,client):
    global userdata
    userdata[str(client)][name] = data
 
def callvariable(name,client):
    global userdata
    if name in userdata[str(client)]:
        return userdata[str(client)][name]
    else:
        return None
def callvariablelist(name,data):
    global userdata
    global clientlist
    templist = []
    for c in clientlist:
        if name in userdata[str(c)]:
            if userdata[str(c)][name] == data:
                templist.append(c)
    return templist
 
 
def addfunc(event,func):
    global use
    use[event] = func
 
def emit(event,message,client):
    global splitter
    tempdata = {}
    tempdata[event] = message
    tempdata['identify'] = event
    message = json.dumps(tempdata)+splitter
    client.send(message.encode('utf-8'))
 
def broadcast(event,message):
    global clientlist
    global splitter
    tempdata = {}
    tempdata[event] = message
    tempdata['identify'] = event
    message = json.dumps(tempdata)+splitter
    for c in clientlist:
        c.send(message.encode('utf-8'))
 
 
def handleclient(c,addr):
    global clientlist
    global userevents
    global splitter
    global use
    global prev
    while True:
        try:
            data = c.recv(4096)
            if not data:
                clientlist.remove(c)
                if 'disconnect' in use:
                    use['disconnect'](c,addr)
                break;
        except:
            clientlist.remove(c)
            if 'disconnect' in use:
                use['disconnect'](c,addr)
            break;
        stuff = []
        try:
            data = data.decode('utf-8')
            data = prev[str(c)] + data
            stuff = data.split(splitter)
            if len(stuff) > 1:
                prev[str(c)] = ""
            if not "" in stuff:
                prev[str(c)] = stuff[len(stuff)-1]
                del stuff[len(stuff)-1]
            stuff.remove("")
        except:
            pass
        for s in stuff:
            tempdat = json.loads(s)
            for keys in tempdat.keys():
                if keys in use:
                    threading.Thread(target=use[keys],args=[c,addr,tempdat[keys]]).start()
                    #print(userevents)
def server(host,port):
    s = socket.socket()
    s.bind((host,port))
    s.listen(20)
    global clientlist
    global use
    global userdata
    global prev
    while True:
        c, addr = s.accept()
        clientlist.append(c)
        threading.Thread(target=handleclient,args=[c,addr]).start()
        userdata[str(c)] = {}
        prev[str(c)] = ""
        print(str(addr[0]) + " Connected To The Server From Port " + str(addr[1]))
        if 'connect' in use:
            use['connect'](c,addr)
 
#server("127.0.0.1",3001)