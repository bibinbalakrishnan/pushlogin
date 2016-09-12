
function Sessions(io){
    this.contexts =[];
    this.io = io;
    //userid : {data : data, requester : {id: id, socket : socket}, activator :{id: id, socket: socket}, active: true, tick :20}
}

Sessions.prototype.cancel = function(data,socket){
  console.log('Cancel request for '+data.name);
  var context = this.contexts[data.name];
  context.active=false;
  if(data.type=="activator" && context.requester){
    this.io.to(context.requester.id).emit('cancel-request',{});
  }
  if(data.type=="requester" && context.activator){
    this.io.to(context.activator.id).emit('cancel-request',{});
  }  

};

Sessions.prototype.randomDetail = function(){
    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    var detail = (Math.floor(Math.random() * 120) + 1) + "SGD "+ date;
    var checkOutData ={};
    checkOutData.timeLeft =30;
    checkOutData.merchant="Qoo10 Singapore";
    checkOutData.detail = detail;
    return checkOutData;
};

Sessions.prototype.register = function(data,socket){
    console.log('New '+data.type+' joined '+data.name);
    console.log(this.contexts);
    if(data.type=='activator'){
      var context;
	    if(this.contexts[data.name]){
	    	 context = this.contexts[data.name];
	    	if(context.requester && context.active){
	       socket.emit('activate-request',context.data);
	    	}
      } else {
         context ={};
         this.contexts[data.name] = context;
      }
      context.activator ={};
      context.activator.id = socket.id;
      //context.socket = socket;
	} else if(data.type=='requester'){
      var context;
      if(this.contexts[data.name]){
         context = this.contexts[data.name];
         if(context.activator){
          console.log('Activator exists already');
          context.data = this.randomDetail();
          console.log('Emitting activate-request to '+context.activator.id);
          this.io.to(context.activator.id).emit('activate-request', context.data);
         }
      } else {
         console.log('Building new context for requester');
         context ={};
         context.data = this.randomDetail();
         console.log(context.data);
         this.contexts[data.name] = context;
      }
      context.active = true;
      context.requester ={};
      context.requester.id = socket.id;
      //context.socket = socket;
	}
    
  	

    
};

Sessions.prototype.remove = function(data){
    console.log(data.type +' for '+ data.name +' cancelled');
};


Sessions.prototype.getTick = function(){

};

module.exports = Sessions;
 
