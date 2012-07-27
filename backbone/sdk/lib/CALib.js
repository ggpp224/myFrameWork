/**
 * 
 * @type 
 */
CALib = {
	launch:function(config){
		config = config || {};
		if(config.name)
		{
			this.app = this.refenceObject(null,config.name);
			var i, j, k;
        	for (i in config) {
        	    this.app[i] = config[i];
        	}
        	this.name = config.name;
		}
		else
		{
			console.log("No name supplied for your app.");
		}
		
        window.addEventListener('load',this.doLaunch,false);
        return this;
	},
	doLaunch:function(){
		var me = CALib;
		me.app.controllers = me.app.controllers || {};
        var ln = me.app.controllers && me.app.controllers.length,
            i, controller;
        for(i=0;i<ln;i++){
        	controller = me.app.controllers[i];
        	var controllerInstance = me.refenceObject(me.name+".controller",controller);
        	if(controllerInstance!=null)
        	{
	        	controllerInstance.init();
	        }
        }
	},
	ns:function(){
		var ln = arguments.length,
	        i, value, split, x, xln, parts, object;
	
	    for (i = 0; i < ln; i++) {
	        value = arguments[i];
	        parts = value.split(".");
	        if (window.CALib) {
	            object = window[parts[0]] = Object(window[parts[0]]);
	        } else {
	            object = arguments.callee.caller.arguments[0];
	        }
	        for (x = 1, xln = parts.length; x < xln; x++) {
	            object = object[parts[x]] = Object(object[parts[x]]);
	        }
	    }
	    return object;
	},
	createObject:function(namespace,objectName){
		var obj=null;
		var nsStr = "";
		if(namespace)
		{
			nsStr = namespace+'.';
		}
		try{
			eval('obj = new ' + nsStr + objectName + '()');
		}catch(e){
			console.error('Can not create object : ' + nsStr + objectName);
		}
		return obj;
	},
	refenceObject:function(namespace,objectName){
		var obj=null;
		var nsStr = "";
		if(namespace)
		{
			nsStr = namespace+'.';
		}
		try{
			eval('obj = ' + nsStr + objectName);
		}catch(e){
			console.error('Can not find object : ' + nsStr + objectName);
		}
		return obj;
	},
	getController:function(controllerName){
		return this.refenceObject(this.name+".controller",controllerName);
	},
	createView:function(viewName){
		return this.createObject(this.name+".view",viewName);
	},
	getOS: function(){
		var osName = '';
		if((/android/gi).test(navigator.appVersion)){
			osName = 'android';
		}else if((/iphone|ipad/gi).test(navigator.appVersion)){
			osName = 'ios';
		}else{
			osName = 'browser';
		}
		return osName;
	},
	formatDate: function(date){
		var dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		return dateStr;
	},
	moveUpDownformElement: function(){
		$('html').css({'paddibg-bottom':'200px'});
		$('body').scrollTop(200);
	},
	getOriginalImg: function(sImg){
		return sImg.substring(0, sImg.lastIndexOf('.thumnail.jpg'));
	},
	back: function(controllerName){
		if(!window.sessionStorage){
			console.warn('Your browser did not support session storage');
			return;
		}
		
		var historyObj = sessionStorage.getItem('history');
		if(historyObj && 'null' != historyObj){
			CheckAutoApplication.getController('CheckController').load(historyObj);
			sessionStorage.setItem('history', null);
		}else{
			if(controllerName.indexOf('check.') > -1){
				CheckAutoApplication.getController('CheckController').load(controllerName);
			}else{
				CheckAutoApplication.getController(controllerName).load();
			}
		}
	},
	alert: function(msg, callback, title, btnLabel){
		if(CheckAutoApplication.getOS() != 'browser'){
			navigator.notification.alert(msg, callback, title, btnLabel);
		}else{
			alert(msg);
		}
	},
	confirm: function(msg, callback, title, btnLabel){
		
		if(CheckAutoApplication.getOS() != 'browser'){
			navigator.notification.confirm(msg, callback, title, btnLabel);
		}else{
			if(confirm(msg)){
				callback(1);
			}else{
				callback(0);
			}
		}
		
		
	},
	toast: function(obj){
		if(obj && obj.message && (CheckAutoApplication.getOS() != 'browser')){
			window.plugins.ToastPlugin.show(obj);
		}
	},
	showProgressDialog: function(obj){
		if(obj && obj.message && (CheckAutoApplication.getOS() != 'browser')){
			window.plugins.ProgressDialogPlugin.show(obj);
		}
	},
	hideProgressDialog: function(){
		if(CheckAutoApplication.getOS() != 'browser'){
			window.plugins.ProgressDialogPlugin.hide();
		}
	}
};
