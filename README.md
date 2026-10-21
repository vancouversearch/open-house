# Open house sign-in

Static site for GitHub Pages. Each open house is a folder under `oh/`.

- `oh/<slug>/index.html` is the sign-in page and thank-you screen
- `oh/<slug>/sign.html` is the printable QR sign (letter size, black and white)
- `oh/<slug>/config.js` holds everything about the property
- `assets/` holds the shared script, styles and `buyer-guide.pdf`. Add `headshot.jpg` here to put a photo in the vCard.

## Next open house
Copy `oh/104-555-w14/` to `oh/<new-slug>/`, replace the photo, and edit `config.js`. If a photo is virtually staged, set `staged: true` on it.

## Where sign-ins go
Each sign-in inserts one row into the Supabase table `ros_inbox` with `source = 'open-house'`. The open-house answers go in the `details` jsonb column. Realtor OS turns the row into a buyer lead (source "Open House") on its next sync, then deletes the row. Visitors can only insert; they can't read, change or delete anything.

If the insert fails (weak signal), the sign-in waits in the visitor's browser (`localStorage` key `oh_queue`) and retries every 20 seconds, when the phone comes back online, and when the page is closed.
