# Video drop-in folder

No video ships with this build and no third-party/YouTube embed is used.

- `clips/`   put `moha-trailer.mp4` here (H.264 + AAC, 1080p, ~8 Mbps max)
- `poster/`  put `moha-trailer-poster.jpg` here (first frame, 1920x1080)

Then register them in `assets/js/site-config.js` -> `videos.trailer`.
The MEDIA page placeholder is replaced by a real HTML5 player with poster,
controls and `preload="metadata"`. An optional muted looping ambient clip for
the hero can be registered under `hero.video`.
