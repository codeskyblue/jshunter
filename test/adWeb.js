/**
 * @description 命名空间
 * @namespace adWeb
 * @public
 * @static
 * @requires jQuery.js Backbone.js
 * @author han_qiang
 */
var adWeb = _.isUndefined(adWeb) ? {} : adWeb;

/**
 * @description 给Virgo继承
 * @namespace adWeb._extend
 * @private
 * @static
 * @param {Object} 要继承的对象
 * @return 
 * @author han_qiang
 */
adWeb._extend = function(des) {
	_.extend(adWeb,des);
};

adWeb._extend({
	
	getNextHelp : function(){
		var help = [
			{
				ask      : '【帮助】如何查看部署的值班人？',
				question : "我们在顶部和左侧都放了两个连接：在线客服，红色闪光的，点击就能看到了。"
			},
			{
				ask      : '【帮助】是什么自动化测试?',
				question : "树立标杆产品线，将整体流程用平台打通，noah发部署操作单，自动创建QA测试部署单，并与prophet（或其他测试平台）整合，完成测试环节后自动触发正式上线单部署到线上。 详情请<a href='http://noah.baidu.com/help/bushu_admin2.html' target='_blank'>点击</a>。"
			},
			{
				ask      : '【帮助】如何屏蔽操作中报警',
				question : "详情请<a href='http://noah.baidu.com/help/bushu_add.html#n32' target='_blank'>点击</a>。"
			}
		];
		
		if(!_.isUndefined(window['Help'])){
			help = Help.data;
		}
		
		if(_.isUndefined(adWeb.getNextHelp.id)){
			adWeb.getNextHelp.id = 0;
		}else{
			adWeb.getNextHelp.id++;
		}
		
		if(adWeb.getNextHelp.id > (help.length - 1)){
			adWeb.getNextHelp.id = 0;
		}

		return "<div style='color:#666;margin-bottom:10px;font-size:12px;'>程序正在运行(浏览器没有死掉)，看看这里打发时间：</div><h3>"+(help[adWeb.getNextHelp.id])['ask']+"</h3><div>"+(help[adWeb.getNextHelp.id])['question']+"</div><div style='color:#999;font-size:12px;margin-top:25px;'>*随机抽取问题是为了帮助您识别浏览器是否进入假死状态。</div>";
	}
});

adWeb._extend({
	/**
	 * @description mask
	 * @namespace adWeb.mask
	 * @private
	 * @static
	 * @return 
	 * @author han_qiang
	 */
	mask : {
		init : function(cfg){
			
			adWeb.mask.hide();
			adWeb.mask.createMask(cfg);
		},
		
		show : function(cfg){
			if(adWeb.mask.lazyTimeHandle){
				window.clearTimeout(adWeb.mask.lazyTimeHandle);
				
			}
			adWeb.mask.lazyTimeHandle = window.setTimeout(function(){
				adWeb.mask.trueShow.call(this,cfg);
			},1000*0.7);
		},
		
		trueShow : function(cfg){
			if(_.isUndefined(cfg)){
				cfg = {};
			}
			cfg.text = "数据处理中，请稍候...";
			adWeb.mask.init(cfg);
			$('.adWebMask').show();
			$('.adWebMaskText').show();
			adWeb.mask.status = 1;
			if(adWeb.mask.timeHandle){
				window.clearInterval(adWeb.mask.timeHandle);
			}
			
			adWeb.mask.timeHandle = window.setInterval(function(){
				$('.adWebMaskText').html(adWeb.getNextHelp());
			},1000*7);
		},
		
		hide : function(){
			if(adWeb.mask.lazyTimeHandle){
				window.clearTimeout(adWeb.mask.lazyTimeHandle);
			}
			
			$('.adWebMask').remove();
			$('.adWebMaskText').remove();
			adWeb.mask.status = 0;
			if(adWeb.mask.timeHandle){
				window.clearInterval(adWeb.mask.timeHandle);
			}
			return true;
		},
		
		createMask : function(cfg){
			var _html = '',_height,_txt = '数据处理中，请稍候...';
			
			cfg = cfg || {};
			
			_txt = cfg.text || _txt;
			
			_height = $('body').height() + 30;
			
			_html = "<div class='adWebMask' style='display:none;position:absolute;top:0%;left:0%;width:100%;height:"+_height+"px;background-color:black;z-index:9998;-moz-opacity: 0.7;opacity:.70;filter: alpha(opacity=70);'></div>";
			
			_html += "<div class='adWebMaskText' style='display:none;position:fixed;top:25%;left:22%;width:53%;height:49%;padding:8px;border:8px solid #E8E9F7;background-color:white;z-index:9999;overflow:auto;'>"+_txt+"</div>";
			
			$('body').append(_html);
			
			return ;
		}
	}
});
adWeb._extend({
	/**
	 * @description silence
	 * @namespace adWeb.silence
	 * @private
	 * @static
	 * @return 
	 * @author han_qiang
	 */
	SILENCE : {silent:true}
	
	,Help : {}
});

adWeb._extend({
	/**
	 * @description alert
	 * @namespace adWeb.alert
	 * @private
	 * @static
	 * @return 
	 * @author han_qiang
	 */
	//alert : function(text,success,callback,title,width){
	alert : function(config){
		var dialogInstance,options;
		
		//兼容旧的模式
		if(_.isString(config)){
			var _config = config;
			config = {text:_config};
		}
		config.text = config.text.replace(/\n/g,"<br />");

		if(!config.title){
			config.title = config.success ? '处理成功！' : '噢，出现了一些错误！';
		}
		
		options = {
                titleText   : config.title,					
                height      : "auto",
                width       : 390,
                modal       : true,
                draggable   : true,
                autoRender  : true,
                contentText : "<div style='padding:10px 5px;'>"+config.text+"</div>",
				onclose     : function(){
					var callback = config.callback || (function(){});
					callback.call(this);
				}
        };
		
		$.extend(options,config);
        dialogInstance = new T.ui.Dialog(options);
        dialogInstance.open();
		return dialogInstance;
	}
});



adWeb._extend({
	
	Model : {},
	
	View  : {},
	
	Controller : {},
	
	Event : {},
	
	Collection : {},
	
	run : function(name){
		new adWeb.Controller[name];
		Backbone.history.start()
	}
});

adWeb._extend({
	
				
	/**
	 * @description 封装了简化的ajax请求
	 * @param {Object} 配置数据
	 * @return
	 * @method ajax
	 * @namespace adWeb.ajax
	 * @private
	 * @static
	 */
	ajax       : function(config){
				
		var config = $.extend({
			url : '',
			type : 'POST',
			dataType : 'json',
			data     : {},
			success : new Function(),
			error   : new Function()
					
		},config);
				
		$.ajax({
			url      : config.url,	
			type     : config.type,
			dataType : config.dataType,
			data     : _.isString(config.data) ? data : $.param(config.data),
			success  : function(json){
				adWeb.mask.hide();
				config.success.call(this,json);
			},
			error    : function(){
				adWeb.mask.hide();
				config.error.call(this);
			}
		});
	},
	
	/**
	 * @description 对Virgo.ajax的再一次封装
	 * @param {String}   url
	 * @param {Object}   data
	 * @param {Function} success
	 * @param {Function} error
	 * @namespace adWeb.ajaxSimple
	 * @return 
	 * @method agent
	 * @private
	 * @static
	 */
	ajaxSimple : function(url,data,success,error){
		error.url = url;
		adWeb.ajax({
			url     : url,
			data    : data,
			success : success,
			error   : error
		});	
	},
	
	/**
	 * @description ajax请求出错时
	 * @namespace adWeb.ajaxOnError
	 * @return 
	 * @method agent
	 * @private
	 * @static
	 */
	ajaxOnError : function(){
		adWeb.alert({text:"通过ajax请求数据时出错\n"+adWeb.ajaxOnError.url});
		return false;
	}
});


