import suspengine

def hi(c,addr):
    print(str(addr[0])+ "has disconnected")

def handledata(c,addr,mess):
    print('data')
    print(mess)
    suspengine.emit("data",mess.upper(),c)
    suspengine.emit("position","{'x':600,'y':300}",c)
    suspengine.emit("command","register",c)

suspengine.addfunc("data",handledata)
suspengine.addfunc("disconnect",hi)


suspengine.server("127.0.0.1",3001)