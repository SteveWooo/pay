var vue = new Vue({
	el : '#app',
	data : {
		router_name : keke.config.router_name,
		router : "",
		global : {
			common : {
				//控制器们
				controllers : {
					actions : {
						/*
						* options : { message : 弹窗消息体 }
						*/
						alert : function(options){
							vue.global.common.controllers.leaves.alert.message = options == undefined ? 
								"default alert" : options.message;
							//清除上一次的计时器
							if(vue.global.common.controllers.leaves.alert.timeout_instance){
								clearTimeout(vue.global.common.controllers.leaves.alert.timeout_instance);
							}
							vue.global.common.controllers.leaves.alert.show = true;
							vue.global.common.controllers.leaves.alert.timeout_instance = setTimeout(function(){
								vue.global.common.controllers.leaves.alert.show = false;
								vue.global.common.controllers.leaves.alert.timeout_instance = undefined;
							}, 1200)
						},
						ajax : function(options){
							options.success = function(res){
								if(typeof res != "object"){
									res = JSON.parse(res);
								}
								if(res.status == "3002"){
									let hash = res.hash;
									location.hash = hash;
									return res;
								}
								options.successFunction && options.successFunction(res);
							}

							options.error = function(e){
								options.errorFunction && options.errorFunction(e);
							}

							$.ajax(options);
						}
					},

					//控制器的缓存全局变量
					leaves : {
						alert : {
							show : false,
							message : "test",
							timeout_instance : undefined
						}
					}
				},

				//管理员数据
				admin_user : undefined,
				initHandle : function(){
					//登陆页面不需要获取管理员信息
					if(location.hash == "login"){
						return ;
					}
				},

				tools : {
					timetranfers : function(date){
					    var date = new Date(date * 1);//如果date为13位不需要乘1000
					    var Y = date.getFullYear() + '-';
					    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
					    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
					    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
					    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
					    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
					    return Y+M+D+h+m+s;
					}
				}
			},
			pages : keke.leaves
		},
		index : {
			drawer: false,

			//主页侧栏导航：
			menu : keke.config.menu
		}
	},
	methods : {
		router_init : function(){
			var that = this;
			//监听路由
			this.router = location.hash.substring(1);
			window.onhashchange = function(){
				that.router = location.hash.substring(1);
			}
			history.pushState(null, null, document.URL);
			//禁用返回事件
			window.addEventListener('popstate', function () {
			    history.pushState(null, null, document.URL);
			});
			//禁用F5刷新按钮(mac无解)
			document.onkeydown = function(e){
				if(e.keyCode == 16){
					e.keyCode = 0;
					e.cancelBubble = true;
					return false;
				}
			}
		},
		init : function(){
			this.router_init();
			location.hash = 'hello';
		},
		drawerRouter : function(r){
			location.hash = r;
			this.index.drawer = !this.index.drawer;
		},

		toLoginPage : function(){
			location.hash = "login";
		}
	},
	mounted : function(){
		this.init();
	}
})