adWeb._extend({
	
	/**
	 * @description Virgo的常用Url
	 * @property adWeb.url
	 * @namespace adWeb.url
	 * @author han_qiang
	 */
	url : {	
				
		
		/**
		 * @description 查询模块
		 * @ajaxRequestUrl   /ad-web/ChooseSu/QueryModule
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {String} queryType ("queryModule") 查询类型
		 * @ajaxRequestParam {String} keywords  (*) 查询关键字
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * [
		 *  {
		 *    //id
		 *    id    :'op/oped/noah/fe/template/virgo',
		 *    
		 *    //label
		 *    label : 'op/oped/noah/fe/template/virgo',
		 *
		 *    //value
		 *    value : 'op/oped/noah/fe/template/virgo'
		 *  },
		 *  ... ...
		 * ]
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.queryModule
		 * @namespace adWeb.url.queryModule
		 * @author han_qiang
		 */
		queryModule : function(data,callBack){
		
			var url = '/ad-web/ChooseSu/QueryModule';
			
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},			
		
		/**
		 * @description 根据服务单元查
		 * @ajaxRequestUrl   /ad-web/ChooseSu/QueryServiceUnit
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {String} keyWord  (*) 查询关键字
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * [
		 *  {
		 *    //id
		 *    id    :'op/oped/noah/fe/template/virgo',
		 *    
		 *    //label
		 *    label : 'op/oped/noah/fe/template/virgo',
		 *
		 *    //value
		 *    value : 'op/oped/noah/fe/template/virgo'
		 *  },
		 *  ... ...
		 * ]
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.querySu
		 * @namespace adWeb.url.querySu
		 * @author han_qiang
		 */
		querySu : function(data,callBack){
		
			var url = '/ad-web/ChooseSu/QueryServiceUnit';
			
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},		
		
		/**
		 * @description 获取指定模块的服务单元和全部模块
		 * @ajaxRequestUrl   /ad-web/ChooseSu/GetSuListByModule
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {String} moduleName  (*) 模块名称
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *	data	:[
		 *		{
		 *			id     : 100,
		 *			su     : 'BAIDU_NS_PE_noah_web_web',
		 *			module : [
		 *				{
		 *					name : 'op/oped/noah/lib/web-lib',
		 *					path : 'BAIDU_NS_PE_noah_web_web',
		 *					platform : '32',
		 *					selected : false,
		 *					topdir   : '/home/work/noah/web/lib',
		 *					version  : '1.0.0.0'
		 *				},
		 *				... ...
		 *			]
		 *		},
		 *		... ...
		 *	]
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.GetSuListByModule
		 * @namespace adWeb.url.GetSuListByModule
		 * @author han_qiang
		 */
		GetSuListByModule : function(data,callBack){
		
			var url = '/ad-web/ChooseSu/GetSuListByModule';
			
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},			
		
		/**
		 * @description 获取指定的服务单元和全部模块
		 * @ajaxRequestUrl   /ad-web/ChooseSu/GetSulistBySuName
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {String} suName  (*) 服务单元名称
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *	data	:[
		 *		{
		 *			id     : 100,
		 *			su     : 'BAIDU_NS_PE_noah_web_web',
		 *			module : [
		 *				{
		 *					name : 'op/oped/noah/lib/web-lib',
		 *					path : 'BAIDU_NS_PE_noah_web_web',
		 *					platform : '32',
		 *					selected : false,
		 *					topdir   : '/home/work/noah/web/lib',
		 *					version  : '1.0.0.0'
		 *				},
		 *				... ...
		 *			]
		 *		},
		 *		... ...
		 *	]
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.getSuListBySuName
		 * @namespace adWeb.url.getSuListBySuName
		 * @author han_qiang
		 */
		getSuListBySuName : function(data,callBack){
		
			var url = '/ad-web/ChooseSu/GetSulistBySuName';
			
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},		
		
		/**
		 * @description 获取指定模块的服务单元和全部模块(编辑)
		 * @ajaxRequestUrl   /ad-web/ChooseSu/GetSuListByListId
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (\d+) 单子id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *	data	:{
		 * 		//串并行
		 * 		chain : 0|1,
		 * 		//定时上线
		 * 		timing : "",
		 * 		//状态通知
		 * 		stateNotice : "start,pause,exception,finish",
		 * 		//订阅方式
		 * 		notifyType : "sms,email",
		 *		suAndModule : [
		 *		{
		 *          selected : true,
		 *			id     : 100,
		 *			su     : 'BAIDU_NS_PE_noah_web_web',
		 *			module : [
		 *				{
		 *					name : 'op/oped/noah/lib/web-lib',
		 *					path : 'BAIDU_NS_PE_noah_web_web',
		 *					platform : '32',
		 *					selected : false,
		 *					topdir   : '/home/work/noah/web/lib',
		 *					version  : '1.0.0.0'
		 *				},
		 *				... ...
		 *			]
		 *		},
		 *		... ...
		 *		]
		 * }
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.chooseSuById
		 * @namespace adWeb.url.chooseSuById
		 * @author han_qiang
		 */
		chooseSuById : function(data,callBack){
		
			var url = '/ad-web/ChooseSu/GetSuListByListId';
			
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},		
		
		/**
		 * @description 导入模块(编辑)
         * @ajaxRequestUrl   /ad-web/ChooseSu/GetSuListByModuleVerionList
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {String} moduleNameText  (*) moduleName Text
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *	data	:[
		 *		{
		 *			id     : 100,
		 *			su     : 'BAIDU_NS_PE_noah_web_web',
		 *			module : [
		 *				{
		 *					name : 'op/oped/noah/lib/web-lib',
		 *					path : 'BAIDU_NS_PE_noah_web_web',
		 *					platform : '32',
		 *					selected : false,
		 *					topdir   : '/home/work/noah/web/lib',
		 *					version  : '1.0.0.0'
		 *				},
		 *				... ...
		 *			]
		 *		},
		 *		... ...
		 *	]
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.getModuleByImport
		 * @namespace adWeb.url.getModuleByImport
		 * @author han_qiang
		 */
		getModuleByImport : function(data,callBack){
		
            var url = '/ad-web/ChooseSu/GetSuListByModuleText';
			
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},

        getModuleByIcafe : function(data,callBack){
            var url = '/ad-web/ChooseSu/GetSuListByModuleVerionList';

            adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);

        },

		
		/**
		 * @description 发送选定的服务单元和模块
		 * @ajaxRequestUrl   /ad-web/ChooseSu/CreateDeployList
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Json} data  (*) post json
		 * @ajaxRequestParam_demo_data 
		 * <pre>
		 * //模块名称
		 * data = [
		 *	{
		 *		su : 1,
		 *      module : [{
		 *			name : '/home/work/noah/web/lib'
		 *			version : '1.0.0.0',
		 *			path    : '/home/work/noah/web/lib',
		 *			topdir   : '/home/work/noah/web/lib',
		 *			platform : '32'
		 *      },
		 *		... ...
		 *		]
		 *  },
		 *  ... ...
		 * ]
		 * </pre>
		 * @ajaxRequestParam {Int} chain  (0|1) 串并行
		 * @ajaxRequestParam {String} timing  (*) 定时上线
		 * @ajaxRequestParam {String} stateNotice  (start,pause,exception,finish) 状态通知
		 * @ajaxRequestParam {String} notifyType  (sms,email) 订阅方式
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *
		 *  //返回的数字指定要跳转的页面的id
		 *  data    : 1
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.postSelectSuAndModule
		 * @namespace adWeb.url.postSelectSuAndModule
		 * @author han_qiang
		 */
		postSelectSuAndModule : function(data,callBack){
		
			var url = '/ad-web/ChooseSu/CreateDeployList';
			
			adWeb.mask.show();
			
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},

		/**
		 * @description 发送选定的服务单元和模块(编辑)
		 * @ajaxRequestUrl   /ad-web/ChooseSu/UpdateDeployList
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (\d+) 单子id
		 * @ajaxRequestParam {Json} data  (*) post json
		 * @ajaxRequestParam_demo_data 
		 * <pre>
		 * //模块名称
		 * data = [
		 *	{
		 *		su : 1,
		 *      module : [{
		 *			name : '/home/work/noah/web/lib'
		 *			version : '1.0.0.0',
		 *			path    : '/home/work/noah/web/lib',
		 *			topdir   : '/home/work/noah/web/lib',
		 *			platform : '32'
		 *      },
		 *		... ...
		 *		]
		 *  },
		 *  ... ...
		 * ]
		 * </pre>
		 * @ajaxRequestParam {Int} chain  (0|1) 串并行
		 * @ajaxRequestParam {String} timing  (*) 定时上线
		 * @ajaxRequestParam {String} stateNotice  (start,pause,exception,finish) 状态通知
		 * @ajaxRequestParam {String} notifyType  (sms,email) 订阅方式
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *
		 *  //返回的数字指定要跳转的页面的id
		 *  data    : 1
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.postSelectSuAndModuleById
		 * @namespace adWeb.url.postSelectSuAndModuleById
		 * @author han_qiang
		 */
		postSelectSuAndModuleById : function(data,callBack){
		
			var url = '/ad-web/ChooseSu/UpdateDeployList';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
		 * @description 选择机器
		 * @ajaxRequestUrl   /ad-web/SetSuAction/ChooseMachine
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} deploy_su_id  (\d+) 上线服务单元id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *
		 *  //返回的数据
		 *  data    : {
		 *         //备选机器列表
		 *         "host_list":[
		 *             {"host_id":"35082","host_name":"tc-oped-dev02.tc"},
		 *             {"host_id":"27854","host_name":"tc-test-aos02.tc"}
		 *         ],
		 *        //已选的机器
		 *        "choose_host_list":[
		 *             {"host_id":"27854","host_name":"tc-test-aos02.tc"}
		 *        ],
		 *        //暂停的机器
		 *        "pause_list":[]
		 * }
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.getMachineList
		 * @namespace adWeb.url.getMachineList
		 * @author han_qiang
		 */
        getMachineList : function(data,callBack){
		
			var url = '/ad-web/SetSuAction/ChooseMachine';
			
			adWeb.ajaxSimple(
				url,
				data,
				callBack,
				adWeb.ajaxOnError
			);
		},
		
		/**
		 * @description 设置机器
		 * @ajaxRequestUrl   /ad-web/SetSuAction/SaveMachine
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Json} data  (*) 数据
		 * @ajaxRequestParam_demo_data
		 * <pre>
		 * //
		 * data  = {
		 *       //服务单元id
		 *       "deploy_su_id":"3673",
		 *       //选择的机器
		 *       "choose_host_list":[
		 *             {"host_id":1,"host_name":"dev02.vm"},
		 *             {"host_id":2,"host_name":"dev01.vm"}
		 *        ],
		 *        //暂停的机器
		 *        "pause_list":[
		 *             "dev01.vm",
		 *             "dev02.vm"
		 *        ]
		 * }
		 * </pre>
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *  data    : []
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.setSuMachineList
		 * @namespace adWeb.url.setSuMachineList
		 * @author han_qiang
		 */
        setSuMachineList : function(data,callBack,ajaxOnError){
		
			var url = '/ad-web/SetSuAction/SaveMachine';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,ajaxOnError||adWeb.ajaxOnError);
		},



		/**
		 * @description 是否升级模块
		 * @ajaxRequestUrl   /ad-web/SetSuAction/SetDeployModuleOperate
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} deploy_module_id  (\d+) 上线模块id
		 * @ajaxRequestParam {String} operation  (general|update) 是否升级		 
		 * @ajaxRequestParam {String} operator_type  (OP|QA) 操作模式
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *  data    : {
		 *         //选择的文件列表
		 *         "chooseFileList":[],
		 *         //ci id
		 *         "ci_id":0,
		 *         //文件总数
		 *         "file_number":0,
		 *         //选择的文件数
		 *         "choose_file_number":0,
		 *         //编译平台
		 *         "build_platform":"64",
		 *         //ci对应的三位版本列表
		 *         "threeBitList":[
		 *            "1.0.52",
		 *            "1.0.34"
		 *         ],
		 *          //ci对应的四位版本列表
		 *         "fourBitList":[
		 *               "1.0.52.0",
		 *               "1.0.46.1",
		 *               "1.0.46.0"
		 *          ]
		 *    }
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.needUpdateModule
		 * @namespace adWeb.url.needUpdateModule
		 * @author han_qiang
		 */
        needUpdateModule : function(data,callBack,ajaxOnError){

			var url = '/ad-web/SetSuAction/SetDeployModuleOperate';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,ajaxOnError||adWeb.ajaxOnError);
			
        },

		/**
		 * @description 设置线上模块版本
		 * @ajaxRequestUrl   /ad-web/SetSuAction/SetDeployModuleVersion
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} deploy_module_id  (\d+) 上线模块id
		 * @ajaxRequestParam {String} version  (*) 版本		 
		 * @ajaxRequestParam {String} operator_type  (OP|QA) 操作模式
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *  data    : {
		 *         //选择的文件列表
		 *         "chooseFileList":[],
		 *         //ci id
		 *         "ci_id":0,
		 *         //文件总数
		 *         "file_number":0,
		 *         //选择的文件数
		 *         "choose_file_number":0,
		 *         //编译平台
		 *         "build_platform":"64",
		 *         //ci对应的三位版本列表
		 *         "threeBitList":[
		 *            "1.0.52",
		 *            "1.0.34"
		 *         ],
		 *          //ci对应的四位版本列表
		 *         "fourBitList":[
		 *               "1.0.52.0",
		 *               "1.0.46.1",
		 *               "1.0.46.0"
		 *          ]
		 *    }		 
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.updateModuleVersion
		 * @namespace adWeb.url.updateModuleVersion
		 * @author han_qiang
		 */
        updateModuleVersion : function(data,callBack,ajaxOnError){

			var url = '/ad-web/SetSuAction/SetDeployModuleVersion';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,ajaxOnError||adWeb.ajaxOnError);
			
        },

		/**
		 * @description 补充操作信息-提交
		 * @ajaxRequestUrl   /ad-web/SetSuAction/SubmitForFinish
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Json} data  (*) 表单信息
		 * @ajaxRequestParam_demo_data
		 * <pre>
		 * //表单信息
		 * data = 	{
		 *      //操作单id
		 *      "id":"5813",
		 *      //操作单名称
		 *      "name":"伏晔操作op/oped/noah/aos-business,op/psop/aos/monitor-cc",
		 *      //服务单元的信息
		 *      "suListInfo":[
		 *          {
		 *            //服务单元id
		 *            "id":"3673",
		 *            //机器并发度
		 *            "concurrency":"1",
		 *            //运行帐户
		 *            "account":"work",
		 *            //下载限速
		 *            "download_rate":"3",
		 *            //单机执行时间预估
		 *            "machine_timeout":"600",
		 *            //机器上线时间间隔
		 *            "machine_interval":"0",
		 *            //操作中屏蔽报警
		 *            "block_alarm":"TRUE",
		 *            //服务单元对应的模块信息
		 *            "moduleListInfo":[
		 *                 {
		 *                   //模块id
		 *                   "id":"3673",
		 *                   //服务检查
		 *                   "moni_timeout":"10"
		 *                 },
		 *                 ... ...
		 *            ]
		 *          },
		 *          ... ...
         * }
		 * </pre>
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *  data    : {"id":5813}
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.submitForFinish
		 * @namespace adWeb.url.submitForFinish
		 * @author han_qiang
		 */
        submitForFinish : function(data,callBack,ajaxOnError){

			var url = '/ad-web/SetSuAction/SubmitForFinish';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,ajaxOnError||adWeb.ajaxOnError);
			
        },
		
		/**
		 * @description 传输类型
		 * @ajaxRequestUrl   /ad-web/SetSuAction/SetDeployProtocol
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Json} data  (*) 表单信息
		 * @ajaxRequestParam_demo_data
		 * <pre>
		 * //表单信息
		 * data = 	{
		 *      //操作单id
		 *      "id":"5813",
		 *      //操作单名称
		 *      "name":"伏晔操作op/oped/noah/aos-business,op/psop/aos/monitor-cc",
		 *      //服务单元的信息
		 *      "suListInfo":[
		 *          {
		 *            //服务单元id
		 *            "id":"3673",
		 *            //机器并发度
		 *            "concurrency":"1",
		 *            //运行帐户
		 *            "account":"work",
		 *            //下载限速
		 *            "download_rate":"3",
		 *            //单机执行时间预估
		 *            "machine_timeout":"600",
		 *            //机器上线时间间隔
		 *            "machine_interval":"0",
		 *            //操作中屏蔽报警
		 *            "block_alarm":"TRUE",
		 *            //服务单元对应的模块信息
		 *            "moduleListInfo":[
		 *                 {
		 *                   //模块id
		 *                   "id":"3673",
		 *                   //服务检查
		 *                   "moni_timeout":"10"
		 *                 },
		 *                 ... ...
		 *            ]
		 *          },
		 *          ... ...
         * }
		 * </pre>
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *  data    : {"id":5813}
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.submitForFinish
		 * @namespace adWeb.url.submitForFinish
		 * @author han_qiang
		 */
        SetDeployProtocol : function(data,callBack,ajaxOnError){

			var url = '/ad-web/SetSuAction/SetDeployProtocol';

			adWeb.ajaxSimple(url,data,callBack,ajaxOnError||adWeb.ajaxOnError);
			
        },		
		
		/**
		 * @description 是否自动测试
		 * @ajaxRequestUrl   /ad-web/SetSuAction/SetDeployAutoTest
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Json} data  (*) 表单信息
		 * @ajaxRequestParam_demo_data
		 * <pre>
		 * //表单信息
		 * data = 	{
		 *      //操作单id
		 *      "id":"5813",
		 *      //操作单名称
		 *      "name":"伏晔操作op/oped/noah/aos-business,op/psop/aos/monitor-cc",
		 *      //服务单元的信息
		 *      "suListInfo":[
		 *          {
		 *            //服务单元id
		 *            "id":"3673",
		 *            //机器并发度
		 *            "concurrency":"1",
		 *            //运行帐户
		 *            "account":"work",
		 *            //下载限速
		 *            "download_rate":"3",
		 *            //单机执行时间预估
		 *            "machine_timeout":"600",
		 *            //机器上线时间间隔
		 *            "machine_interval":"0",
		 *            //操作中屏蔽报警
		 *            "block_alarm":"TRUE",
		 *            //服务单元对应的模块信息
		 *            "moduleListInfo":[
		 *                 {
		 *                   //模块id
		 *                   "id":"3673",
		 *                   //服务检查
		 *                   "moni_timeout":"10"
		 *                 },
		 *                 ... ...
		 *            ]
		 *          },
		 *          ... ...
         * }
		 * </pre>
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *  data    : {"id":5813}
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.submitForFinish
		 * @namespace adWeb.url.submitForFinish
		 * @author han_qiang
		 */
        SetDeployAutoTest : function(data,callBack,ajaxOnError){

			var url = '/ad-web/SetSuActionAsyn/SetDeployAutoTest';

			adWeb.ajaxSimple(url,data,callBack,ajaxOnError||adWeb.ajaxOnError);
			
        },		
        SetEnableMacsCheck : function(data,callBack,ajaxOnError){

			var url = '/ad-web/SetSuActionAsyn/SetEnableMacsCheck';

			adWeb.ajaxSimple(url,data,callBack,ajaxOnError||adWeb.ajaxOnError);
			
        },		
		
		/**
		 * @description 补充操作信息-完成并提交审核
		 * @ajaxRequestUrl   /ad-web/ChooseSu/FinishToAudit
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Json} data  (*) 表单信息
		 * @ajaxRequestParam_demo_data
		 * <pre>
		 * //表单信息
		 * data = 	{
		 *      //操作单id
		 *      "id":"5813",
		 *      //操作单名称
		 *      "name":"伏晔操作op/oped/noah/aos-business,op/psop/aos/monitor-cc",
		 *      //服务单元的信息
		 *      "suListInfo":[
		 *          {
		 *            //服务单元id
		 *            "id":"3673",
		 *            //机器并发度
		 *            "concurrency":"1",
		 *            //运行帐户
		 *            "account":"work",
		 *            //下载限速
		 *            "download_rate":"3",
		 *            //单机执行时间预估
		 *            "machine_timeout":"600",
		 *            //机器上线时间间隔
		 *            "machine_interval":"0",
		 *            //操作中屏蔽报警
		 *            "block_alarm":"TRUE",
		 *            //服务单元对应的模块信息
		 *            "moduleListInfo":[
		 *                 {
		 *                   //模块id
		 *                   "id":"3673",
		 *                   //服务检查
		 *                   "moni_timeout":"10"
		 *                 },
		 *                 ... ...
		 *            ]
		 *          },
		 *          ... ...
         * }
		 * </pre>
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *  data    : {"id":5813}
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ChooseSuFinishToAudit
		 * @namespace adWeb.url.ChooseSuFinishToAudit
		 * @author han_qiang
		 */
        ChooseSuFinishToAudit : function(data,callBack,ajaxOnError){

			var url = '/ad-web/ChooseSu/FinishToAudit';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,ajaxOnError||adWeb.ajaxOnError);
			
        },		
		
		/**
		 * @description 补充操作信息-完成并一键上线
		 * @ajaxRequestUrl   /ad-web/ChooseSu/FinishToApply
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Json} data  (*) 表单信息
		 * @ajaxRequestParam_demo_data
		 * <pre>
		 * //表单信息
		 * data = 	{
		 *      //操作单id
		 *      "id":"5813",
		 *      //操作单名称
		 *      "name":"伏晔操作op/oped/noah/aos-business,op/psop/aos/monitor-cc",
		 *      //服务单元的信息
		 *      "suListInfo":[
		 *          {
		 *            //服务单元id
		 *            "id":"3673",
		 *            //机器并发度
		 *            "concurrency":"1",
		 *            //运行帐户
		 *            "account":"work",
		 *            //下载限速
		 *            "download_rate":"3",
		 *            //单机执行时间预估
		 *            "machine_timeout":"600",
		 *            //机器上线时间间隔
		 *            "machine_interval":"0",
		 *            //操作中屏蔽报警
		 *            "block_alarm":"TRUE",
		 *            //服务单元对应的模块信息
		 *            "moduleListInfo":[
		 *                 {
		 *                   //模块id
		 *                   "id":"3673",
		 *                   //服务检查
		 *                   "moni_timeout":"10"
		 *                 },
		 *                 ... ...
		 *            ]
		 *          },
		 *          ... ...
         * }
		 * </pre>
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *  data    : {"id":5813}
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ChooseFinishToApply
		 * @namespace adWeb.url.ChooseFinishToApply
		 * @author han_qiang
		 */
        ChooseFinishToApply : function(data,callBack,ajaxOnError){

			var url = '/ad-web/ChooseSu/FinishToApply';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,ajaxOnError||adWeb.ajaxOnError);
			
        },

        /**
         * @description 删除配置文件
         *
		 * @ajaxRequestUrl   
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam 
		 * <pre>
		 * //配置文件路径
		 * configFile  = "/home/work/lxy/aos-busi/abc"
		 *
		 * //模块id
		 * deploy_module_id = 1
		 *
		 * //操作单id
		 * id = 1
		 * </pre>
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.removeConfigFile
		 * @namespace adWeb.url.removeConfigFile
		 * @author han_qiang
         *
         *
         */
        removeConfigFile : function(data,callBack,ajaxOnError){

			var url = '/ad-web/SetSuAction/removeConfigFile';
			
			adWeb.ajaxSimple(url,data,callBack,ajaxOnError||adWeb.ajaxOnError);
			
        },

        /**
         * @description 编辑配置文件
         *
		 * @ajaxRequestUrl   
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam 
		 * <pre>
		 * //配置文件路径
		 * configFile  = "/home/work/lxy/aos-busi/abc"
		 *
		 * //模块id
		 * deploy_module_id = 1
		 *
		 * //操作单id
		 * id = 1
		 * </pre>
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 *  data    : {
		 *          allmachines: ['tc-oped-dev02.tc']
		 *          from       :'',
		 *          chkmachine : [],
		 *          fromIndex  : 1000,
		 *          line       : ''
		 *          data       : [
		 *							[
		 *								{
		 *									"cnt":"11111",
		 *									"line":"1-7",
		 *									"count":1,
		 *									"machines":[]
		 *								}
		 *							]
		 *						]
		 *  }
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.modifyConfigFile
		 * @namespace adWeb.url.modifyConfigFile
		 * @author han_qiang
         *
         *
         */
        modifyConfigFile : function(data,callBack,ajaxOnError){

			var url = '/ad-web/SetSuAction/removeConfigFile';
			
			adWeb.ajaxSimple(url,data,callBack,ajaxOnError||adWeb.ajaxOnError);
			
        },

        /**
         * @description 添加配置文件
         *
		 * @ajaxRequestUrl   
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam 
		 * <pre>
		 * //配置文件路径
		 * configFile  = "/home/work/lxy/aos-busi/abc"
		 *
		 * //模块id
		 * deploy_module_id = 1
		 *
		 * //操作单id
		 * id = 1
		 * </pre>
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *  data    : {
		 *
		 * //both = 存在于原版本和新版本
		 * //new = 只存在于新版本
		 * //old = 只存在于原版本
		 * //add = 新增自操作单
		 * 			status : 'both|new|old|add'
		 *  }
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property  adWeb.url.addConfigFile
		 * @namespace adWeb.url.addConfigFile
		 * @author han_qiang
         *
         *
         */
        addConfigFile : function(data,callBack,ajaxOnError){

			var url = '/ad-web/SetSuAction/removeConfigFile';
			
			adWeb.ajaxSimple(url,data,callBack,ajaxOnError||adWeb.ajaxOnError);
			
        },
		
		/**
		 * @description 保存文件树
		 * @ajaxRequestUrl   /ad-web/SetSuAction/SaveChooseScmFile
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Json} data  (*) post json
		 * @ajaxRequestParam_demo_data 
		 * <pre>
		 * //模块名称
		 * data = [
		 *	{
		 *		isdir : 1,
		 *      path : "/home/work/noah/web"
		 *  },
		 *	{
		 *		isdir : 0,
		 *      path : "/home/work/noah/web/config.db"
		 *  },
		 *  ... ...
		 * ]
		 * </pre>
		 * @ajaxRequestParam {Int} deploy_module_id  (\d+) 上线模块id 
		 * @ajaxRequestParam {Int} ci_id  (\d+) 上线单id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.saveFileTree
		 * @namespace adWeb.url.saveFileTree
		 * @author han_qiang
		 */
		saveFileTree : function(data,callBack){
		
			var url = '/ad-web/SetSuAction/SaveChooseScmFile';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},

		/**
		 * @description 请求文件树
		 * @ajaxRequestUrl   /ad-web/SetSuAction/GetScmFileTree
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} deploy_module_id  (\d+) 上线模块id 
		 * @ajaxRequestParam {Int} ci_id  (\d+) ci的id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *  data    : {
		 *   name : 'V8',
		 *   isdir : 1,
		 *   child : [
		 *   	{
		 *       name : '.git',
		 *       isdir : 1,
		 *       child : []
		 *       }
		 *   ]
		 *  }
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.getFileTree
		 * @namespace adWeb.url.getFileTree
		 * @author han_qiang
		 */
		getFileTree : function(data,callBack){
		
			var url = '/ad-web/SetSuAction/GetScmFileTree';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},

		/**
		 * @description 更换配置文件方式
		 * @ajaxRequestUrl   /ad-web/ChooseSu/UpdateConfigType
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (\d+) 流程id 
		 * @ajaxRequestParam {String} configType  ('aos'|'bcc') 方式
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : '',
		 *  data    : {
		 *  }
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.UpdateConfigType
		 * @namespace adWeb.url.UpdateConfigType
		 * @author han_qiang
		 */
		UpdateConfigType : function(data,callBack){
		
			var url = '/ad-web/ChooseSu/UpdateConfigType';
			
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},

		/**
		 * @description 更换配置文件方式
		 * @ajaxRequestUrl   /ad-web/SetSuAction/UpdateConfigType
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (\d+) 流程id
		 * @ajaxRequestParam {Int} deploy_su_id  (\d+) 服务单元id
		 * @ajaxRequestParam {Json} data  (*) 表单信息
		 * @ajaxRequestParam_demo_data
		 * <pre>
		 * //表单信息
		 * data = 	{
		 *      //操作单id
		 *      "id":"5813",
		 *      //操作单名称
		 *      "name":"伏晔操作op/oped/noah/aos-business,op/psop/aos/monitor-cc",
		 *      //服务单元的信息
		 *      "suListInfo":[
		 *          {
		 *            //服务单元id
		 *            "id":"3673",
		 *            //机器并发度
		 *            "concurrency":"1",
		 *            //运行帐户
		 *            "account":"work",
		 *            //下载限速
		 *            "download_rate":"3",
		 *            //单机执行时间预估
		 *            "machine_timeout":"600",
		 *            //机器上线时间间隔
		 *            "machine_interval":"0",
		 *            //操作中屏蔽报警
		 *            "block_alarm":"TRUE",
		 *            //服务单元对应的模块信息
		 *            "moduleListInfo":[
		 *                 {
		 *                   //模块id
		 *                   "id":"3673",
		 *                   //服务检查
		 *                   "moni_timeout":"10"
		 *                 },
		 *                 ... ...
		 *            ]
		 *          }
         * }
		 * </pre>
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.CopySuSetting
		 * @namespace adWeb.url.CopySuSetting
		 * @author han_qiang
		 */
		CopySuSetting : function(data,callBack){
		
			var url = '/ad-web/SetSuAction/CopySuSetting';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
        },
        /**
         * @description 更换配置文件方式
         * @ajaxRequestUrl   /ad-web/SetSuAction/UpdateConfigType
         * @ajaxRequestType  POST
         * @ajaxRequestParam {Int} id  (\d+) 流程id
         * @ajaxRequestParam {Int} deploy_su_id  (\d+) 服务单元id
         * @ajaxRequestParam {Json} data  (*) 表单信息
         * @ajaxRequestParam_demo_data
         * <pre>
         * //表单信息
         * data = 	{
             *      //操作单id
             *      "id":"5813",
             *      //操作单名称
             *      "name":"伏晔操作op/oped/noah/aos-business,op/psop/aos/monitor-cc",
             *      //服务单元的信息
             *      "suListInfo":[
                 *          {
                     *            //服务单元id
                     *            "id":"3673",
                     *            //机器并发度
                     *            "concurrency":"1",
                     *            //运行帐户
                     *            "account":"work",
                     *            //下载限速
                     *            "download_rate":"3",
                     *            //单机执行时间预估
                     *            "machine_timeout":"600",
                     *            //机器上线时间间隔
                     *            "machine_interval":"0",
                     *            //操作中屏蔽报警
                     *            "block_alarm":"TRUE",
                     *            //服务单元对应的模块信息
                     *            "moduleListInfo":[
                         *                 {
                             *                   //模块id
                             *                   "id":"3673",
                             *                   //服务检查
                             *                   "moni_timeout":"10"
                             *                 },
                         *                 ... ...
                         *            ]
                     *          }
                 * }
             * </pre>
             * @ajaxResponseType json
             * @ajaxResponseFormat
             * <pre>
             * {
                 *	success : true,
                 *	message : ''
                 * }
             * </pre>
             * @param {Object}     data
             * @param {Function}   callBack
             * @return 
             * @property adWeb.url.CopySuConfirm
             * @namespace adWeb.url.CopySuConfirm
             * @author han_qiang
             */

        CopySuConfirm:function(data,callBack){
            var url = '/ad-web/SetSuAction/CopySuConfirm';
            //adWeb.mask.show();
            adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
        },

        /**
         * @description 更换配置文件方式
         * @ajaxRequestUrl   /ad-web/ViewDeployContent/UploadConfig
         * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (\d+) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.UploadConfig
		 * @namespace adWeb.url.UploadConfig
		 * @author han_qiang
		 */
		UploadConfig : function(data,callBack){
		
			var url = '/ad-web/ViewDeployContent/UploadConfig';
			
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},

		/**
		 * @description 提交审核
		 * @ajaxRequestUrl   /ad-web/ViewDeployContent/SubmitAudit
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (\d+) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.SubmitAudit
		 * @namespace adWeb.url.SubmitAudit
		 * @author han_qiang
		 */
		SubmitAudit : function(data,callBack){
		
			var url = '/ad-web/ViewDeployContent/SubmitAudit';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
		 * @description 2-完成并提交审核
		 * @ajaxRequestUrl   /ad-web/SetSuAction/FinishToAudit
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (\d+) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.SetSuActionFinishToAudit
		 * @namespace adWeb.url.SetSuActionFinishToAudit
		 * @author han_qiang
		 */
		SetSuActionFinishToAudit : function(data,callBack){
		
			var url = '/ad-web/SetSuAction/FinishToAudit';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
		 * @description 3-通过并全部应用
		 * @ajaxRequestUrl   /ad-web/ViewDeployContent/AuditToApply
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (\d+) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewDeployContentAuditToApply
		 * @namespace adWeb.url.ViewDeployContentAuditToApply
		 * @author han_qiang
		 */
		ViewDeployContentAuditToApply : function(data,callBack){
			var url = '/ad-web/ViewDeployContent/AuditToApply';
			adWeb.url._DoApplyCheckStatus.call(this,url,data,callBack);
		},

		/**
		 * @description 审批
		 * @ajaxRequestUrl   /ad-web/ViewDeployContent/AuditDeployList
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (\d+) 流程id 
		 * @ajaxRequestParam {Int} isPassed  (0|1) 是否通过 
		 * @ajaxRequestParam {String} msg  (.) 审批意见
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.AuditDeployList
		 * @namespace adWeb.url.AuditDeployList
		 * @author han_qiang
		 */
		AuditDeployList : function(data,callBack){
		
			var url = '/ad-web/ViewDeployContent/AuditDeployList';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},

		/**
		 * @description 全部应用
		 * @ajaxRequestUrl   /ad-web/ViewDeployContent/ApplyDeployList
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (\d+) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ApplyDeployList
		 * @namespace adWeb.url.ApplyDeployList
		 * @author han_qiang
		 */
		ApplyDeployList : function(data,callBack){
		
			var url = '/ad-web/ViewDeployContent/ApplyDeployList';
			adWeb.url._DoApplyCheckStatus.call(this,url,data,callBack);
		},

		/**
		 * @description 全部应用-为操作单添加icafe操作流
		 * @ajaxRequestUrl   /ad-web/ViewDeployContent/GetOPCurrentActivitysByUsername
		 * @ajaxRequestType  POST
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.GetOPCurrentActivitysByUsername
		 * @namespace adWeb.url.GetOPCurrentActivitysByUsername
		 * @author jiang_liuqing
		 */

        ChooseOnlineProcess : function(data,callBack){

            var url = '/ad-web/ViewDeployContent/GetOPCurrentActivitysByUsername';
			adWeb.mask.show();
            adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);

        },

      
		/**
		 * @description 获取总的机器列表
		 * @ajaxRequestUrl   /ad-web/ViewDeployContent/GetGlobalMachineList
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (\d+) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.GetGlobalMachineList
		 * @namespace adWeb.url.GetGlobalMachineList
		 * @author han_qiang
		 */
		GetGlobalMachineList : function(data,callBack){
		
			var url = '/ad-web/ViewDeployContent/GetGlobalMachineList';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},

		/**
		 * @description 获取总的机器列表
		 * @ajaxRequestUrl   /ad-web/SetSuAction/ChangeScmFileOrder
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} deploy_module_id  (\d+) 模块id
		 * @ajaxRequestParam {Json} data  (\d+) 模块顺序
		 * @ajaxRequestParam_demo_data
		 * <pre>
		 * //模块顺序
		 * data = 	["a","b","c"]
		 * </pre>
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ChangeScmFileOrder
		 * @namespace adWeb.url.ChangeScmFileOrder
		 * @author han_qiang
		 */
		ChangeScmFileOrder : function(data,callBack){
		
			var url = '/ad-web/SetSuAction/ChangeScmFileOrder';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},

		/**
		 * @description 从scm更新四位版本到noah反向接口
		 * @ajaxRequestUrl   /ad-web/SetSuAction/UpdateCi
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {String} moduleName  (.) 模块名称
		 * @ajaxRequestParam {String} version  (.) 模块版本
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.UpdateCi
		 * @namespace adWeb.url.UpdateCi
		 * @author han_qiang
		 */
		UpdateCi : function(data,callBack){
		
			var url = '/ad-web/SetSuAction/UpdateCi';
			
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
		 * @description 批量移除暂停点
		 * @ajaxRequestUrl   /ad-web/SetSuAction/RemoveDeployListPausePoint
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {String} moduleName  (.) 模块名称
		 * @ajaxRequestParam {String} version  (.) 模块版本
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.UpdateCi
		 * @namespace adWeb.url.UpdateCi
		 * @author han_qiang
		 */
		RemoveDeployListPausePoint : function(data,callBack){
		
			var url = '/ad-web/SetSuAction/RemoveDeployListPausePoint';
			
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
		 * @description ViewDeployContent删除
		 * @ajaxRequestUrl   /ad-web/ViewDeployContent/DeleteList
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (.) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewDeployContentDeleteList
		 * @namespace adWeb.url.ViewDeployContentDeleteList
		 * @author han_qiang
		 */
		ViewDeployContentDeleteList : function(data,callBack){
		
			var url = '/ad-web/ViewDeployContent/DeleteList';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
		 * @description ViewDeployContent保存为模板
		 * @ajaxRequestUrl   /ad-web/ViewDeployContent/SaveDListToTplList
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (.) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewDeployContentSaveDListToTplList
		 * @namespace adWeb.url.ViewDeployContentSaveDListToTplList
		 * @author han_qiang
		 */
		ViewDeployContentSaveDListToTplList : function(data,callBack){
		
			var url = '/ad-web/ViewLaunchList/SaveDListToTplList';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
		 * @description ViewDeployContent添加搜藏
		 * @ajaxRequestUrl   /ad-web/ViewLaunchList/SaveDListToTplList
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (.) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewDeployContentAddFavorPriv
		 * @namespace adWeb.url.ViewDeployContentAddFavorPriv
		 * @author han_qiang
		 */
		ViewDeployContentAddFavorPriv : function(data,callBack){
		
			var url = '/ad-web/ViewLaunchList/AddFavor';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
		 * @description ViewDeployContent取消搜藏
		 * @ajaxRequestUrl   /ad-web/ViewLaunchList/DeleteFavor
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (.) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewDeployContentDeleteFavorPriv
		 * @namespace adWeb.url.ViewDeployContentDeleteFavorPriv
		 * @author han_qiang
		 */
		ViewDeployContentDeleteFavorPriv : function(data,callBack){
		
			var url = '/ad-web/ViewLaunchList/DeleteFavor';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
		 * @description ViewDeployContent创建为操作单
		 * @ajaxRequestUrl   /ad-web/ViewLaunchList/CreateDListByTplListId
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (.) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewDeployContentCreateFromTempPriv
		 * @namespace adWeb.url.ViewDeployContentCreateFromTempPriv
		 * @author han_qiang
		 */
		ViewDeployContentCreateFromTempPriv : function(data,callBack){
		
			var url = '/ad-web/ViewLaunchList/CreateDListByTplListId';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
		 * @description ViewDeployContent编辑历史
		 * @ajaxRequestUrl   /ad-web/ViewLaunchList/SaveDListToTplList
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (.) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewDeployContentCreateFromTempPriv
		 * @namespace adWeb.url.ViewDeployContentCreateFromTempPriv
		 * @author han_qiang
		 */
		ViewLaunchListViewTplEditHistory : function(data,callBack){
		
			var url = '/ad-web/ViewLaunchList/ViewTplEditHistory';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
		 * @description ViewLaunchList编辑注释
		 * @ajaxRequestUrl   /ad-web/ViewLaunchList/SetDListComment
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (.) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewLaunchListSetDListComment
		 * @namespace adWeb.url.ViewLaunchListSetDListComment
		 * @author han_qiang
		 */
		ViewLaunchListSetDListComment : function(data,callBack){
		
			var url = '/ad-web/ViewLaunchList/SetDListComment';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
		 * @description ViewLaunchList复制操作单
		 * @ajaxRequestUrl   /ad-web/ViewLaunchList/CopyDListByDListId
		 * @ajaxRequestType  POST
		 * @ajaxRequestParam {Int} id  (.) 流程id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewLaunchListCopyDListByDListId
		 * @namespace adWeb.url.ViewLaunchListCopyDListByDListId
		 * @author han_qiang
		 */
		ViewLaunchListCopyDListByDListId : function(data,callBack){
		
			var url = '/ad-web/ViewLaunchList/CopyDListByDListId';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},

        /**
         * @description ViewDeployListGroup选择增加操作单列表项
         * @ajaxRequestUrl   /ad-web/ViewDeployListGroup/SelectDeployList
         * @ajaxRequestType  POST
         * @ajaxRequestParam {Int} isTemplate  (.)是否为组模板 
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewDeployListGroupSelectDeployList
		 * @namespace adWeb.url.ViewDeployListGroupSelectDeployList
		 * @author jiang_liuqing
		 */
		ViewDeployListGroupSelectDeployList : function(data,callBack){
		
			var url = ' /ad-web/ViewDeployListGroup/SelectDeployList?curPage=1&pageSize=20&displayAll=1&template=0';
			
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},

        /**
         * @description ViewDeployListGroup保存
         * @ajaxRequestUrl   /ad-web/ViewDeployListGroup/saveGroup
         * @ajaxRequestType  POST
         * @ajaxRequestParam {string} name  (.)操作单名字
         * @ajaxRequestParam {string} group_id  (.)操作单组id
         * @ajaxRequestParam {string} template_id  (.)模板id
         * @ajaxRequestParam {json} stageList  (.)移动过的状态列表 
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewDeployListGroupSaveGroup
		 * @namespace adWeb.url.ViewDeployListGroupSaveGroup
		 * @author jiang_liuqing
		 */
		ViewDeployListGroupSaveGroup : function(data,callBack){
		
			var url = ' /ad-web/ViewDeployListGroup/saveGroup';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},  
        /**
         * @description ViewDeployContent单独应用
         * @ajaxRequestUrl   /ad-web/ViewDeployContent/ApplySingle
         * @ajaxRequestType  POST
         * @ajaxRequestParam {Int} id  (\d+)操作单名字
         * @ajaxRequestParam {Int} deploy_su_id  (\d+)上线服务单元id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewDeployContentApplySingle
		 * @namespace adWeb.url.ViewDeployContentApplySingle
		 * @author jiang_liuqing
		 */
      
        QAddListItem:function(data,callBack){

            var url = '/ad-web/ViewDeployListGroup/AddDeployListById';
			adWeb.mask.show();
            adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
        },
        /**
         * @description ViewDeployContent 导入操作单列表
         * @ajaxRequestUrl   /ad-web/ViewDeployContent/ApplySingle
         * @ajaxRequestType  POST
         * @ajaxRequestParam {Int} id  (\d+)操作单名字
         * @ajaxRequestParam {Int} deploy_su_id  (\d+)上线服务单元id
         * @ajaxResponseType json
         * @ajaxResponseFormat
         * <pre>
         * {
             *	success : true,
             *	message : ''
             * }
         * </pre>
         * @param {Object}     data
         * @param {Function}   callBack
         * @return 
         * @property adWeb.url.ViewDeployContentApplySingle
         * @namespace adWeb.url.ViewDeployContentApplySingle
         * @author jiang_liuqing
         */



        ImportDeployByText:function(data,callBack){

            var url = '/ad-web/ViewDeployListGroup/AddDeployListByText';
			adWeb.mask.show();
            adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);

        },

		/**
         * @description ViewDeployContent单独应用
         * @ajaxRequestUrl   /ad-web/ViewDeployContent/ApplySingle
         * @ajaxRequestType  POST
         * @ajaxRequestParam {Int} id  (\d+)操作单名字
         * @ajaxRequestParam {Int} deploy_su_id  (\d+)上线服务单元id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewDeployContentApplySingle
		 * @namespace adWeb.url.ViewDeployContentApplySingle
		 * @author jiang_liuqing
		 */
		ViewDeployContentApplySingle : function(data,callBack){
			var url = '/ad-web/ViewDeployContent/ApplySingle';
			adWeb.url._DoApplyCheckStatus.call(this,url,data,callBack);
        },

        /**
         * @description ViewDeployListGroup单独应用
         * @ajaxrequesturl  /ad-web/viewdeploylistgroup/generategroup          
		 * @ajaxRequestType  POST
         * @ajaxRequestParam {Int} group_template_id 组模板id 
         * @ajaxResponseType json
         * @ajaxResponseFormat
         * <pre>
         * {
             *	success : true,
             *	message : ''
             * }
         * </pre>
         * @param {Object}     data
         * @param {Function}   callBack
         * @return 
         * @property adWeb.url.createDeployTemplate
         * @namespace adWeb.url.createDeployTemplate
         * @author jiang_liuqing
         */

        CreateDeployTemplate : function(data,callBack){
            var url = ' /ad-web/ViewDeployListGroup/GenerateGroup';
			adWeb.mask.show();
            adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);

        },

        /**
         * @description deleteDeploy单独应用
         * @ajaxrequesturl  /ad-web/ViewDeployListGroup/DelGroup  
		 * @ajaxRequestType  POST
         * @ajaxRequestParam {Int} group_id 组id 
         * @ajaxResponseType json
         * @ajaxResponseFormat
         * <pre>
         * {
             *	success : true,
             *	message : ''
             * }
         * </pre>
         * @param {Object}     data
         * @param {Function}   callBack
         * @return 
         * @property adWeb.url.DeleteDeploy
         * @namespace adWeb.url.DeleteDeploy
         * @author jiang_liuqing
         */

        DeleteDeploy : function(data,callBack){
            var url = '/ad-web/ViewDeployListGroup/DelGroup';
			adWeb.mask.show();
            adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
        },

        ApplyDeployGroup : function(data,callBack){
            var url = '/ad-web/ViewDeployListGroup/ApplyGroup';
			adWeb.mask.show();
            adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);

        },
		
		ApplyDeployContinueGroup : function(data,callBack){
            var url = '/ad-web/ViewDeployListGroup/ContinueApply';
			adWeb.mask.show();
            adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);

        },

        /**
         * @description 检查配置文件操作是否可行
         * @ajaxRequestUrl   /ad-web/SetSuAction/CheckEditConfig
         * @ajaxRequestType  POST
         * @ajaxRequestParam {Int} id  (\d+)操作单名字
         * @ajaxRequestParam {Int} moduleListInfo  (\d+)上线模块id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.SetSuActionCheckEditConfigEnable
		 * @namespace adWeb.url.SetSuActionCheckEditConfigEnable
		 * @author jiang_liuqing
		 */
		SetSuActionCheckEditConfigEnable : function(data,callBack){
		
			var url = ' /ad-web/SetSuAction/CheckEditConfig';
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
         * @description 起停操作的change
         * @ajaxRequestUrl   /ad-web/SetSuAction/SetDmodServiceOperate
         * @ajaxRequestType  POST
         * @ajaxRequestParam {Int}    deploy_module_id  (\d+)操作单名字
         * @ajaxRequestParam {String} pre_action  (\d+)上线模块id 
		 * @ajaxRequestParam {String} post_action  (\d+)上线模块id
		 * @ajaxRequestParam {String} rb_pre_action  (\d+)上线模块id 
		 * @ajaxRequestParam {String} rb_post_action  (\d+)上线模块id
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.SetDmodServiceOperate
		 * @namespace adWeb.url.SetDmodServiceOperate
		 * @author han_qiang
		 */
		SetDmodServiceOperate : function(data,callBack){
		
			var url = ' /ad-web/SetSuAction/SetDmodServiceOperate';
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
         * @description 获取icafe模块的状态
         * @ajaxRequestUrl   /ad-web/ChooseSu/CheckModuleReleased
         * @ajaxRequestType  POST
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.CheckModuleReleased
		 * @namespace adWeb.url.CheckModuleReleased
		 * @author han_qiang
		 */
		CheckModuleReleased : function(data,callBack){
		
			var url = ' /ad-web/ChooseSu/CheckModuleReleased';
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
         * @description 操作单模板转换为操作单
         * @ajaxRequestUrl   /ad-web/ViewDeployContent/CopyTemplate
         * @ajaxRequestType  POST
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.CopyTemplate
		 * @namespace adWeb.url.CopyTemplate
		 * @author han_qiang
		 */
		CopyTemplate : function(data,callBack){
		
			var url = '/ad-web/ViewDeployContent/CopyTemplate';
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
         * @description 应用检查
         * @ajaxRequestUrl   /ad-web/ViewDeployContent/ApplyCheckStatus
         * @ajaxRequestType  POST
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ApplyCheckStatus
		 * @namespace adWeb.url.ApplyCheckStatus
		 * @author han_qiang
		 */
		ApplyCheckStatus : function(data,callBack){
		
			var url = '/ad-web/ViewDeployContent/ApplyCheckStatus';
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
         * @description 跨服务单元复制-获取列表
         * @ajaxRequestUrl   /ad-web/ViewLaunchList/GetTargetSuByDSu
         * @ajaxRequestType  POST
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.GetTargetSuByDSu
		 * @namespace adWeb.url.GetTargetSuByDSu
		 * @author han_qiang
		 */
		GetTargetSuByDSu : function(data,callBack){
		
			var url = '/ad-web/ViewLaunchList/GetTargetSuByDSu';
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
         * @description 跨服务单元复制-获取模块
         * @ajaxRequestUrl   /ad-web/ViewLaunchList/SetTargetSuModuleTopDir
         * @ajaxRequestType  POST
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.SetTargetSuModuleTopDir
		 * @namespace adWeb.url.SetTargetSuModuleTopDir
		 * @author han_qiang
		 */
		SetTargetSuModuleTopDir : function(data,callBack){
		
			var url = '/ad-web/ViewLaunchList/SetTargetSuModuleTopDir';
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
         * @description 跨服务单元复制-提交
         * @ajaxRequestUrl   /ad-web/ViewLaunchList/CopyDListToSu
         * @ajaxRequestType  POST
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.CopyDListToSu
		 * @namespace adWeb.url.CopyDListToSu
		 * @author han_qiang
		 */
		CopyDListToSu : function(data,callBack){
		
			var url = '/ad-web/ViewLaunchList/CopyDListToSu';
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
         * @description 撤销提交审核
         * @ajaxRequestUrl   /ad-web/ViewDeployContent/CancelSubmitAudit
         * @ajaxRequestType  POST
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.ViewDeployContentCancelSubmitAudit
		 * @namespace adWeb.url.ViewDeployContentCancelSubmitAudit
		 * @author han_qiang
		 */
		ViewDeployContentCancelSubmitAudit : function(data,callBack){
		
			var url = '/ad-web/ViewDeployContent/CancelSubmitAudit';
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
         * @description 导入机器
         * @ajaxRequestUrl   /ad-web/SetSuAction/CheckMachineList
         * @ajaxRequestType  POST
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.CheckMachineList
		 * @namespace adWeb.url.CheckMachineList
		 * @author han_qiang
		 */
		CheckMachineList : function(data,callBack){
		
			var url = '/ad-web/SetSuAction/CheckMachineList';
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
         * @description 获取操作列表
         * @ajaxRequestUrl   /ad-web/ViewLaunchList/GetPrivilegeByDListIds
         * @ajaxRequestType  POST
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.GetPrivilegeByDListIds
		 * @namespace adWeb.url.GetPrivilegeByDListIds
		 * @author han_qiang
		 */
		GetPrivilegeByDListIds : function(data,callBack){
		
			var url = '/ad-web/ViewLaunchList/GetPrivilegeByDListIds';
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		/**
         * @description 反向替换
         * @ajaxRequestUrl   /ad-web/SetSuAction/RemoveHostsFromDListByDListId
         * @ajaxRequestType  POST
		 * @ajaxResponseType json
		 * @ajaxResponseFormat
		 * <pre>
		 * {
		 *	success : true,
		 *	message : ''
		 * }
		 * </pre>
		 * @param {Object}     data
		 * @param {Function}   callBack
		 * @return 
		 * @property adWeb.url.RemoveHostsFromDListByDListId
		 * @namespace adWeb.url.RemoveHostsFromDListByDListId
		 * @author han_qiang
		 */
		RemoveHostsFromDListByDListId : function(data,callBack){
		
			var url = '/ad-web/SetSuAction/RemoveHostsFromDListByDListId';
			adWeb.ajaxSimple(url,data,callBack,adWeb.ajaxOnError);
		},
		
		
		_DoApplyCheckStatus : function(url,data,callBack){
			var self = this,
				_dialog,
				_handle,
				_loopTime = 1000 * 2;
				
			adWeb.ajaxSimple(url,data,function(json){
				if(_handle){
					window.clearInterval(_handle);
				}
				callBack.call(self,json);
			},function(){
				if(_handle){
					window.clearInterval(_handle);
				}
				if(_dialog){
					try{
						_dialog.close();
					}catch(e){}
				}
				adWeb.ajaxOnError.call(self);
			});
			
			//
			_handle = window.setInterval(function(){
				adWeb.url.ApplyCheckStatus({
					id : data.id
				},function(json){
					var _html = "";
					var allComplete = true;
					if(_dialog){
						try{
							//_dialog.close();
						}catch(e){}
						
					}
					if(0 == json.success){
						_html = json.message;
						//_dialog = adWeb.alert(_html);
						if(_handle){
							window.clearInterval(_handle);
						}
						adWeb.mask.show();
						return false;
					}
					_html = "<table class='listing' style='width:100%;'>";
					_html += "<thead>";
					_html += "<tr><td>检查项</td><td>状态</td></tr>";
					_html += "</thead>";
					_html += "<tbody>";
					T.array.each(json.data,function(item,key){
						var img = '';
						switch(item['status']){
							case 0:
								img = '/ad-web/static/img/loading.gif';
								break;
							case 1:
								img = '/ad-web/static/img/accept.png';
								break;
							default:
								img = '';
								break;
						}
						
						allComplete = allComplete && (item['status']=='1');
						
						_html += "<tr><td>"+item['key']+"</td><td><img src='"+img+"' /></td></tr>";
					});
					_html += "</tbody>";
					_html += "</table>";
					
					if(allComplete){
						_html += "<div style='color:#ff3200;line-height:32px;'>应用检查完毕，正准备跳转...</div>";
					}
					if(_dialog){
						try{
							//_dialog.close();
							_dialog.update({
								contentText : "<div style='padding:10px 5px;'>"+_html+"</div>"
							});
						}catch(e){}
						
					}else{
						_dialog = adWeb.alert({
							text    : _html,
							success : true,
							title   : '应用准备中...',
							width   : 490
						});
					}
					
					
				},function(){
					//如果异常，就停掉
					if(_handle){
						window.clearInterval(_handle);
					}
				});
			
			},_loopTime);
		
		}
		
		/// //////////////////////////////////////////////////////////////////
		,SetSuActionAsyn_DListList : function(data,callBack,error){
			var url = '/ad-web/SetSuActionAsyn/DListList';
			adWeb.ajaxSimple(url,data,callBack,function(){
				adWeb.alert("返回数据异常\n/ad-web/SetSuActionAsyn/DListList");
			});
		}		
		,ViewDeployContentAsyn_DListList : function(data,callBack,error){
			var url = '/ad-web/ViewDeployContentAsyn/DListList';
			adWeb.ajaxSimple(url,data,callBack,function(){
				adWeb.alert("返回数据异常\n/ad-web/ViewDeployContentAsyn/DListList");
			});
		}
		,SetSuActionAsyn_DSuList : function(data,callBack,error){
			var url = '/ad-web/SetSuActionAsyn/DSuList';
			adWeb.ajaxSimple(url,data,callBack,error || adWeb.ajaxOnError);
		}
		,SetSuActionAsyn_DModuleList : function(data,callBack,error){
			var url = '/ad-web/SetSuActionAsyn/DModuleList';
			adWeb.ajaxSimple(url,data,callBack,error || adWeb.ajaxOnError);
		}
		,SetSuActionAsyn_SubmitForFinish : function(data,callBack,error){
			var url = '/ad-web/SetSuActionAsyn/SubmitForFinish';
			adWeb.ajaxSimple(url,data,callBack,error || adWeb.ajaxOnError);
		}		
		,SetSuActionAsyn_FinishToAudit : function(data,callBack,error){
			var url = '/ad-web/SetSuActionAsyn/FinishToAudit';
			adWeb.ajaxSimple(url,data,callBack,error || adWeb.ajaxOnError);
		}
		,SetSuActionAsyn_CopySuSetting : function(data,callBack,error){
			var url = '/ad-web/SetSuActionAsyn/CopySuSetting';
			adWeb.mask.show();
			adWeb.ajaxSimple(url,data,callBack,error || adWeb.ajaxOnError);
		}
		,SetSuActionAsyn_SaveDSuModule : function(data,callBack,error){
			var url = '/ad-web/SetSuActionAsyn/SaveDSuModule';
			adWeb.ajax({
				url     : url,
				data    : data,
				success : callBack,
				error   : error || adWeb.ajaxOnError,
				async   : false
			});
		}
    }
});

adWeb._extend({
	/**
	 * @description 获取url
	 * @return 
	 * @property adWeb.getRequestParam
	 * @namespace adWeb.getRequestParam
	 * @author han_qiang
	 */
	getRequestParam : function(key){
		
		var _pro,item,param;
		
		
		_pro = arguments.callee;
		
		if(!_.isUndefined(_pro.param)){
			return _pro.param[key];
		}
		
		item = window.location.href.replace(/.*?\?/g,'').replace(/#.+/g,'').split('&');
		
		param = {};
		
		T.array.each(item,function(value,key){
			var _param = value.split('=');
			
			param[_param[0]] = _.isUndefined(_param[1]) ? '' : _param[1];
		});
		
		_pro.param = param;
		
		return _pro.param[key];
	},
	
	/**
	 * @description 获取当前节点的id
	 * @return 
	 * @property adWeb.getNodeId
	 * @namespace adWeb.getNodeId
	 * @author han_qiang
	 */
	getNodeId : function(){
		var nodeId = adWeb.getRequestParam('nodeId') || adWeb.getRequestParam('nid');
		
		return nodeId;
	},
	/**
	 * @description ajax请求发起时的状态条
	 * @param {Element}   el
	 * @return 
	 * @property adWeb.startLoadState
	 * @namespace adWeb.startLoadState
	 * @author han_qiang
	 */
	startLoadState : function(el){
		var _html = '<div style="text-align:center;padding:50px;"><img src="/adWeb/virgo_tpl/static/img/loader.gif" /></div>';
		$(el).html(_html);
	},
	
	arrayUnique  : function(arr){
		
		return T.array.unique(arr)
	},
	
	replaceLocation : function(options,param){
		var url = window.location.href;
		
		if(url.indexOf('?') == -1){
			url += '?';
		}
		T.array.each(options,function(v,k){
			url = url.replace(v,'');
		});
		
		url += param;
		url = url.replace(/\&{2}/g,'&');
		url = url.replace(/\?\&/g,'?');
		window.location.href = url;
		return false;
	},
	
	log : function(){
		if(!T.browser.firefox){
			return;
		}
		if(window['console'] && window['console']['log']){
			console.log.apply(this,arguments);
		}
	},
	
	dir : function(){
		if(!T.browser.firefox){
			return;
		}
		if(window['console'] && window['console']['dir']){
			console.dir.apply(this,arguments);
		}
	},
	
	setHash : function(param){
		var str = [];
		T.object.each(param,function(v,k){
			str.push(v);
		});
		
		window.location.hash = str.join('|');
		return false;
		
	},
	
	getHash : function(){
		var hash = window.location.hash;
		return hash.replace('#','').split('|');
	},
	
	
	/**
	 * 判断给定的字段属性是否在另外一个对象里
	 *
	 */
	isContain : function(d,s){
		var ret = true;
		//如果类型都不同

		if(typeof d !== typeof s){
			return false;
		}
		
		//仅比较对象、数组
		if(
			(typeof d === 'string') ||
			(typeof d === 'number') ||
			(typeof d === 'boolean')
		){
			return d === s;
		}
		
		if(
			(typeof d === 'undefined') ||
			(typeof d === 'null')
		){
			return true;
		}
		
		T.object.each(d,function(v,k){
			var m = adWeb.isContain(d[k],s[k]);

			if(!m){
				ret = false;
				return false;
			}
		});
		
		return ret;
		
	}
	
	,isEqual : function(d1,d2){
		var ret = true;
		if(typeof d1 != typeof d2){
            return false;
        }
		T.object.each(d1,function(v,k){
			if(typeof d2[k] == 'object'){
				if(!adWeb.isEqual(v,d2[k])){
					ret = false;
					return false;
				}
			}else{
				if(v !== d2[k]){
					ret = false;
					return false;
				}
			}
			
		});
		
		return ret;
	}
	
	
	,clone : function(Obj){
		 var buf;   
        if (Obj instanceof Array) {   
            buf = [];  //创建一个空的数组 
            var i = Obj.length;   
            while (i--) {   
                buf[i] = adWeb.clone(Obj[i]);   
            }   
            return buf;
        }else if (Obj instanceof Object){   
            buf = {};  //创建一个空对象 
            for (var k in Obj) {  //为这个对象添加新的属性 
                buf[k] = adWeb.clone(Obj[k]);   
            }   
            return buf;   
        }else{   
            return Obj;   
        }   
	}
});
