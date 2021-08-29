const db = require("../models");
const sequelize = db.sequelize

module.exports.searchUser = async(req, res) => {
	try{
		let search_term = req.query.search_term 
		let search_query =  `select name,address,gender,country,contact from users `
		if(search_term != undefined)
		 search_query +=  ` where name like '%${search_term}%' or contact like '%${search_term}%'` 
		console.log(search_term)
		let result =await sequelize.query(search_query)
		res.status(200).send({
			success:1,
			message:'data found with serch criteria!',
			data:result[0]});
	}catch(e){
		console.log("Error:",e)
		res.status(401).send({
			success:0,
			message:'error occurred!',
			data:[]
		})
	}
	
};
