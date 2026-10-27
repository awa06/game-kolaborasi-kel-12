# Animal Hunter

Open `Lawful Connection.json`. The opening screen is the default start scene; click the large play icon or press Enter to start.

## Screens and icon controls

- **Opening:** Animal Hunter title artwork, animated cowboy, tropical setting, play icon, question-mark help icon, and exit icon. Exit uses GDevelop's native Stop Game action.
- **Gameplay:** hearts show health. The skull badge shows remaining lives, ammunition icon shows rounds, coin icon shows collected/total coins, pouch icon shows score, and the key icon lights up after collecting the key. The top-right controls are help, pause and replay. Buttons use artwork without text labels.
- **Pause:** the pause emblem and four buttons show continue (triangle), replay (circular arrow), credits (scroll/quill) and home (house). Physics, timers, animation and shooting freeze while the modal is open.
- **Winner / ending:** collecting the key and reaching the door opens the dedicated `winner` scene. The trophy, final score and coin total are shown with replay and home icons.
- **Game over:** losing all lives opens the dedicated `game over` scene with the cowboy-skull emblem, final run data, replay and home icons.

The help modal explains the controls; no written control strip or text labels are placed on gameplay buttons.

## Keyboard controls

- Arrow keys or A/D: move.
- Space or W: jump. Holding jump briefly increases height through Platformer jump sustain.
- J or X: shoot; hold to repeat.
- P or Escape: pause / continue. Escape also closes help, or returns from a result screen to the opening.
- H: open / close help.
- R: replay from gameplay or a result screen.
- Enter: start from opening, or close a help/pause modal.

## Existing gameplay

The level is 4096 x 720 with four ground sections, raised platforms, patrol crabs, supplies, coins, a checkpoint, a key, a chest and the exit. The player starts with 3 health, 3 lives and 20 ammunition. Crabs take 2 shots and can be stomped. Damage grants 1.3 seconds of invulnerability. Falling costs a life. The checkpoint restores health and sets the respawn position. The key opens both the chest and exit. Coins are optional score bonuses.

Player and crab gravity/movement use native Platformer behaviors; terrain uses Platform. Player animations remain Idle, Run, Jump, Fall, Land, Hurt, Shoot and Death on fixed 128 x 128 canvases with the same body mask (45,32)-(83,112). Native Platformer condition events select locomotion animations. Do not change frame dimensions or origins without adjusting collision data.

## Event organization

Gameplay has an `00 - Icon HUD, pause, continue, replay and home` group before the native movement, animation and game-rule groups. The UI group uses `animal-hunter-screen-ui.js`; pause changes the scene time scale and the game-rule event skips processing while a modal is open.

The three menu/result scenes use the same UI controller. Finishing a run stores AHLastScore, AHLastCoins, AHLastTotalCoins, AHLastLives and AHLastAmmo in project variables before changing scenes. These values supply the result screens.

Readable source snapshots are in `game-logic/animal-hunter-screen-ui.js` and `game-logic/permainan-gameplay.js`. Edit the JavaScript event inside GDevelop to change the game; editing a snapshot alone does not update the embedded event.

## Developer credits and chest easter egg

Collect the brass key, then open the treasure chest in `permainan` as usual. The game pauses and shows a closed-to-open chest reveal. After about 2.1 seconds it automatically shows the developer cards; the play/continue icon or Enter advances sooner. The chest still awards 100 score and 8 ammo once per run.

The credits use the supplied portraits without alteration:

| Developer | Role | NIM |
| --- | --- | --- |
| Syahruzzahid | Programmer | 2405336104 |
| Nazwa Hilmia Zida | Artist | 24053360454 |
| Syarifatus Sholihah | Level Design | 240533602750 |

The continue icon or Escape closes the credits. After a chest reveal, gameplay resumes. When credits were opened from the pause menu, closing returns to that paused menu instead. Movement, timers and shooting stay frozen throughout the reveal and credits.

The scroll/quill credits icon is enabled on the opening screen, winner screen, game-over screen and pause menu. The pause menu now has four icon buttons: continue, replay, credits and home. Replay resets the chest for a new run.

Portrait PNGs are in `assets/developer-portraits-v1`, with matching global objects in the Developer Portraits folder. Each scene has Interface > Developer Credits and Interface > Chest Reveal folders. Names, roles and NIMs are editable text objects in those folders.

The UI event controls the reveal timing and credit cards. `treasureShownAt` uses wall-clock time so the reveal can advance while game time is paused. The game-rule event opens the dialog only when a keyed chest is first opened. Sources are snapshotted in `game-logic/animal-hunter-screen-ui.js` and `game-logic/permainan-gameplay.js`; edit embedded events in GDevelop to change runtime behavior.


## Assets

The title and new home, exit, credits, trophy, game-over, key, score and help assets are in `assets/animal-hunter-ui-v1`. Existing play, pause and replay images are reused from `assets/cowboy-island-pack-v1`. New UI assets are grouped under Global Objects > Animal Hunter UI.

The new assets were generated with the built-in image tool, then cropped and normalized for import. Generation prompts are in `assets/animal-hunter-ui-v1/PROMPTS.md`. No audio was added. Project backups are saved beside `Lawful Connection.json` before replacing it.
