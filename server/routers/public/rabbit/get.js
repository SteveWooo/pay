const Canvas = require('canvas');
const Images = require('images');

function renderImage(swc, options){
	return new Promise(resolve=>{
		var canvas = Canvas.createCanvas(240, 240);
		var ctx = canvas.getContext('2d');

		Canvas.loadImage('./res/rabbit.jpg').then((image)=>{
			ctx.drawImage(image, 0, 0, 240, 240);
			ctx.font = '25px block';
			ctx.fillStyle = '#666';
			ctx.fillText('兔子穷到发不出声音', 10, 230);

			resolve(canvas);
		})
	})
}

module.exports = async (req, res, next)=>{
	var canvas = await renderImage(req.swc, {

	});

	var img = canvas.toDataURL();

	req.response_headers['Content-Type'] = 'image/png';
	req.response_headers['Content-Length'] = img.length;
	req.response = img;
	next();
}