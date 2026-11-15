/* Everything about this open house lives here. For the next listing, copy this folder
   to /oh/<new-slug>/, swap the photo and edit this object. Nothing else changes. */
window.OH = {
  slug: '40-2375-w-broadway',
  url: 'https://vancouversearch.github.io/open-house/oh/40-2375-w-broadway/', // printed on the QR sign

  address: '40 – 2375 W Broadway',
  area: 'Kitsilano',
  boardArea: 'Vancouver West',          // Realtor OS area for the lead (a GVR sub-area name)
  leadProperty: '40-2375 W Broadway',   // tag saved with every lead
  price: 998000,
  priceTag: 'Just listed',              // '' to hide
  photos: [
    // staged: true adds a "Virtually staged" label on the photo
    { src: 'photo.jpg', alt: 'Private rooftop deck with seating and a dining table, looking over the treetops', staged: true }
  ],
  facts: ['2 bed · 2 bath', '1,136 sq ft', 'Private rooftop deck', '2 parking + locker'],

  openHouse: 'Sun, Nov 15, 2–4pm',
  // Printed door sign (sign.html). Price is added from `price` above.
  sign: { stats: ['2 bed', '2 bath', '1,136 sq ft'], features: 'Floor plan · Strata fee & taxes · Strata documents' },
  floorPlan: { src: 'floorplan.jpg', alt: 'Floor plan: 2 bed, 2 bath townhouse, 1,136 sq ft over three levels plus a rooftop deck' },
  cta: { heading: 'Picture yourself here?', button: 'Book a private showing', text: "Hi Chris, I'd like to book a private showing of 40-2375 W Broadway" },

  listing: { agent: 'Sam Grayli PREC*', brokerage: 'Oakwyn Realty' },
  host: {
    name: 'Chris Zenone', first: 'Chris', last: 'Zenone', brokerage: 'Oakwyn Realty',
    phone: '7788831594', phoneDisplay: '778-883-1594', email: 'chriszenone@outlook.com',
    headshot: '../../assets/headshot.jpg' // added to the vCard if the file exists
  },

  // Cost card: strata fee and property tax, straight from the listing.
  costs: { strata: 738, strataNote: 'includes gardening & hot water', taxMonthly: 331, taxYearly: 3972.81 },

  strataDocsText: 'Hi Chris, please send the strata docs for 40-2375 W Broadway',
  buyerGuide: '../../assets/buyer-guide.pdf',
  featureSheet: '' // add 'feature-sheet.pdf' once you have the public MLS sheet
};
