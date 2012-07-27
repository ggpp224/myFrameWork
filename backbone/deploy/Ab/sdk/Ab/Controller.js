/*!
 * Ab
 */
/**
 * @author gp
 * @datetime 2012-7-24
 * @description Controller.js
 */
 
 Ab.Controller = function(opt){
 	this.init();
 }
 
 Ab.Controller.prototype = {
 	init:function(){
 		/* this.control({
            'button': {
                click: this.refreshGrid
            }
        });*/
 	},
 	
 	control: function(o){
 		var me = this;
 		for(var key in o ){
 			var view = Ab.app.getView(key);
 			var events = view.events||{}; //view 已配置的events
 			//Ab.apply(events,o[key]);
 			var es = {};
 			var ori_o = o[key];
 			
 			//controller定义的事�?
 			for(okey in ori_o){
 				if(!/\s/.test(okey)){
 					view.on(okey,ori_o[okey].createDelegate(this));
 				}else{
 					es[okey]=ori_o[okey].createDelegate(this);
 				}
 			}
 			
 			//view定义的事�?
 			for(ekey in events){
 				if(!/\s/.test(ekey)){
 					//.createDelegate(view,[view,me],true)
 					view.on(ekey,events[ekey]);
 				}else{
 					es[ekey]=events[ekey];
 				}
 			}
 			
 			view.delegateEvents(es);
 			
 		}
 	},
 	
 	getView:function(id){
 		return Ab.app.getView(id);
 	},
 	
 	getStore: function(id){
 		return Ab.app.getStore(id);
 	},
 	
 	getController:function(id){
 		return Ab.app.getController(id);
 	},
 	
 	getModel: function(id){
 		return Ab.app.getModel(id);
 	}
 	
 };