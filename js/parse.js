const fs = require('fs');

const txt = fs.readFileSync('./pins.txt', {encoding: 'utf8'});

const pins = txt.split('\n\n').map((pin) => {
	const lines = pin.split('\n');
	let reacts = [];
	let reactCount = 0;
	let text = '';

	if (lines[lines.length - 1].includes('reaction')) {
		reacts = lines[lines.length - 1].match(/:[^:]*:/g);
		reactCount = parseInt(lines[lines.length - 1].match(/[0-9]* reactions?$/g)[0].split(' ')[0]);
		text = lines.slice(4, lines.length - 1).join('\n');
	} else {
		text = lines.slice(4).join('\n');
	}

	const authorTime = lines[3].split(' ');

	return {
		channel: lines[0],
		date: lines[2],
		time: authorTime.slice(authorTime.length - 2).join(' '),
		author: authorTime.slice(0, authorTime.length - 2).join(' '),
		text,
		reacts,
		reactCount
	};
});

fs.writeFileSync('./pins.json', JSON.stringify(pins, null, '\t'));
