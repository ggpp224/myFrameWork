/*!
 * Ab
 */
/**
 * @author gp
 * @datetime 2012-7-23
 * @description index.js
 */
 
 Ab.define('Ab.view.List',{
 	tagName: 'div',
 	render: function(){
 		$(this.el).html('<span id="btn" class="btn">click</span><div style="border:solid 1px;" id="btn2" >click2</div>');
 		//this.bindEvents();
 		return this;
 	}
 });
 
/* var test = function(o){
 	alert(o.str);
 }
 var c = "test";
 
 var obj = {str:'ssdd'};
 var cc = new Function('c','obj','return new '+c+'(c,obj)');
 new cc(obj);*/
 
 var list = Ab.create('Ab.view.List',{
 	id:'test',
 	asd: function(){
 		alert('ddd');
 	},
 	events:{
 		'click #btn2':function(a,b,c,d){
 			this.trigger('rowclick','btn2');
 		}
 	}
 }).render();
// list.asd();
 $('#test').html(list.el);
 
 /*list.on('rowclick',function(msg){
 	alert(msg);
 });*/
 
 
 Ab.define('Ab.controller.ctrl',{
 	init: function(){
 		this.control({
 			'test':{
 				'click .btn':this.onClick,
 				'rowclick': function(msg,ctr,c,d){
 					alert(msg);
 				}
 			}
 		});
 	},
 	onClick: function(){
 		var view = this.getView('test');
 		
 		alert(view.id);
 	}
 });
 
 Ab.create('Ab.controller.ctrl',{});
 
 
 
 /*list.on('pclick',function(msg){
 			alert('f');
 		});*/
 
 
 /*
 Ab.define('Ab.model.mod',{
 	promptColor: function() {
	    var cssColor = prompt("Please enter a CSS color:");
	    this.set({color: cssColor});
	  }
 });
 
 	window.sidebar = Ab.create('Ab.model.mod',{});

	sidebar.on('change:color', function(model, color) {
	  alert(color);
	});
	
	sidebar.set({color: 'white'});
	
	sidebar.promptColor();
	
	

	var collection = Ab.store.create([
	  {name: "Tim", age: 5},
	  {name: "Ida", age: 26},
	  {name: "Rob", age: 55}
	]);

alert(JSON.stringify(collection));*/