/**
 * @author gp
 * @datetime 2012-7-17
 * @description common.js
 */

$.ajaxSetup({
	timeout : 120000,
	beforeSend : function(xh, opt) {
		if (opt.type == "GET") {
			var url = opt.url;
			url += url.match(/\?/) ? "&" : "?";
			url += "_dc=" + new Date().getTime();
			opt.url = url;
		}
	}
});
