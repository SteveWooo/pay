const config = require("./conf/config.json");
async function main(){
	var swc = await require("./server/init").init(config);
	swc.startup(swc);
}

main();