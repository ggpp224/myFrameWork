/**
 * @author gp
 * @datetime 2012-7-24
 * @description ClassDefine.js
 */
 
 /**
  * 定义组件类
  * @param {} cmpStr
  * @param {} opt
  */
  Ab.define = function(cmpStr,opt){
 	Ab.applyIf(opt,{
 		initialize: function(cfg){
	 		var cfg=cfg||{};
	 		Ab.apply(this,cfg);
	 	}
 	});
 	Ab.ClassManager.define({
 		className:cmpStr,
 		cfg: opt
 	});
 }
 
 /**
  * 创建组件类
  * @param {} cmpStr
  * @param {} opt
  * @return {}
  */
 Ab.create = function(cmpStr,opt){
 	//var c = new Function('cmpStr','opt','return new '+cmpStr+'(cmpStr,opt)');
 	//var cmp = new c(opt);
 	return Ab.ClassManager.create({
 		className:cmpStr,
 		cfg: opt
 	});
 	
 	
 }
 
 /**
  * 根据json数据创建一个store
  * @param {} arr
  */
 Ab.store.create = function(arr,id){
 	return Ab.ClassManager.createLocalStore(arr,id);
 }