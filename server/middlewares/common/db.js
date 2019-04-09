const Sequelize = require("sequelize");
async function models_defined(swc){
	swc.db.models.users = swc.db.seq.define("users", {
		openid : {type : Sequelize.STRING(32)},
		user_id : {type : Sequelize.STRING(32)}, //唯一ID
		nick_name : {type : Sequelize.STRING()}, //昵称
		avatar_url : {type : Sequelize.STRING()}, //头像

		mobile : {type : Sequelize.TEXT()},
		name : {type : Sequelize.TEXT()},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})
	swc.db.models.demos = swc.db.seq.define("demos", {
		demo_id : {type : Sequelize.STRING(32)},
		name : {type : Sequelize.TEXT()},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})
	swc.db.models.admins = swc.db.seq.define("admins", {
		admin_id : {type : Sequelize.STRING(32)},
		account : {type : Sequelize.STRING()},
		password : {type : Sequelize.STRING(32)},
		name : {type : Sequelize.STRING},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})

	//数据索引
	swc.db.models.demos.belongsTo(swc.db.models.admins, {
		foreignKey : 'create_by',
		targetKey : 'admin_id',
		as : 'admin'
	})
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