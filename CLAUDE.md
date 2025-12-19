# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an official BoardGameArena (BGA) implementation of the board game "Sunrise Sunset". The project combines a PHP backend using the BGA framework with a Vue 3 frontend that gets integrated during the build process.

## Key Commands

### Development
- `npm start` or `npm run dev` - Start local development server for client-side testing without backend
- `npm run format` - Format TypeScript and Vue files using Prettier

### Building
- `npm run build` - Complete build process (runs all build steps in sequence)
- `npm run build:dev` - Build Vue app with TypeScript checking, removes index.html
- `npm run build:bgaBackend` - Copy BGA backend PHP files to dist/
- `npm run build:bgaClient` - Copy BGA client files to dist/
- `npm run build:bgaCpImg` - Copy image assets to dist/img/
- `npm run clear:dist` - Clear the dist directory

### Type Checking
- `vue-tsc` - TypeScript compilation and type checking (run as part of build:dev)

### Prerequisites  
- Node.js v20+
- npm v11+

## Architecture

### Dual-Architecture System
The project has a unique dual architecture:

1. **BGA Backend** (`bga_src/backend/`) - PHP-based game logic following BGA framework conventions
   - `sunrisesunset.game.php` - Main game logic and rules (extends BGA `Table` class)
   - `states.inc.php` - Game state machine definitions with transitions and callbacks
   - `sunrisesunset.action.php` - Player action handlers (AJAX endpoints)
   - `material.inc.php` - Card type definitions and properties
   - `gameinfos.inc.php` - Game metadata (2 players, ~30 min duration, beta status)
   - `dbmodel.sql` - Database schema (cards, round, center tables using BGA deck module)

2. **Vue 3 Frontend** (`src/`) - Modern TypeScript/Vue client that replaces BGA's default JS
   - `main.ts` - Vue app bootstrap with BGA integration
   - `App.vue` - Main application component
   - `logic/state.ts` - Client-side state management mirroring BGA states
   - `components/` - Vue components for UI elements
   - `type/` - TypeScript definitions for game data structures

### State Management
The client-side state system (`src/logic/state.ts`) mirrors the BGA backend state machine with detailed sub-states:
- `mulligan:*` - Card mulligan phase (init, beforeCardSelect, afterCardSelect, submit, etc.)
- `playerTurn:*` - Complex turn sequence (beforeCardSelect, afterCardSelect, beforeGridSelect, afterGridSelect, beforeTargetSelect, afterTargetSelect, submit)
- `reincarnationTurn:*` - Similar to playerTurn but for reincarnated cards
- `endRound:*`, `gameEnd:*` - Round/game ending phases
- `roundSetup`, `waitingForOtherPlayer`, `otherPlayerTurn` - Non-interactive states

The state machine handles complex card interactions, target selection, and animations through reactive Vue refs.

### Component Architecture
- `hand.vue` - Player hand management with exclusive selection (one card at a time)
- `grid.vue` - 3x5 game board (3 lanes, 5 rows including center cards) with dynamic sizing and overlay positioning
- `ctrl-bar.vue` - Control buttons with dynamic state (cancel, submit, mulligan, confirm)
- `game-card.vue` - Card rendering using sprite sheets (8x2 grid for cardset.png)
- `aura.vue` - Visual effects layer for card status indicators

### Game Definitions
Card metadata (`src/def/card.ts`) defines 15 Egyptian-themed cards:
- **Properties**: `powerFixed` (base power), `powerCenter` (center-dependent power), `stealth` flag
- **Sprite positioning**: Cards use sprite sheet coordinates for efficient rendering
- **Notable mechanics**: Stealth cards, creep cards, reincarnation-eligible cards
- Card data must match `bga_src/backend/material.inc.php` definitions

### Build System
The build process combines the Vue app with BGA backend files:
1. Vue app builds to `dist/modules/app.js` (via Vite with CSS injection)
2. BGA backend files copied to `dist/`
3. Assets processed and copied to appropriate locations  
4. Final `dist/` directory synced to BGA server

The Vite configuration uses `vite-plugin-css-injected-by-js` to inline CSS and outputs:
- Entry file: `modules/app.js`
- Chunk files: `modules/chunk.js`  
- Assets: `img/[name].[ext]`

## Data Flow and Integration

### Player Action Flow
1. Player interacts with Vue component (grid.vue/hand.vue)
2. Vue state management updates (State class in `src/logic/state.ts`)
3. Player clicks submit button
4. State machine calls `state.submitState()`
5. Vue component sends `bgaRequest` with action name + arguments
6. BGA framework intercepts, calls PHP action handler (`sunrisesunset.action.php`)
7. PHP validates action and updates server state
8. Server sends `bgaNotification` to all clients
9. Vue watches notification, runs `Sub.handle()` (`src/logic/sub.ts`)
10. Sub updates local state refs reactively
11. Vue components re-render with new state

### Key Integration Points
- `window['vue']` - Global reference exposed for BGA framework
- `window.vue.bgaRequest` - Send player actions to server
- `window.vue.bgaNotifications` - Receive server notifications
- `window.vue.bgaStates` - Receive state changes from BGA
- Promise queues handle async notifications/states sequentially to ensure proper ordering

### Data Restoration
`App.vue`'s `restore()` function reconstructs the visual state from server `gamedata`:
- Maps server card data to grid positions
- Applies card metadata (stealth, effects, reincarnation status)
- Determines player perspective (active player vs observer)
- Called on initial load and when recovering from refresh

## Development Notes

### Local Testing
Use `npm start` to run the Vue client locally with test data from `public/test.js`. This allows frontend development without a BGA backend.

### BGA Notification Handler
The notification handler (`src/logic/sub.ts`) processes these key events:
- `newRound` - New round initialization
- `newHand` - Cards dealt to players
- `playCard` - Card placement on grid
- `moveCard` / `updateCard` - Card state changes
- `reincarnateCard` - Reincarnation mechanics
- `score` / `endRound` - Scoring and round conclusion

### Formatting
The project uses Prettier for code formatting and includes PHP formatting support via `@prettier/plugin-php`.

### Deployment
After building, sync the entire `dist/` directory to the BGA server. The build process ensures all files are properly placed:
- PHP backend files at root level
- Vue application at `modules/app.js`
- Images in `img/` directory