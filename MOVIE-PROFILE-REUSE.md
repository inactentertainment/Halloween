# Reusable InAct Entertainment Movie Profile

This original design follows the *information architecture* of common film databases, not their layout, brand, rating systems, or artwork.

## Files
- `movie-profile-template.js`: reusable in-page film profile dialog with metadata, embedded trailer control (when mapped), watchlist, own-site promo modules.
- `movie-profile-template.css`: responsive desktop/mobile styling.

## Add to another site
1. Copy the JS and CSS files.
2. Load the CSS in the page head, then load the JS after any movie data and trailer scripts.
3. Supply a data array, with at least unique numerical `rank`, `title`, `year`, `genre`, and optional `description` fields.
4. Add a button to every movie card: `<button type="button" data-film-profile-rank="1">Full Movie Profile</button>`.
5. Optionally define these globals **before user clicks**:
```js
window.movieProfileBrand = 'Your Site Name';
window.movieProfileItems = [
  {rank: 1, title: 'Example Film', year: 2026, genre: 'Horror', description: 'Your original synopsis.'}
];
window.movieProfileTrailerIds = {'Example Film|2026': 'a-valid-YouTube-video-ID'};
window.movieProfileData = movie => ({
  director: 'Only when verified',
  cast: 'Only when verified',
  rating: 'Only when verified',
  release: 'Only when verified',
  source: 'https://example.com/verified-film-page'
});
window.movieProfilePromos = [
  {title: 'Your Product', description: 'Your own promotion.', url: './products.html'}
];
```
6. The helper `window.HTMovieProfile.open(1)` can also open the profile programmatically.

## Editorial and advertising rules
- Profiles use original copy. Do not copy Rotten Tomatoes reviews, rating scores, screenshots, or logos.
- Distinguish site promotions, affiliate links, and third-party sponsored advertisements.
- Do not fabricate critics' scores, streaming availability, runtime, or creator/actor credits.
- A dedicated searchable page per film is optional only after you have substantial original editorial information. A reusable in-page profile avoids generating 150 empty SEO pages.
- Films and trailers remain copyright of their owners; ensure video embedding is permitted by its host.

## Haunted Towne
The Halloween site uses the shared module for both modern and classic collections. Its own promotions point to the interactive Thirteen Doors story and Halloween Recipes. Further app/site reuse will require the data array and promo configuration for that site.
