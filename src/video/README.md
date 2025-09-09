# Hero Video Assets

This directory contains video files for the premium hero section background.

## Required Videos

For the premium hero section, you need to add the following video files:

1. **hero-watch-mechanism.mp4** - Main video file (MP4 format)
   - Recommended resolution: 1920x1080 or higher
   - Duration: 10-30 seconds (will loop)
   - Content suggestions:
     - Macro shots of working watch mechanisms
     - Slow motion of light reflecting off watch surfaces
     - Water droplets on waterproof watch cases
     - Elegant watch movements and gears

2. **hero-watch-mechanism.webm** - WebM format for better browser compatibility
   - Same content as MP4 but in WebM format
   - Smaller file size, better compression

## Video Guidelines

- **Quality**: Use high-resolution footage (minimum 1080p)
- **Style**: Cinematic, slow-motion, macro photography
- **Colors**: Dark, moody tones that work well with the dark overlay
- **Duration**: 10-30 seconds (will loop seamlessly)
- **File Size**: Optimize for web (aim for under 10MB per video)
- **Aspect Ratio**: 16:9 landscape orientation

## Fallback Image

If video fails to load, the hero section will fall back to:

- `img/hero/hero-poster.jpg` - High-quality poster image
- `img/hero/slider-4.jpg` - Current fallback image

## Video Sources

Consider using:

- Stock video from premium sources (Shutterstock, Getty Images)
- Custom macro photography of luxury watches
- Professional videography of watch mechanisms
- Slow-motion water droplet effects on watch surfaces

## Technical Notes

- Videos are set to autoplay, muted, and loop
- `playsinline` attribute ensures mobile compatibility
- Videos are filtered with `brightness(0.7) contrast(1.1)` for optimal text readability
- Dark gradient overlay is applied over the video for better text contrast
