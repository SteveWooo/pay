keke.leaves.pay = {
	config : {
		name : "pay",
		pathName : "pay",
		idName : "pay_id",
	},
	datas : {
		pageNow : 1, //当前页面
		itemPerPage : 10, //每页加载的数量
		loading : false, //加载状态栏
		list : [], //数据列表
		count : 0, //总数
		//列表头名字
		itemHeader : [{
			text : "封面图",
			sortable : false
		},{
			text : "标题",
			sortable: false,
		},{
			text : "简述",
			sortable : false
		}, {
			text : "操作",
			sortable : false
		}]
	},
	panels : {
		pay : {
			form : {
				
			}
		}
	}
}