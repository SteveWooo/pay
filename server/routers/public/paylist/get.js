/*
* @param page item_per_page 
*/
module.exports = async (req, res, next)=>{
	var query = req.query;
	var swc = req.swc;

	if(!query.item_per_page){
		query.item_per_page = 10;
	}

	if(!query.page){
		query.page = 1;
	}

	if(parseInt(query.page) != query.page || parseInt(query.item_per_page) != query.item_per_page){
		req.response.status = 4005;
		req.response.error_message = "参数错误：page or item_per_page";
		next();
		return ;
	}
	query.item_per_page = parseInt(query.item_per_page);
	var condition = {
		payed : 1
	};
	try{
		var result = await swc.db.models.pays.findAndCountAll({
			where : condition,
			order : [["create_at", "DESC"]],
			limit : query.item_per_page,
			offset : (query.page - 1) * query.item_per_page
		})

		for(var i=0;i<result.rows.length;i++){
			result.rows[i].openid = "";
			result.rows[i].email = "";
		}

		req.response.data = result;

		next();
	}catch(e){
		req.response.status = 5000;
		req.response.error_message = e.message;
		next();
		return ;
	}
}