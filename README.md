# Interactive Portfolio Demo

A starter template for the portfolio concept:

- stylized 3D room
- cinematic camera transitions
- clickable PC / board / CV / bookshelf
- normal HTML overlays on top of the 3D scene
- separate scroll-driven "Library / Influences" page
- GSAP ScrollTrigger animations
- season + time-of-day hooks
- no external 3D assets required for the demo

## Stack

- Next.js
- React
- React Three Fiber
- Drei
- Three.js
- GSAP + ScrollTrigger

## Run

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Demo interactions

On the room page:

- click the monitor → Development overlay
- click the corkboard → Game Dev / AR panel
- click the paper on the desk → CV
- click the bookcase → scroll-driven `/library` page

## Where to replace demo geometry

The 3D room currently uses primitive Three.js geometry so the project runs immediately.

Later replace those pieces with a Blender-exported `.glb` file and use named nodes such as:

```text
Desk
Computer
CV
Bookshelf
Board
Window
Lamp
```

The interaction model can remain the same.

## Suggested next steps

1. Replace the primitive room with your Blender model.
2. Add a camera target for the bookshelf before entering `/library`.
3. Add MDX content for projects / influences.
4. Add a season configuration file.
5. Add custom cursor and hover outline.
6. Add subtle room audio after the visual system is stable.
