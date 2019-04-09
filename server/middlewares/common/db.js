const Sequelize = require("sequelize");
async function models_defined(swc){
	swc.db.models.pays = swc.db.seq.define("pays", {
		out_trade_no : {type : Sequelize.STRING(32)},
		openid : {type : Sequelize.TEXT()}, //唯一ID

		time_end : {type : Sequelize.TEXT()}, //支付成功时间

		email : {type : Sequelize.TEXT()}, //留下的邮箱
		name : {type : Sequelize.TEXT()}, //留下的姓名
		message : {type : Sequelize.TEXT()}, //留言

		total_fee : {type : Sequelize.TEXT()}, //支付的金额

		payed : {type : Sequelize.INTEGER()}, //是否已经完成支付

		create_at : {type : Sequelize.STRING()},
	})
	

	//数据索引
	// swc.db.models.childs.belongsTo(swc.db.models.parents, {
	// 	foreignKey : "parent_id_in_child",
	// 	targetKey : "parent_id",
	// 	as : "parent"
	// })

	return swc;
}

module.exports = async (swc)=>{
	var seq = new Sequelize(swc.config.mysql.database, swc.config.mysql.user, swc.config.mysql.password, {
		host : swc.config.mysql.host,
		dialect : "mysql",
		port : swc.config.mysql.port || 3306,
		operatorsAliases: false,
		pool : {
			max : 5,
			min : 0,
			acquire : 30000,
			idle : 10000,
		},
		define: {
	    	timestamps: false
	 	},
	 	logging : false
	})
	//检查连接情况
	try{
		var res = await seq.authenticate();
	}catch(e){
		throw "Unable to connect database :" + e.message
	}

	swc.db = {
		seq : seq,
		models : {}
	}
	//定义orm模型
	swc = await models_defined(swc);
	return swc;
}