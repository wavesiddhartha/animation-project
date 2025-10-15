# Visualization Focus - Geometric & Visual Representations

## 🎨 Primary Goal

**Show visual figures, drawings, and geometric representations - NOT just numerical calculations!**

The main goal is to give users **VISUALIZATION** through:
- Geometric shapes
- Drawings
- Figures
- Graphs
- Visual constructions

---

## Topic-Specific Visual Requirements

### 1. **Trigonometry** 📐

**What to show:**
- ✅ Right triangles with labeled sides (a, b, c)
- ✅ Unit circles with angles marked
- ✅ Sine/cosine waves as curves
- ✅ Angles drawn as arcs or lines
- ✅ Visual representations of trig ratios

**What NOT to show:**
- ❌ Just numbers: "sin(30°) = 0.5"
- ❌ Pure text explanations without figures

**Example visualization:**
```python
# Draw right triangle with angle
triangle = Polygon(
    [-2, -1.5, 0], [2, -1.5, 0], [2, 1.5, 0],
    color=BLUE, fill_opacity=0.3
)

# Label sides
label_opp = Text("opposite", font_size=28, color=YELLOW)
label_adj = Text("adjacent", font_size=28, color=GREEN)
label_hyp = Text("hypotenuse", font_size=28, color=RED)
```

---

### 2. **Calculus** 📊

**What to show:**
- ✅ Curves/functions drawn as graphs
- ✅ Tangent lines touching curves
- ✅ Areas under curves (shaded regions)
- ✅ Coordinate axes (x and y)
- ✅ Points on curves marked with dots
- ✅ Slopes visualized as lines

**What NOT to show:**
- ❌ Just derivative formulas: "f'(x) = 2x"
- ❌ Numerical limits without visual approach

**Example visualization:**
```python
# Draw coordinate axes
x_axis = Line([-6, 0, 0], [6, 0, 0], color=WHITE)
y_axis = Line([0, -3, 0], [0, 3, 0], color=WHITE)

# Draw curve (parabola approximation)
curve = Polygon(
    [-3, 2, 0], [-2, 0.5, 0], [-1, 0, 0],
    [0, 0, 0], [1, 0, 0], [2, 0.5, 0], [3, 2, 0],
    color=BLUE, fill_opacity=0
)

# Draw tangent line at a point
tangent = Line([-2, -1, 0], [2, 1, 0], color=RED)

# Mark the point of tangency
point = Dot([0, 0, 0], color=YELLOW)
```

---

### 3. **Algebra/Functions** 📈

**What to show:**
- ✅ Coordinate grids/axes
- ✅ Function graphs drawn as lines or curves
- ✅ Points plotted on graphs
- ✅ Intercepts marked clearly
- ✅ Geometric interpretation of equations

**What NOT to show:**
- ❌ Just solving: "x = 5"
- ❌ Algebraic manipulation without visual meaning

**Example visualization:**
```python
# Draw linear function y = 2x + 1
x_axis = Line([-6, 0, 0], [6, 0, 0], color=WHITE)
y_axis = Line([0, -3, 0], [0, 3, 0], color=WHITE)

# Line representing function
line = Line([-3, -5, 0], [3, 7, 0], color=GREEN)

# Y-intercept
intercept = Dot([0, 1, 0], color=RED)
label = Text("y-intercept", font_size=24, color=RED)
label.next_to(intercept, RIGHT)
```

---

### 4. **Geometry** 🔷

**What to show:**
- ✅ Geometric constructions (compass & straightedge style)
- ✅ Shapes: triangles, circles, polygons
- ✅ Transformations: rotations, reflections, translations
- ✅ Angle measurements visualized
- ✅ Congruent/similar shapes side-by-side

**What NOT to show:**
- ❌ Just formulas: "Area = base × height"
- ❌ Text descriptions without shapes

**Example visualization:**
```python
# Draw two congruent triangles
triangle1 = Polygon(
    [-4, -1, 0], [-2, -1, 0], [-3, 1, 0],
    color=BLUE, fill_opacity=0.5
)

triangle2 = Polygon(
    [2, -1, 0], [4, -1, 0], [3, 1, 0],
    color=RED, fill_opacity=0.5
)

# Arrow showing transformation
arrow = Arrow([-1.5, 0, 0], [1.5, 0, 0], color=YELLOW)
```

---

## Technical Implementation

### Using Polygon() for Custom Shapes

**Right Triangle:**
```python
right_triangle = Polygon(
    [0, 0, 0],     # Bottom-left (right angle)
    [3, 0, 0],     # Bottom-right
    [0, 2, 0],     # Top-left
    color=BLUE, fill_opacity=0.3
)
right_triangle.move_to(ORIGIN)
```

**Isosceles Triangle:**
```python
iso_triangle = Polygon(
    [-2, -1, 0],   # Bottom-left
    [2, -1, 0],    # Bottom-right
    [0, 1.5, 0],   # Top (peak)
    color=GREEN, fill_opacity=0.3
)
```

---

### Using Line() for Graphs & Axes

**Coordinate Axes:**
```python
# X-axis
x_axis = Line([-6, 0, 0], [6, 0, 0], color=WHITE)

# Y-axis
y_axis = Line([0, -3, 0], [0, 3, 0], color=WHITE)

# Arrow tips (optional)
x_arrow = Arrow([-6, 0, 0], [6, 0, 0], color=WHITE, buff=0)
```

**Graph of Function:**
```python
# Approximate curve using connected points
points = [
    [-4, 1, 0], [-3, 0.5, 0], [-2, 0, 0],
    [-1, -0.5, 0], [0, 0, 0], [1, 0.5, 0],
    [2, 1, 0], [3, 1.5, 0], [4, 2, 0]
]

# Connect with Polygon (no fill) or multiple Lines
curve = Polygon(*points, color=BLUE, fill_opacity=0)
```

