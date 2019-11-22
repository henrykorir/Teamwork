exports.getFeed = (req, res) =>{
	console.clear();
	console.log("getGif");
	res.status(201).json({
		message: "getGif called"
	});
}