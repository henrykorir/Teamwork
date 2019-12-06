const index = (req, res, next) =>{
	res.status(200).json({
		status: 'success',
		message: 'Welcome to Fun Teamwork Social Media'
	});
}
export default index;