---

### Using Circle() for Circular Figures

**Unit Circle:**
```python
unit_circle = Circle(radius=2, color=BLUE)
unit_circle.move_to(ORIGIN)

# Add angle line
angle_line = Line(ORIGIN, [2, 0, 0], color=YELLOW)

# Add arc (small circle) for angle
angle_arc = Arc(
    radius=0.5, start_angle=0, angle=PI/4,
    color=RED
)
```

---

### Using Dot() for Points

**Mark Important Points:**
```python
# Origin
origin = Dot(ORIGIN, color=WHITE)

# Point on graph
point = Dot([2, 3, 0], color=RED)

# Label the point
label = Text("(2, 3)", font_size=24, color=RED)
label.next_to(point, UP + RIGHT)
```

---

## Animation Flow for Visual Topics

### Example: "Explain Sine Function"

```python
from manim import *

class SineExplanation(Scene):
    def construct(self):
        # 1. Title
        title = Text("Sine Function", font_size=48)
        title.move_to(ORIGIN)
        self.play(Write(title), run_time=2)
        self.wait(1)
        self.play(FadeOut(title))

        # 2. VISUAL - Unit circle with angle
        circle = Circle(radius=2, color=BLUE)
        circle.move_to(ORIGIN)

        radius = Line(ORIGIN, [2, 0, 0], color=YELLOW)

        label = Text("Unit Circle", font_size=32, color=WHITE)
        label.next_to(circle, UP)

        self.play(Create(circle), Create(radius))
        self.play(Write(label))
        self.wait(2)
        self.play(FadeOut(circle), FadeOut(radius), FadeOut(label))

        # 3. VISUAL - Sine wave graph
        x_axis = Line([-6, 0, 0], [6, 0, 0], color=WHITE)
        y_axis = Line([0, -3, 0], [0, 3, 0], color=WHITE)

        # Sine wave approximation
        sine_wave = Polygon(
            [-6, 0, 0], [-5, 1.5, 0], [-4, 0, 0],
            [-3, -1.5, 0], [-2, 0, 0], [-1, 1.5, 0],
            [0, 0, 0], [1, -1.5, 0], [2, 0, 0],
            [3, 1.5, 0], [4, 0, 0], [5, -1.5, 0],
            [6, 0, 0],
            color=GREEN, fill_opacity=0
        )

        wave_label = Text("y = sin(x)", font_size=32, color=GREEN)
        wave_label.move_to([0, 2.5, 0])

        self.play(Create(x_axis), Create(y_axis))
        self.play(Create(sine_wave))
        self.play(Write(wave_label))
        self.wait(3)
```

---

## Key Differences: Before vs After

### ❌ BEFORE (Just Numbers):
```python
# Poor - just text, no visualization
title = Text("sin(30°) = 0.5", font_size=40)
self.play(Write(title))
self.wait(2)

explanation = Text("The sine of 30 degrees equals 0.5", font_size=30)
self.play(Write(explanation))
```

### ✅ AFTER (Visual Figures):
```python
# Good - shows geometric figure
triangle = Polygon(
    [0, 0, 0], [3, 0, 0], [3, 1.5, 0],
    color=BLUE, fill_opacity=0.3
)

angle_label = Text("30°", font_size=28, color=YELLOW)
angle_label.move_to([0.5, 0.2, 0])

opposite = Text("0.5", font_size=24, color=RED)
opposite.next_to(triangle, RIGHT)

hypotenuse = Text("1", font_size=24, color=GREEN)
hypotenuse.move_to([1.5, 1, 0])

self.play(Create(triangle))
self.play(Write(angle_label), Write(opposite), Write(hypotenuse))
self.wait(3)
```

---

## Updated AI Instructions Summary

**The AI now receives:**

1. **Primary goal:** CREATE VISUAL FIGURES & DRAWINGS
2. **Specific examples for each topic:**
   - Trigonometry → triangles, circles, angles
   - Calculus → curves, slopes, areas
   - Algebra → graphs, axes, functions
   - Geometry → constructions, shapes, transformations

3. **Tools to use:**
   - `Polygon()` for triangles and custom shapes
   - `Line()` for axes, graphs, and constructions
   - `Circle()` for circles and arcs
   - `Dot()` for marking points
   - `Arrow()` for directions and vectors

4. **What to AVOID:**
   - Just showing numerical calculations
   - Text-only explanations
   - Missing geometric representations

---

## Expected Results

**For "Explain trigonometry":**
- ✅ Draw right triangle with labeled sides
- ✅ Show unit circle with angle marked
- ✅ Display sine curve as wave

**For "Explain derivatives":**
- ✅ Draw function curve
- ✅ Draw tangent line touching curve
- ✅ Mark point of tangency with dot
- ✅ Show slope visually

**For "Explain quadratic functions":**
- ✅ Draw parabola (curve)
- ✅ Draw coordinate axes
- ✅ Mark vertex with dot
- ✅ Show roots/intercepts

---

## Testing Checklist

- [ ] Trigonometry topics show triangles/circles
- [ ] Calculus topics show curves/graphs
- [ ] Algebra topics show coordinate axes and functions
- [ ] Geometry topics show geometric constructions
- [ ] All figures are properly positioned on-screen
- [ ] No pure numerical calculations without visuals
- [ ] Clean transitions between visual concepts

---

**Status:** ✅ **IMPLEMENTED**
**Version:** 4.0.0 - Visualization Enhanced
**Last Updated:** October 15, 2025
