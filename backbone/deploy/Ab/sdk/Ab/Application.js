/*!
 * Ab
 */
/**
 * @author gp
 * @datetime 2012-7-24
 * @description Application.js
 */
 
 Ab.ns('Ab.view');
 Ab.ns('Ab.model');
 Ab.ns('Ab.controller');
 Ab.ns('Ab.store');
 
 Ab.app = {
 	views:{},
 	models:{},
 	stores:{},
 	controllers:{},
 	
 	getView:function(id){
 		return this.views[id];
 	},
 	
 	getStore: function(id){
 		return this.stores[id];
 	},
 	
 	getController:function(id){
 		return this.controllers[id];
 	},
 	
 	getModel: function(id){
 		return this.models[id]
 	}
 };