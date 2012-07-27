/**
 * @author gp
 * @datetime 2012-7-4
 * @description index
 */
 
 $(document).ready(function(){
 		
 	
 	var view = new View({test:'test',id:'dddd'});
 	view.render();
 	
 	$('#btn').click(function(){
 		var store = view.getStore();
 		store.refresh();
 		//store.remove(store.at(1));
 		//store.reset();
 		//alert(store.length);
 		/*_.each(store.toJSON(),function(item){
 			alert(item);
 		});*/
 	});
 	
 	
 	var book = new Book();
 	$('#save').click(function(){
 		var obj = Ab.urlDecode(Ab.serializeForm('form'));
 			book.save(obj,{
	 			success:function(){
	 				
	 				var form = document.getElementById('form');
					var els = form.elements;
					var data = book.attributes;
	 				for(id in data){
	 					var el = els[id];
	 					if(el){
	 						el.value = data[id];
	 					}
	 				}
	 			},
	 			error:function(){
	 			}
	 		});
 		
 		
 	});
 	
 	
 });
 
 //Model类
 var Book = Backbone.Model.extend({
 	
 	//属性字段，可以不设，最好设上，保持代码清晰
 	defaults:{
 		name:'',
 		age:'',
 		address:''
 	},
 	url:'index.php?action=create',
 	
 	validate:function(attrs){
 		if(!/^\d+(.\d+){0,1}$/.test(attrs.age)){
 			alert("请输入数字");
 			return "fdfdfdf";
 		}
 	}
 	
 });
 
 
 //Collection类
 var Books = Backbone.Collection.extend({
 	initialize: function(cfg){
 		var cfg=cfg||{};
 		//this.view = cfg.view;
 		this.on('loaded',function(args){
 			this.view.template(this.toJSON());
 		});
 		this.on('datachanged',function(args){
 			this.view.refresh(this.toJSON());
 		});
 	},
 	
 	//model:Book,
 	url:'index.php',
 	load:function(view){
 		this.view = view;
 		var me = this;
 		
 		//获取列表
 		this.fetch({
 			//url:'index.php',
	 		success:function(c,res){
	 			//成功获取服务端数据触发loaded事件
	 			me.trigger('loaded','fetched data');
	 			//alert('suc');
	 		},
	 		error: function(){
	 			alert('error');
	 		}
 		})
 	},
 	
 	refresh: function(){
 		if(this.view){
 			var me = this;
 			this.fetch({
	 			//url:'index.php',
		 		success:function(c,res){
		 			//成功获取服务端数据触发loaded事件
		 			me.trigger('datachanged','fetched data');
		 			//alert('suc');
		 		},
		 		error: function(){
		 			alert('error');
		 		}
	 		})
 		}
 	},
 	
 	//重写parse，默认是返回resp
 	/*
 	 * @overwrite
 	 */
 	parse: function(resp, xhr) {
      return resp.list;
    }
 });
 
 
 
 //View 类
 var View = Backbone.View.extend({
 	
 	initialize: function(cfg){
 		var cfg = cfg||{};
 		this.id=cfg.id;
 	},
 	
 	className:'list-con',
 	
 	tpl : '<% _.each(list,function(item){ %> <ul><li><%= item.name %></li><li><%= item.age %></li><li><a class="del" href="#">删除</a><a class="choose" href="#">选 中</a></li></ul> <% }) %> ',
 	
 	template:function(data){
 		return $('#list').html($(this.el).html(_.template(this.tpl,{list:data})));
 	},
 	
 	//数据集合
 	store:new Books(),
 	
 	render:function(){
 		//向store注入view,使store能够操作view
 		this.store.load(this);
 	},
 	
 	refresh: function(data){
 		$(this.el).html(_.template(this.tpl,{list:data}));
 	},
 	
 	//事件分发
 	events:{
 		"click .del": "onDel",
 		"click .choose": function(){
 			alert('chose');
 		}
 	},
 	
 	getStore: function(){
 		return this.store;
 	},
 	
 	onDel:function(e){
 		var d = e.target;
 		var row = $(e.target).parentsUntil('ul').parent().remove();
 	}
 	
 });
 
 
 