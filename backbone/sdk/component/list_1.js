
 Ab.define('Ab.view.ListView',{
 	initialize: function(cfg){
 		var cfg = cfg||{};
 		Ab.apply(this,cfg);
 		
 		//@property 
 		this.renderTo=this.renderTo;
 		
 		//@property requered
 		//this.store = this.store;
 		
 		this.store.view = this;
 		
 		//@property requered
 		this.columns = this.columns||[];
 		
 		var me = this;
 		this.store.on('loaded',function(data){
 			me._tempData = data;
 			me.render(document.getElementById(me.renderTo));
 			if(me.pager){
	 				me.pager.render(me);
	 			}
 		});
 		
 		this.store.on('datachanged',function(data){
 			me._tempData = data;
 			me.refresh();
 			if(me.pager){
	 				me.pager.refresh();
	 			}
 		});
 	},
 	
 	items:[],
 	
 	className:'tablebox',
 	
 	tagName: 'table',
 	tplHd: '<thead class="table_header"><tr><% _.each(list,function(item){ %> <th <% w=item.width; if(w){ if(w>1){%> width="<%= item.width %>" <%} else{ %> width="<%= item.width*100 %>" <% } } %> ><%= item.header %></th> <% }); %></tr></thead>',
 	tplFoot:'<tfoot><tr><td class="tfoot" colspan="<%= colLen %>" ></td></tr></tfoot>',
 	tplBd :'<tbody class="openable_tbody"></tbody>',
 	tpl: '<% _.each(rows,function(r){ %> ' +
 			'<tr>' +
 				'<% _.each(cols,function(c){%> <td> <%= r[c.dataIndex] %> </td> <%}) %>'+
 			'</tr>' +
 		 ' <%}) %>',
 	 	
 	mapModel:function(m){
 		var cls = this.columns;
 			_.each(cls,function(c){
 				if(c.map){
 					//_o[c.dataIndex] = c.map(r[c.dataIndex]);
 					m.set(c.dataIndex,c.map(m.get(c.dataIndex)));

 				}
 			
 			});
 			m.set('cols',cls);
 			return m;
 			
 	},
 	
 		 
 	
 	render: function(con){
 		var me = this;
 		var head = _.template(this.tplHd,{list:this.columns}); 	
 		$(this.el).html(head);
 		$(this.el).append(_.template(this.tplFoot,{colLen:3}));
 		$(this.el).append(this.tplBd);
 		this.body = $(this.el).children('tbody')[0];
 		this.foot = $(this.el).children('tfoot').find('td')[0];
 		_.each(this.store.models ,function(m,idx){
 			m.set("index",idx);
 			var it = new Ab.view.ListItem({model:me.mapModel(m)});
 			me.items.push(it);
 			me.addItem(it);
 		});
 		
 		$(con).html(this.el);
 		
 	},
 	
 	addItem:function(item){
 		item.renderTo(this.body);
 	},
 	
 	/**
 	 * @private
 	 */
 	refresh: function(){
 		var me = this;
 		$(this.body).html('');
 		_.each(this.store.models ,function(m){
 			var it = new Ab.view.ListItem({model:me.mapModel(m)});
 			me.items.push(it);
 			me.addItem(it);
 		});
 		
 	}
 });
 
 Ab.define('Ab.store.ListStore',{
 	initialize: function(cfg){
 		var cfg = cfg||{};
 		Ab.apply(this,cfg);		
 	},
 	
 	load:function(){
 		var me = this;
 		this.oriUrl = this.url;
 		if(this.view.pager){
 			this.url = Ab.urlAppend(me.oriUrl,Ab.urlEncode({start:1,limit:me.view.pager.pageSize}))
 		}
 		//获取列表
 		this.fetch({
 			
 			//@property requered
 			//url:'index.php',
 			
 			
	 		success:function(c,res){
	 			//成功获取服务端数据触发loaded事件
	 			me.trigger('loaded',me);
	 		},
	 		error: function(){
	 			alert('error');
	 		}
 		})
 	},
 	
 	refresh: function(){
 			var me = this;
 			this.fetch({
	 			//url:'index.php',
		 		success:function(c,res){
		 			//成功获取服务端数据触发loaded事件
		 			me.trigger('datachanged',me);
		 			//alert('suc');
		 		},
		 		error: function(){
		 			alert('error');
		 		}
	 		})
 		},
 	
 	parse: function(resp, xhr) {
 	  if(resp.totalCount){
 	  	this.totalCount = resp.totalCount;
 	  }
 	  
 	  //@property requered
 	  if(this.root){
 	  	
 	  	return resp[this.root];
 	  }
      return resp;
    },
    
    setUrl :function(url){
    	this.oriUrl = url;
    	this.url = url;
    }
 });
 
 Ab.define('Ab.view.ListItem',{
 	initialize: function(cfg){
 		var cfg = cfg||{};
 		Ab.apply(this,cfg);
 		
 		
 	},
 	tagName: 'tr',
 	tpl: '<% _.each(cols,function(c){%> <td> <%= eval(c.dataIndex) %> </td> <%}) %>',
 	render:function(){
 		if(this.model){
 			var tds = _.template(this.tpl,this.model.toJSON());
 			$(this.el).html(tds);
 		}
 	},
 	
 	renderTo:function(dom){
 		this.render();
 		$(dom).append(this.el);
 	}
 });
 
 Ab.define('Ab.view.ListPager',{
 	initialize: function(cfg){
 		var cfg = cfg||{};
 		Ab.apply(this,cfg);
 		
 		
 	},
 	pageSize:10,
 	//totalCount:100,
 	currPage:1,
 	tagName: 'div',
 	className:'pagination',
 	tpl: '<% if(currPage>1){ %> <a class="first-page" href="javascript:" target="_self" >&laquo; 首页</a><a class="pre-page" href="javascript:" target="_self">&laquo; 上一页</a>  <% } %>'+
 		 '<% for(var i=pagebegin;i<=pageend;i++){ if(currPage==i){ %> <a href="#1" target="_self" class="number current"><%= i %></a> <% }else{ %> <a href="javascript:" target="_self" class="number"><%= i %></a>  <% } } %>'+
 		 '<% if(currPage<totalPage){%> <a class="next-page" href="javascript:" target="_self">下一页 &raquo;</a><a class="last-page" href="javascript:" target="_self" > 尾页&raquo;</a> <%} %>',
 	render:function(view){
 		if(view){
 			this.view = view;
 			this.store = this.view.store;
 			//this.pageSize = this.view.pageSize;
 			this.url = this.store.oriUrl;
 		}
 		
		$(this.el).html(this.getPageView());
		$(this.view.foot).html(this.el);
		
 	},
 	
 	refresh: function(){
 		$(this.el).html(this.getPageView());
 	},
 	
 	getPageView: function(){
 		this.totalCount = this.view.store.totalCount;
 		var currPage = this.currPage;
 		var totalPage = this.totalPage=Math.ceil(this.totalCount/this.pageSize);
 		var linknum=5,pagebegin=0,pageend=0;
 		if(totalPage<=1){
 			pagebegin=0;pageend=-1
 		}else if(totalPage>1 && totalPage<=linknum){
 			pageend=totalPage;pagebegin=1
 		}else if(totalPage>linknum){
			if(currPage < (Math.ceil(linknum/2)+1)){
				pageend=linknum;pagebegin=1
			}else{
				pageend=(totalPage>=(currPage+Math.floor(linknum/2)))?(currPage+2):totalPage;
					pagebegin=pageend-linknum+1;
			}
		}
		
		var htm = _.template(this.tpl,{totalPage:totalPage,currPage:currPage,linknum:linknum,pagebegin:pagebegin,pageend:pageend});
 		return htm;
 	},
 	
 	events: {
 		"click .number": "onNumberClick",
 		"click .pre-page": "onPrePageClick",
 		"click .next-page": "onNextPageClick",
 		"click .last-page": "onLastPageClick",
 		"click .first-page": "onFirstPageClick"
 	},
 	
 	//数字按钮事件
 	onNumberClick: function(e){
 		var a = e.target;
 		var num = parseInt(a.innerHTML);
 		this._handClick(num);
 	},
 	
 	//上一页
 	onPrePageClick: function(e){
 		this._handClick(this.currPage-1);
 	},
 	
 	//下一页
 	onNextPageClick: function(e){
 		this._handClick(this.currPage+1);
 	},
 	
 	//尾页
 	onLastPageClick: function(e){
 		this._handClick(this.totalPage);
 	},
 	
 	//首页
 	onFirstPageClick: function(e){
 		this._handClick(1);
 	},
 	
 	_handClick: function(num){
 		var me = this;
 		this.currPage=num;
 		var url = this.url;
 		//url += '&start='+num+'&limit='+this.pageSize;
 		url = Ab.urlAppend(url,Ab.urlEncode({start:num,limit:me.pageSize}))
 		this.store.url = url;
 		
 		if(this.chedan){
 			this.store.url = this._cheDan(url,num);
 		}
 		
 		this.store.refresh();
 	},
 	
 	renderTo:function(dom){
 		this.render();
 		$(dom).append(this.el);
 	},
 	
 	/**
 	 * 应付把分页参数作为url的扯蛋做法
 	 * @param {} url
 	 * @param {} num
 	 * @return {}
 	 */
 	_cheDan:function(url,num){
 		var arr = url.split('/');
 		arr[arr.length-3]=num;
 		return arr.join('/');
 	}
 });


