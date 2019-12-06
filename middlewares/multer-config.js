import  multer from 'multer';

const MIME_TYPES ={
	'image/gif': 'gif'
};

const storage = multer.diskStorage({
	destination: (req, file, callback) =>{
		callback(null, 'images');
	},
	filename: (req, file, callback) =>{
		const name = file.originalname.split(' ').join('_');
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + '.' + extension);
	}
});

const configuration = multer({
	storage: storage
}).any();

export default configuration;
