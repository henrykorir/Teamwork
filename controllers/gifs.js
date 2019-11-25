const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
	cloud_name: 'henrykorir',
	api_key: '513554986993748',
	api_secret: 'DnrvCSRuAvHvfxhbPMkJYb75VGw'
});

exports.postGif = (req, res, next) =>{
	console.clear();
	let path = req.files[0].path;
	cloudinary.uploader.upload(path,{folder: "test"}).then(
	(result) =>{
		console.log(result);
		res.status(200).json({
			status: "success",
			data:{
				gifId: result.public_id, //get it from the database
				message: "GIF image successfully posted",
				createdOn: result.created_at,
				imageUrl: [
					{
						http: result.url, 
						https: result.secure_url
					}
				],
				cloudinary: result
			}
		});
	})
	.catch(
		(error) => {
			console.log(error);
			res.status(401).json({
				status: "error",
				error: error
			});
		}
	);
}
exports.getGifById = (req, res) =>{
	let id = req.params.gifId; //id looked in the database
}
exports.deleteGifById = (req, res) =>{
	let id = req.params.gifId; //id looked in the database
	
}
exports.postCommentByGifId = (req, res) =>{
	let id = req.params.gifId; //id looked in the database
	
}