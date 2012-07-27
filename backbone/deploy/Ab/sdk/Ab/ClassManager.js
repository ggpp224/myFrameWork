/*!
 * Ab
 */
/**
 * @author gp
 * @datetime 2012-7-24
 * @description 工厂方法，创建不同组件类
 */
 
 Ab.ClassManager ={
 	
 	v_reg : /Ab.view./,
 	c_reg : /Ab.controller./,
	m_reg : /Ab.model./,
	s_reg : /Ab.store./,
	
 	define: function(opt){
 		var cls = opt.className;
 		
 		if(this.v_reg.test(cls)){
 			Ab.view[cls.substr(8)]=Backbone.View.extend(opt.cfg||{});
 		}else if(this.c_reg.test(cls)){
 			Ab.controller[cls.substr(14)]=Ab.extend(Ab.Controller,opt.cfg);
 		}else if(this.s_reg.test(cls)){
 			Ab.store[cls.substr(9)]=Backbone.Collection.extend(opt.cfg||{});
 		}else if(this.m_reg.test(cls)){
 			Ab.model[cls.substr(9)]=Backbone.Model.extend(opt.cfg||{});
 		}
 	},
 	
 	create: function(opt){
 		var cls = opt.className||'',
 			cfg = opt.cfg||{};
 		
 		var c = new Function('cls','cfg','return new '+cls+'(cls,cfg)');
 		var cmp = new c(cfg);
 		if(this.v_reg.test(cls)){
 			Ab.app.views[cmp.id] = cmp;
 		}else if(this.c_reg.test(cls)){
 			Ab.app.controllers[cmp.id] = cmp;
 		}else if(this.s_reg.test(cls)){
 			Ab.app.stores[cmp.id] = cmp;
 		}else if(this.m_reg.test(cls)){
 			Ab.app.models[cmp.id] = cmp;
 		}
 		return cmp;
 	},
 	
 	createLocalStore: function(arr,id){
 		var cmp =  new Backbone.Collection(arr);
 		cmp.id=id;
 		return cmp;
 	}
 };
 
 