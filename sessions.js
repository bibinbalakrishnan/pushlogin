
function Sessions(io){
    this.contexts =[];
    this.io = io;
    //userid : {requester : {id: id, socket : socket}, activator :{id: id, socket: socket}, active: true, tick :20}
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
Sessions.prototype.register = function(data,socket){
    console.log('New '+data.type+' joined '+data.name);
    console.log(this.contexts);
    if(data.type=='activator'){
      var context;
	    if(this.contexts[data.name]){
	    	 context = this.contexts[data.name];
	    	if(context.requester && context.active){
	    		//notify activator that requester joined
              var data ={
            timeLeft :30,
            merchant: "Qoo10 Singapore",
            detail: "35 SGD 12/08/2016"
          };
         socket.emit('activate-request',data);
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
                var data ={
            timeLeft :30,
            merchant: "Qoo10 Singapore",
            detail: "35 SGD 12/08/2016"
          };
          this.io.to(context.activator.id).emit('activate-request', data);
          //socket.emit('activate-request',data);
         }
      } else {
         context ={};
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
 
