# Cowboy Island Pack v1

129 individual PNGs: 64 player frames, 64 environment/gameplay assets, and one background. Source sheets are in sources/.

Player frames: 128 x 128 transparent PNGs; fixed feet baseline y=112 and body collision rectangle (45,32)-(83,112). Idle, Run, Jump, Fall, Land, Hurt, Shoot, Death each contain 8 frames. Use Run at 12 fps and others at 9-10 fps. Loop only Idle, Run and Fall. Mirror horizontally for left-facing motion. Keep the same frame size and origin when adding animations.

All assets are imported as global objects prefixed Pack into the project, available in every scene. PackCowboy includes a Platformer behavior; terrain objects include Platform behaviors. Existing Player and scene artwork are preserved. Drag new global objects into a scene to use them. Select animations using Change animation by name. Shoot/Hurt/Death artwork is provided; bullet logic, damage and death transitions still need game events.

Terrain blocks are 64 x 64; other individual props are 128 x 128 with transparent padding. These are individual blocks and sprites, not a guaranteed seamless terrain autotile atlas. Effects are individual images, not a single animation sequence. Crab has 8 walking frames.

See manifest.json for every file and animation, gdevelop-player-object.json for the player object definition, and PROMPTS.md for generation prompts. Built-in image generation was used, followed by deterministic cell extraction and nearest-neighbor sizing. No audio is included.
