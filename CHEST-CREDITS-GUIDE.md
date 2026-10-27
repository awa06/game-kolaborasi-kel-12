# Chest easter egg and developer credits

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
