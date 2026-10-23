/* Everything about this open house lives here. For the next listing, copy this folder
   to /oh/<new-slug>/, swap the photo and edit this object. Nothing else changes. */
window.OH = {
  slug: '104-555-w14',
  url: 'https://vancouversearch.github.io/open-house/oh/104-555-w14/', // printed on the QR sign

  address: '104 – 555 W 14th Ave',
  area: 'Fairview',
  boardArea: 'Vancouver West',        // Realtor OS area for the lead (a GVR sub-area name)
  leadProperty: '104-555 W 14th Ave', // tag saved with every lead
  price: 649000,
  priceTag: 'Price improved',         // '' to hide
  photos: [
    // staged: true adds a "Virtually staged" label on the photo
    { src: 'patio.jpg', alt: 'The 683 sq ft private patio', staged: false }
  ],
  facts: ['1 bed', '629 sq ft', '683 sq ft private patio', '2 parking + locker'],

  openHouse: 'Sat & Sun, Oct 24–25, 2–4pm',
  floorPlan: { src: 'floorplan.jpg', alt: 'Floor plan: 1 bed, 1 bath, 629 sq ft inside plus a 683 sq ft patio' },
  cta: { heading: 'Picture yourself here?', button: 'Book a private showing', text: "Hi Chris, I'd like to book a private showing of 104-555 W 14th" },

  listing: { agent: 'Tyler Edwards PREC*', brokerage: 'Oakwyn Realty' },
  host: {
    name: 'Chris Zenone', first: 'Chris', last: 'Zenone', brokerage: 'Oakwyn Realty',
    phone: '7788831594', phoneDisplay: '778-883-1594', email: 'chriszenone@outlook.com',
    headshot: '../../assets/headshot.jpg' // added to the vCard if the file exists
  },

  // Cost card. Price, down payment, mortgage and transfer tax are worked out from price.
  costs: { strata: 331.68, strataNote: 'includes hot water', taxMonthly: 197, rate: 4.5, years: 25, downPct: 20 },

  strataDocsText: 'Hi Chris, please send the strata docs for 104-555 W 14th',
  buyerGuide: '../../assets/buyer-guide.pdf'
};
