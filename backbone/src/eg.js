/**
 * @author gp
 * @datetime 2012-7-16
 * @description eg.js
 */

  $(document).ready(function(){

 //1
  	
  	var list = Ab.create('Ab.view.ListView',{
  		
  		id:'list11',
  		//渲染到节点的id
 		renderTo:'list1',
 		
 		/**
 		 * 分页，如不分页可不写此项。
 		 * pageSize 每页显示记录数,可不写，默认为10
 		 * 
 		 * chedan 应付把分页参数作为url的扯蛋做法
 		 */
 		pager:new Ab.view.ListPager({pageSize:15/*,chedan:true*/}),
 		
 		/**
 		 * 数据集合，必填
 		 * url 必填
 		 * root 解析返回json的根
 		 */
 		//store: new Store({url:'index.php?action=list',root:'list'}),
 		
 		store: Ab.create('Ab.store.ListStore',{
 			id:'store11',
 			url:'index.php?action=list',
 			root:'list'
 		}),
 		
 		//列属性 必填
 		columns: [{
 			
 			//列头显示的文字
            header: 'File',
            
            //列宽度 大于1为像素，小于1为百分比
            width: 20,
            
            //对应返回记录的属性
            dataIndex: 'name'
            
        },{
            header: 'Last Modified',
            width: .35, 
            dataIndex: 'lastmod'
        },{
            header: 'Size',
            dataIndex: 'size',
            
            map:function(dt){
            	//对当前字段的解析
            	return dt.first;
            }
        }]
  	});
  	
 	/*var list = new List({
 		
 		//渲染到节点的id
 		renderTo:'list1',
 		
 		*//**
 		 * 分页，如不分页可不写此项。
 		 * pageSize 每页显示记录数,可不写，默认为10
 		 * 
 		 * chedan 应付把分页参数作为url的扯蛋做法
 		 *//*
 		pager:new Pager({pageSize:15,chedan:true}),
 		
 		*//**
 		 * 数据集合，必填
 		 * url 必填
 		 * root 解析返回json的根
 		 *//*
 		store: new Store({url:'index.php?action=list',root:'list'}),
 		
 		//列属性 必填
 		columns: [{
 			
 			//列头显示的文字
            header: 'File',
            
            //列宽度 大于1为像素，小于1为百分比
            width: 20,
            
            //对应返回记录的属性
            dataIndex: 'name'
            
        },{
            header: 'Last Modified',
            width: .35, 
            dataIndex: 'lastmod'
        },{
            header: 'Size',
            dataIndex: 'size',
            
            map:function(dt){
            	//对当前字段的解析
            	return dt.first;
            }
        }]
 	});*/
 	var store = list.store;
 	store.load();
 	/*
 	//2
 	var list2 = new List({
 		renderTo:'list2',
 		store: new Store({url:'index.php?action=list2'}),
 		columns: [{
            header: '年龄',
            dataIndex: 'age'
        }]
 	});
 	var store2 = list2.store;
 	store2.load();
 	
 	
 	//3
 	var list3 = new List({
 		renderTo:'list3',
 		store: new Store({url:'index.php?action=list3'}),
 		columns: [{
            header: '<input id="checkboxall" type="checkbox">',
            width: .04,
            dataIndex: 'check',
            map:function(dt){
            	return '<input type="checkbox" class="chkc" name="checkall" />';
            }
        },{
            header: '序号',
            width: .1,
            dataIndex: 'index'
        },{
            header: '名称',
            width: 70,
            dataIndex: 'name'
        },{
            header: '地址',
            dataIndex: 'address',
            map:function(dt){
            	return '<input type="text" value="'+dt.second+'">';
            }
        }]
 	});
 	var store3 = list3.store;
 	store3.load();

 	$('#btn').click(function(e){
 		store.refresh();
 	});*/
 
 });