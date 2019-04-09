module.exports = async function(req, res, next){
	req.response = {
		query : req.query
	}
	next();
}