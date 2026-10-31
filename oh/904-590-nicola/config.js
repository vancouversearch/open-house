/* Everything about this open house lives here. For the next listing, copy this folder
   to /oh/<new-slug>/, swap the photo and edit this object. Nothing else changes. */
window.OH = {
  slug: '904-590-nicola',
  url: 'https://vancouversearch.github.io/open-house/oh/904-590-nicola/', // printed on the QR sign

  address: '904 – 590 Nicola St',
  area: 'Coal Harbour',
  boardArea: 'Vancouver West',          // Realtor OS area for the lead (a GVR sub-area name)
  leadProperty: '904-590 Nicola St',    // tag saved with every lead
  price: 1075000,
  priceTag: 'Just listed',              // '' to hide
  photos: [
    // staged: true adds a "Virtually staged" label on the photo
    { src: 'photo.jpg', alt: 'View from the balcony over the Coal Harbour marina to the North Shore mountains', staged: false }
  ],
  facts: ['1 bed + den', '821 sq ft', 'Mountain & inlet views', 'Parking + locker'],

  openHouse: 'Sun, Nov 1, 2–4pm',
  floorPlan: { src: 'floorplan.jpg', alt: 'Floor plan: 1 bed plus den, 1 bath, 821 sq ft' },
  cta: { heading: 'Picture yourself here?', button: 'Book a private showing', text: "Hi Chris, I'd like to book a private showing of 904-590 Nicola St" },

  listing: { agent: 'Sam Grayli PREC*', brokerage: 'Oakwyn Realty' },
  host: {
    name: 'Chris Zenone', first: 'Chris', last: 'Zenone', brokerage: 'Oakwyn Realty',
    phone: '7788831594', phoneDisplay: '778-883-1594', email: 'chriszenone@outlook.com',
    headshot: '../../assets/headshot.jpg' // added to the vCard if the file exists
  },

  // Cost card: strata fee and property tax, straight from the listing.
  costs: { strata: 752.27, strataNote: 'includes gas, hot water, garbage & gardening', taxMonthly: 290, taxYearly: 3485.04 },

  strataDocsText: 'Hi Chris, please send the strata docs for 904-590 Nicola St',
  buyerGuide: '../../assets/buyer-guide.pdf',
  featureSheet: 'feature-sheet.pdf' // '' to hide the button
};
