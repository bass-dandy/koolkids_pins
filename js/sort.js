const fs = require('fs');
const pins = require('./pins.json');

const months = {
	Jan: '01',
	Feb: '02',
	Mar: '03',
	Apr: '04',
	May: '05',
	Jun: '06',
	Jul: '07',
	Aug: '08',
	Sep: '09',
	Oct: '10',
	Nov: '11',
	Dec: '12'
};

function getDate(pin) {
	const timeParts = pin.time.split(' ');
	let [month, day, year] = pin.date.split(' ');
	let [hours, minutes] = timeParts[0].split(':');

	day = day.replace(/[^0-9]*/g, '');

	if (day.length < 2) {
		day = `0${day}`;
	}
	if (timeParts[1] === 'PM') {
		hours = parseInt(hours) + 12;
	}
	if (hours === 24) {
		hours = '00';
	}
	if (`${hours}`.length < 2) {
		hours = `0${hours}`;
	}

	return new Date(
		`${year}-${months[month]}-${day}T${hours}:${minutes}:00Z`
	);
}

const sortedPins = pins.map((pin) => {
	pin.dateTime = getDate(pin);
	return pin;
}).sort((a, b) => {
	const dateA = getDate(a);
	const dateB = getDate(b);
	return dateB - dateA;
});

fs.writeFileSync('./sortedpins.json', JSON.stringify(sortedPins, null, '\t'))
