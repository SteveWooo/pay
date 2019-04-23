keke.leaves.hello = {
	data : "hello world",
	openid : "",
	waitting : false,

	datas : {
		pageNow : 1, //当前页面
		itemPerPage : 10, //每页加载的数量
		loading : false, //加载状态栏
		list : [], //数据列表
		count : 0, //总数
		//列表头名字
		itemHeader : [{
			text : "名字",
			sortable: false,
		},{
			text : "留言",
			sortable : false
		}, {
			text : "羞辱金额",
			sortable : false,
		}]
	},

	panels : {
		pay : {
			show : false,
			form : {
				total_fee : 500,

				name : '',
				email : '',
				message : ''
			}
		}
	}
}