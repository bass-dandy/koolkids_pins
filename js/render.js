const fs = require('fs');
const path = require('path');
const pins = require('./sortedpins.json');

const emojiToExtension = {};
const images = fs.readdirSync(path.join(__dirname, '..', 'img'));

images.forEach((img) => {
	[name, ext] = img.split('.');
	emojiToExtension[name] = ext;
});

function getImage(react) {
	const emoji = react.replace(/:/g, '');
	return `<img src="img/${emoji}.${emojiToExtension[emoji]}" class="emoji"/>`;
}

const authorToImage = {
	'Ghost of Weston Novelli': 'img/weston.jpg',
	'Laura 🍺wirth': 'img/laura.jpg',
	'Paul 🚴 Khermouch': 'img/paul.jpg',
	'Ghost of Alyssa WESTON-NO-DAY-TODAY Williams': 'img/alyssa.png',
	'Christian 🍕inh': 'img/christian.jpg',
	'Josh Eversmann': 'img/josh.jpg',
	'Daniel ☯️': 'img/daniel.jpg',
	'Steve Rutherford': 'img/steve.jpg',
	'Robbie Gehring': 'img/robbie.jpg',
	'Manav Mandhani': 'img/manav.jpg',
	'Genghis Sean': 'img/sean.jpg',
	'Jason Pattinian': 'img/jason.jpg',
	'Tyler Sweet': 'img/tyler.jpg'
};

const template = `
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>#koolkids</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" href="img/favicon.png">
	<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,400&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="style.css">
</head>
<body>
	<div class="pins">
		{content}
		<img src="img/koolkids.jpg" class="class-photo"/>
	</div>
</body>
</html>`;

function renderReacts(reacts) {
	return reacts.reduce((acc, react) => {
		if (react.match(/:[^ ]*:/g)) {
			acc += getImage(react);
		} else {
			acc += ` ${react}`;
		}
		return acc;
	}, '');
}

function renderText(text) {
	let renderedText = text;
	const emojis = text.match(/:[^ ]+:/g);
	emojis && emojis.forEach((emoji) => {
		renderedText = renderedText.replace(emoji, getImage(emoji));
	});
	const links = text.match(/(@|#)[a-zA-z0-9-_.]{2,}/g);
	links && links.forEach((link) => {
		renderedText = renderedText.replace(link, `<span class="link">${link}</span>`);
	});
	return renderedText;
}

const content = pins.reduce((acc, pin) => {
	acc += `
		<div class="pin">
			<div class="head">
				<span class="channel">${pin.channel}</span>${pin.date}
			</div>
			<div class="body">
				<img src="${authorToImage[pin.author]}" class="avi"/>
				<div class="content">
					<div class="author">
						<b>${pin.author}</b> <span class="time">${pin.time}</span>
					</div>
					<div class="message">${renderText(pin.text)}</div>
					${ pin.reacts.length ? `
						<div class="reacts">
							${renderReacts(pin.reacts)} <span class="react-count">${pin.reactCount} ${pin.reactCount > 1 ? 'Reactions' : 'Reaction'}</span>
						</div>
					` : '' }
				</div>
			</div>
		</div>
	`;
	return acc;
}, '');

fs.writeFileSync('../index.html', template.replace('{content}', content));
