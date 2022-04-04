const axios = require('axios');

// Gather collected and truncated 3pages of 50stations each from politiet.no
const data = require('./passkontor.json');

// Start of URL for valid timebestilling-links, used for filtering
const urlEndpointTimebestilling = "https://pass-og-id.politiet.no/timebestilling/index.html#/preselect/branch/";

// Make a tidy array with just useful info
const passkontor = data.orgUnits
        .filter( x =>
		x.linkAppointment.indexOf(urlEndpointTimebestilling) !== -1
        )
	.map(x => ({
		name: x.name,
		mapUrl: x.mapUrl,
		get coords() {
			let csvCoords = this.mapUrl.split("maps?q=")[1].split(",");
			return {lat: csvCoords[0], long: csvCoords[1]};
		},
		linkAppointment: x.linkAppointment,
		branchId: x.linkAppointment.split("branch/")[1].split("?")[0],
		get linkAvailableDates() {
			return `https://pass-og-id.politiet.no/qmaticwebbooking/rest/schedule/branches/${this.branchId}/dates;servicePublicId=d1b043c75655a6756852ba9892255243c08688a071e3b58b64c892524f58d098;customSlotLength=10`;
		},
	}));

async function getPasskontorWithDates() {
function getAvailableDates({ linkAvailableDates }) {
	return axios.get(linkAvailableDates).then( res => res.data[0]?.date );
}

const promises = passkontor.map(kontor => getAvailableDates(kontor));

// Going synchronized async
rVals = await Promise.all(promises);
//console.log(rVals); // For debugging
rVals.forEach( (v, i) => { passkontor[i].firstDate = v; } );

passkontorWithDates = passkontor.filter( x => x.firstDate );

passkontorSorted = passkontorWithDates.sort( (a,b) => {
	const keyA = new Date(a.firstDate),
	      keyB = new Date(b.firstDate);
	// Compare
	if (keyA < keyB) return -1;
	if (keyA > keyB) return 1;
	return 0;
});

return passkontorSorted;

passkontorSorted.forEach( x => { console.log(`${x.firstDate}: ${x.name}`); } )

// End sync async
}

module.exports = getPasskontorWithDates;

