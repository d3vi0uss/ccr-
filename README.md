# CS Sim Empire (Frontend-only prototype)

A single-page, **backend-free** simulated CSGO clicker + case opening + casino experience.

## What is included in this prototype
- Clicker economy with upgrades, levels, XP, rebirth.
- Case opening with multi-open, rarity colors, float + pattern seed, knife gold effects.
- Inventory + collection with favorite toggle and rarity/search filters.
- Casino mini-games: roulette, blackjack-style roll, coinflip, crash, mines, slots.
- Case battle simulation, market trend graph, bank deposits + interest, loan mechanic.
- Daily/weekly-style missions + rewards.
- Login/signup saved in localStorage.
- Admin actions restricted to username `d3vi0us`.
- Light/dark theme and mobile-friendly responsive layout.

> Note: This is a large **foundation scaffold** for your full vision. Many advanced systems (real-time multiplayer trading, auctions, clans, live moderation feeds, etc.) are represented conceptually and should be expanded in future iterations.

## iPad + VS Code (no downloads) detailed tutorial
You can build and edit this using only browser tools.

1. Open Safari (or Chrome) on iPad.
2. Go to `https://vscode.dev`.
3. Open your GitHub repository from the VS Code web UI.
4. Edit `index.html`, `styles.css`, and `app.js` directly in browser.
5. For running without installing apps:
   - Option A: Use GitHub Pages (free) to host static files.
   - Option B: Use StackBlitz web editor (free) and paste files.
6. Commit changes from the source control panel in vscode.dev.
7. Refresh your hosted page to test animations/features.

### GitHub Pages deploy (free, no app)
1. Push files to GitHub.
2. In repository settings → Pages.
3. Set source to `main` branch root.
4. Save, wait ~1 minute, open your generated Pages URL.

## Next build phases to reach your complete feature list
1. Split logic into modules (`economy.js`, `cases.js`, `casino.js`, `market.js`).
2. Add deterministic RNG seed logs + provably-fair display panel.
3. Implement advanced marketplace (auctions, relist fees, bid timers).
4. Add full battle types (1v1, teams, FFA) and reveal animations.
5. Add battle pass tiers with XP tracks and seasonal event cases.
6. Add trade-up contracts, crafting, dynamic bot market behavior.
7. Build full stats dashboard + leaderboards + export/import save.

## Run locally
Just open `index.html` in any browser.
