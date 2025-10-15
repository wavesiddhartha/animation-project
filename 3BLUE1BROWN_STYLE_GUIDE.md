# 3Blue1Brown Style Guide 🎨

## Overview

3Blue1Brown (3B1B) is renowned for creating the most beautiful, intuitive mathematical animations. This guide implements Grant Sanderson's signature techniques to achieve that level of quality.

---

## 🎨 Core 3Blue1Brown Principles

### 1. **Visual Intuition Over Formalism**
- Show WHY things work, not just WHAT they are
- Use visual metaphors and analogies
- Progressive revelation (build understanding step-by-step)
- Make abstract concepts tangible

### 2. **Smooth, Continuous Motion**
- Everything flows smoothly
- No sudden jumps or cuts
- Objects morph and transform elegantly
- Camera movements are smooth and purposeful

### 3. **Signature Color Scheme**
- Dark background (#0C0D0F or #1C1C1C)
- Blue (#58C4DD) - Primary color
- Yellow (#FCBA03) - Highlights and emphasis
- Red/Pink (#FC6255) - Important points
- Green (#83C167) - Secondary elements
- White text on dark background

### 4. **Mathematical Storytelling**
- Start with a question or puzzle
- Build intuition gradually
- Use analogies and real-world connections
- "Aha!" moment reveals

### 5. **Clean, Elegant Aesthetics**
- Minimal clutter
- Perfect positioning
- Consistent stroke widths
- Beautiful curves and smooth shapes

---

## 🎬 3Blue1Brown Animation Techniques

### Technique 1: Progressive Reveal
**What it does:** Build concepts layer by layer

```python
# Start simple
point = Dot([0, 0, 0], color=BLUE)
self.play(Create(point))
self.wait(0.5)

# Add line
line = Line([0, 0, 0], [3, 0, 0], color=BLUE)
self.play(Create(line), run_time=1)
self.wait(0.5)

# Transform to vector arrow
arrow = Arrow([0, 0, 0], [3, 0, 0], color=BLUE, buff=0)
self.play(Transform(line, arrow), run_time=0.8)
```

### Technique 2: Morphing Shapes
**What it does:** Show relationships through transformation

```python
# Square transforms to circle
square = Square(side_length=2, color="#58C4DD")
square.move_to(ORIGIN)
self.play(Create(square), run_time=1)
self.wait(0.8)

circle = Circle(radius=1.4, color="#58C4DD")
circle.move_to(ORIGIN)
self.play(Transform(square, circle), run_time=1.5)
```

### Technique 3: Indicating & Emphasis
**What it does:** Draw attention to key elements

```python
# Create shape
shape = Circle(radius=1.5, color=BLUE)
shape.move_to(ORIGIN)
self.play(Create(shape))

# Flash emphasis
self.play(Indicate(shape, color=YELLOW, scale_factor=1.2), run_time=1)

# Wiggle for attention
self.play(Wiggle(shape), run_time=0.8)
```

### Technique 4: Smooth Camera Movements
**What it does:** Zoom in/out for focus

```python
# Create complex scene
equation = Text("f(x) = x^2", font_size=48)
equation.move_to(ORIGIN)
self.play(Write(equation))

# Zoom in on part
self.play(
    equation.animate.scale(1.5).shift(UP * 0.5),
    run_time=1.5
)
```

### Technique 5: Tracing Paths
**What it does:** Show motion and trajectories

```python
# Path that point follows
path = Arc(radius=3, start_angle=0, angle=PI)
path.set_color(BLUE)

# Point that moves along path
dot = Dot(color=YELLOW)
dot.move_to(path.get_start())

# Trace the path
self.add(dot)
self.play(
    MoveAlongPath(dot, path),
    Create(path),
    run_time=3,
    rate_func=smooth
)
```

### Technique 6: Layered Complexity
**What it does:** Add details progressively

```python
# Layer 1: Basic shape
base = Circle(radius=2, color="#58C4DD", stroke_width=3)
base.move_to(ORIGIN)
self.play(Create(base), run_time=1)
self.wait(0.5)

# Layer 2: Add grid
grid_lines = VGroup()
for i in range(-2, 3):
    h_line = Line([-2, i * 0.5, 0], [2, i * 0.5, 0], stroke_width=1, color=WHITE, stroke_opacity=0.3)
    v_line = Line([i * 0.5, -2, 0], [i * 0.5, 2, 0], stroke_width=1, color=WHITE, stroke_opacity=0.3)
    grid_lines.add(h_line, v_line)

self.play(Create(grid_lines), run_time=1.5)
self.wait(0.5)

# Layer 3: Add points
points = VGroup(*[
    Dot([np.cos(angle), np.sin(angle), 0] * 2, color=YELLOW, radius=0.08)
    for angle in np.linspace(0, TAU, 8, endpoint=False)
])

self.play(
    AnimationGroup(*[GrowFromCenter(p) for p in points], lag_ratio=0.1),
    run_time=2
)
```

### Technique 7: Mathematical Annotations
**What it does:** Label elegantly with arrows

```python
# Shape to annotate
triangle = Polygon(
    [-2, -1, 0], [2, -1, 0], [0, 2, 0],
    color="#58C4DD", stroke_width=3
)
triangle.move_to(ORIGIN)
self.play(Create(triangle))

# Add annotations with arrows
label = Text("Vertex", font_size=28, color=YELLOW)
label.move_to([0, 2.8, 0])

arrow = Arrow(
    [0, 2.5, 0], [0, 2.1, 0],
    color=YELLOW,
    stroke_width=3,
    max_tip_length_to_length_ratio=0.15
)

self.play(
    Write(label),
    GrowArrow(arrow),
    run_time=1
)
```

### Technique 8: Pulsing/Breathing Effects
**What it does:** Alive, dynamic visuals

```python
# Create shape
circle = Circle(radius=1.5, color="#58C4DD", stroke_width=4)
circle.move_to(ORIGIN)
self.play(Create(circle))

# Pulsing effect
self.play(
    circle.animate.scale(1.2),
    rate_func=there_and_back,
    run_time=1.5
)
```

---

## 🎨 3Blue1Brown Color Palette

### Primary Colors:
```python
# 3B1B Signature Colors
BLUE_3B1B = "#58C4DD"      # Primary blue
YELLOW_3B1B = "#FCBA03"    # Highlight yellow
RED_3B1B = "#FC6255"       # Important red/pink
GREEN_3B1B = "#83C167"     # Secondary green
PURPLE_3B1B = "#9A72AC"    # Accent purple
ORANGE_3B1B = "#FC9956"    # Warm accent

# Background
BACKGROUND_3B1B = "#0C0D0F"  # Almost black
DARK_GRAY_3B1B = "#1C1C1C"   # Dark gray

# Grayscale
WHITE_3B1B = "#ECECEC"       # Off-white
GRAY_3B1B = "#5A5A5A"        # Medium gray
```

### Usage Guidelines:
- **Blue**: Main mathematical objects, primary focus
- **Yellow**: Highlights, "aha!" moments, emphasis
- **Red/Pink**: Important points, special cases
- **Green**: Secondary elements, alternatives
- **White**: Text, labels, axes
- **Gray**: Supporting elements, less important

---

## 📐 3Blue1Brown Aesthetic Rules

### 1. Stroke Width Consistency
```python
# Thin lines for grids/backgrounds
grid_line = Line(..., stroke_width=1, stroke_opacity=0.3)

# Medium lines for standard shapes
shape = Circle(..., stroke_width=3)

# Thick lines for emphasis
important = Line(..., stroke_width=5)
```

### 2. Smooth Curves
```python
# Use rate_func for smoothness
self.play(
    obj.animate.shift(RIGHT * 3),
    rate_func=smooth,  # Not linear!
    run_time=1.5
)

# Common rate functions:
# - smooth: Smooth ease in/out
# - there_and_back: Go and return
# - rush_into: Fast start, slow end
# - rush_from: Slow start, fast end
```

### 3. Perfect Positioning
```python
# Always center important objects
main_obj.move_to(ORIGIN)

# Use relative positioning for related objects
label.next_to(shape, UP, buff=0.3)

# Align groups
group.arrange(RIGHT, buff=0.5)
group.move_to(ORIGIN)
```

### 4. Timing & Pacing
```python
# Quick transitions
self.play(FadeIn(obj), run_time=0.5)

# Standard creation
self.play(Create(shape), run_time=1)

# Important reveals
self.play(Write(equation), run_time=2)

# Wait times:
# - Short pause: self.wait(0.5)
# - Standard: self.wait(1)
# - Comprehension: self.wait(1.5)
```

---

## 🎬 3Blue1Brown Animation Structure

### Template: "The 3B1B Flow"

```python
from manim import *
import numpy as np

class ThreeBlueBrownStyle(Scene):
    def construct(self):
        # Set dark background
        self.camera.background_color = "#0C0D0F"

        # ===== ACT 1: THE QUESTION (5-7s) =====
        # Pose the question that hooks the viewer
        question = Text(
            "What is e to the i pi?",
            font_size=52,
            color="#ECECEC"
        )
        question.move_to(ORIGIN)
        self.play(Write(question), run_time=2)
        self.wait(1.5)
        self.play(question.animate.scale(0.7).to_edge(UP), run_time=1)

        # ===== ACT 2: BUILD INTUITION (15-20s) =====
        # Start simple, build complexity

        # Show unit circle
        circle = Circle(radius=2.5, color="#58C4DD", stroke_width=3)
        circle.move_to(ORIGIN)
        self.play(Create(circle), run_time=1.5)

        # Add axes
        x_axis = Line([-3.5, 0, 0], [3.5, 0, 0], color="#5A5A5A", stroke_width=2)
        y_axis = Line([0, -3.5, 0], [0, 3.5, 0], color="#5A5A5A", stroke_width=2)
        axes = VGroup(x_axis, y_axis)
        self.play(Create(axes), run_time=1)

        # Progressive revelation: Add point
        point = Dot([2.5, 0, 0], color="#FCBA03", radius=0.12)
        self.play(GrowFromCenter(point), run_time=0.8)
        self.wait(0.5)

        # Show it rotates
        angle_tracker = ValueTracker(0)

        def get_rotating_point():
            angle = angle_tracker.get_value()
            return Dot(
                [2.5 * np.cos(angle), 2.5 * np.sin(angle), 0],
                color="#FCBA03",
                radius=0.12
            )

        point.add_updater(lambda m: m.become(get_rotating_point()))

        # Rotate the point
        self.play(
            angle_tracker.animate.set_value(PI),
            run_time=3,
            rate_func=smooth
        )
        self.wait(1)

        # ===== ACT 3: THE REVEAL (5-8s) =====
        # Show the beautiful answer

        # Highlight final position
        self.play(
            Indicate(point, color="#FC6255", scale_factor=1.3),
            run_time=1.2
        )

        # Show answer
        answer = Text(
            "e to the i pi = -1",
            font_size=48,
            color="#FCBA03"
        )
        answer.next_to(circle, DOWN, buff=0.8)
        self.play(Write(answer), run_time=2)
        self.wait(2)

        # ===== ACT 4: ELEGANT CONCLUSION (3-5s) =====
        # Bring it all together

        conclusion = Text(
            "Beautiful mathematics",
            font_size=38,
            color="#58C4DD"
        )
        conclusion.to_edge(DOWN)
        self.play(
            FadeIn(conclusion, shift=UP * 0.3),
            run_time=1.5
        )
        self.wait(2)
```

---

## 🎯 Key 3Blue1Brown Techniques Summary

### Visual Techniques:
1. ✅ **Progressive Reveal** - Build complexity layer by layer
2. ✅ **Morphing** - Transform shapes to show relationships
3. ✅ **Indicating** - Flash/highlight for emphasis
4. ✅ **Smooth Motion** - Everything flows, nothing jumps
5. ✅ **Path Tracing** - Show motion and trajectories
6. ✅ **Layered Detail** - Add information progressively
7. ✅ **Elegant Annotations** - Labels with arrows
8. ✅ **Pulsing Effects** - Alive, breathing visuals

### Storytelling Techniques:
1. ✅ **Hook with Question** - Start with curiosity
2. ✅ **Build Intuition** - Simple → Complex
3. ✅ **Visual Metaphors** - Make abstract tangible
4. ✅ **Aha Moments** - Satisfying reveals
5. ✅ **Elegant Conclusion** - Tie it together

### Aesthetic Techniques:
1. ✅ **Dark Background** - #0C0D0F or #1C1C1C
2. ✅ **Signature Colors** - Blue, Yellow, Red/Pink
3. ✅ **Consistent Strokes** - 1px grid, 3px shapes, 5px emphasis
4. ✅ **Smooth Curves** - Use rate_func=smooth
5. ✅ **Perfect Positioning** - ORIGIN, relative placement

---

## 📚 Advanced 3B1B Techniques

### 1. Complex Plane Visualization
```python
# Complex number as point in plane
z = complex(3, 2)
point = Dot([z.real, z.imag, 0], color="#58C4DD")

# Vector representation
vector = Arrow(
    ORIGIN, [z.real, z.imag, 0],
    color="#58C4DD",
    buff=0,
    stroke_width=4
)

self.play(GrowArrow(vector), GrowFromCenter(point))
```

### 2. Function Transformations
```python
# Original function
def f(x):
    return x**2

# Draw graph
graph = FunctionGraph(
    f,
    x_range=[-2, 2],
    color="#58C4DD",
    stroke_width=3
)

self.play(Create(graph), run_time=2)

# Transform to new function
def g(x):
    return x**3

new_graph = FunctionGraph(
    g,
    x_range=[-2, 2],
    color="#FCBA03",
    stroke_width=3
)

self.play(Transform(graph, new_graph), run_time=2)
```

### 3. Grid Transformations
```python
# Create grid
grid = NumberPlane(
    x_range=[-5, 5],
    y_range=[-5, 5],
    background_line_style={
        "stroke_color": "#5A5A5A",
        "stroke_width": 1,
        "stroke_opacity": 0.3
    }
)

self.play(Create(grid), run_time=2)

# Apply transformation (e.g., shear, rotation)
self.play(
    grid.animate.apply_matrix([[1, 0.5], [0, 1]]),
    run_time=3
)
```

### 4. Parametric Curves
```python
# Beautiful parametric curve
t = ValueTracker(0)

def parametric_func(t_val):
    x = 2 * np.cos(t_val)
    y = 2 * np.sin(t_val * 2)
    return [x, y, 0]

# Trace curve
curve = ParametricFunction(
    lambda t: parametric_func(t),
    t_range=[0, TAU],
    color="#58C4DD",
    stroke_width=3
)

self.play(Create(curve), run_time=4, rate_func=smooth)
```

---

## 🎨 Complete 3B1B Example: Pythagorean Theorem

```python
from manim import *
import numpy as np

class PythagoreanThreeBlueBrown(Scene):
    def construct(self):
        # Dark background
        self.camera.background_color = "#0C0D0F"

        # ===== ACT 1: THE QUESTION =====
        question = Text(
            "Why does a² + b² = c²?",
            font_size=56,
            color="#ECECEC"
        )
        question.move_to(ORIGIN)
        self.play(Write(question), run_time=2)
        self.wait(1.5)
        self.play(
            question.animate.scale(0.6).to_edge(UP),
            run_time=1
        )

        # ===== ACT 2: BUILD THE VISUAL =====

        # Right triangle
        triangle = Polygon(
            [-2, -1.2, 0], [2, -1.2, 0], [2, 1.8, 0],
            color="#58C4DD",
            stroke_width=4,
            fill_opacity=0.2,
            fill_color="#58C4DD"
        )
        triangle.move_to(ORIGIN)
        self.play(Create(triangle), run_time=1.5)
        self.wait(0.8)

        # Label sides
        label_a = Text("a", font_size=36, color="#FCBA03")
        label_a.next_to([0, -1.2, 0], DOWN, buff=0.3)

        label_b = Text("b", font_size=36, color="#FCBA03")
        label_b.next_to([2, 0.3, 0], RIGHT, buff=0.3)

        label_c = Text("c", font_size=36, color="#FC6255")
        label_c.move_to([-0.3, 0.5, 0])

        self.play(
            AnimationGroup(
                Write(label_a),
                Write(label_b),
                Write(label_c),
                lag_ratio=0.3
            ),
            run_time=2
        )
        self.wait(1)

        # ===== ACT 3: SQUARES ON SIDES =====

        # Square on side a
        square_a = Square(
            side_length=1.6,
            color="#FCBA03",
            stroke_width=3,
            fill_opacity=0.3,
            fill_color="#FCBA03"
        )
        square_a.next_to(triangle, DOWN, buff=0)

        # Square on side b
        square_b = Square(
            side_length=1.2,
            color="#83C167",
            stroke_width=3,
            fill_opacity=0.3,
            fill_color="#83C167"
        )
        square_b.next_to(triangle, RIGHT, buff=0)

        # Grow squares
        self.play(
            GrowFromCenter(square_a),
            run_time=1.2
        )
        self.wait(0.5)

        self.play(
            GrowFromCenter(square_b),
            run_time=1.2
        )
        self.wait(1)

        # ===== ACT 4: THE BEAUTIFUL REVEAL =====

        # Pulse the squares
        self.play(
            square_a.animate.set_fill(opacity=0.5),
            square_b.animate.set_fill(opacity=0.5),
            rate_func=there_and_back,
            run_time=1.5
        )

        # Show the equation
        equation = Text(
            "a² + b²",
            font_size=48,
            color="#ECECEC"
        )
        equation.to_edge(DOWN).shift(UP * 0.5)

        self.play(Write(equation), run_time=1.5)
        self.wait(1)

        # Add equals c²
        equals_c = Text(
            " = c²",
            font_size=48,
            color="#FC6255"
        )
        equals_c.next_to(equation, RIGHT, buff=0.1)

        self.play(
            Write(equals_c),
            Indicate(label_c, color="#FC6255", scale_factor=1.3),
            run_time=1.5
        )
        self.wait(2)

        # ===== ACT 5: ELEGANT FINISH =====
        conclusion = Text(
            "Visual proof of Pythagoras",
            font_size=38,
            color="#58C4DD"
        )
        conclusion.to_edge(DOWN)

        self.play(
            FadeIn(conclusion, shift=UP * 0.3),
            run_time=1.5
        )
        self.wait(2.5)
```

---

## ✅ 3Blue1Brown Checklist

Every animation should have:

- [x] Dark background (#0C0D0F)
- [x] Signature color palette (Blue, Yellow, Red/Pink)
- [x] Progressive revelation (simple → complex)
- [x] Smooth, continuous motion (rate_func=smooth)
- [x] Hook with question or puzzle
- [x] Visual metaphors and intuition
- [x] "Aha!" moment reveal
- [x] Elegant annotations with arrows
- [x] Consistent stroke widths (1, 3, 5)
- [x] Perfect positioning
- [x] Pulsing/breathing effects
- [x] Layered complexity
- [x] Clean, minimal aesthetic
- [x] Satisfying conclusion

---

**Status**: ✅ **3BLUE1BROWN STYLE GUIDE COMPLETE**
**Version**: 6.0.0 - 3B1B Quality
**Inspiration**: Grant Sanderson's 3Blue1Brown
**Goal**: World-class mathematical animations
