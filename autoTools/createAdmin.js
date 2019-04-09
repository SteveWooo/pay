const crypto = require("crypto");
const ROOT = "root";

async function create_admins(swc, options){
	var now = +new Date();
	var source = [
		"admins",
		ROOT,
		now,
		swc.config.wechat.public_salt
	].join("&")
	console.log(source);
	var admin = {
		admin_id : crypto.createHash("md5").update(source).digest("hex"),
		account : options.account,
		password : crypto.createHash("md5").update([
			options.password,
			swc.config.wechat.public_salt].join("&")).digest("hex"),
		name : options.name,
		create_at : now,
		create_by : ROOT,
		update_at : now,
		update_by : ROOT
	}

	var result = await swc.db.models.admins.create(admin);
	return {
		admin : result
	}
}

async function main(){
	var swc = await require("../server/init").init();
	var result ;

	result = await create_admins(swc, {
		name : 'admin_root',
		type : '1',
		account : "admin",
		password : "123456"
	})

	console.log('finished');
}

main();