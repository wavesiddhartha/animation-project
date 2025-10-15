import { NextRequest, NextResponse } from 'next/server';
import { callDeepSeek } from '@/lib/deepseek';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, difficulty = 'intermediate' } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Create 3BLUE1BROWN-QUALITY prompt
    const prompt = `Create a 3BLUE1BROWN-QUALITY math animation for: "${topic}"

🎯 GOAL: Match Grant Sanderson's (3Blue1Brown) signature style!

Difficulty level: ${difficulty} (deep, intuitive visualization)

🎨 3BLUE1BROWN REQUIREMENTS:

1. **MANDATORY Dark Background**:
   self.camera.background_color = "#0C0D0F"

2. **3B1B Signature Colors** (use EXACTLY these hex codes):
   - Blue: "#58C4DD" for main objects
   - Yellow: "#FCBA03" for highlights and "aha!" moments
   - Red/Pink: "#FC6255" for important points
   - Green: "#83C167" for secondary elements
   - White: "#ECECEC" for text
   - Gray: "#5A5A5A" for supporting elements

3. **Mathematical Storytelling** (Grant Sanderson's approach):
   - Act 1: Start with intriguing question/puzzle (hook)
   - Act 2: Build intuition progressively (simple → complex)
   - Act 3: "Aha!" moment reveal (use Indicate with yellow)
   - Act 4: Elegant, satisfying conclusion

4. **Smooth, Continuous Motion**:
   - ALWAYS use rate_func=smooth for movements
   - No sudden jumps - everything flows elegantly
   - Objects morph and transform smoothly

5. **Progressive Revelation**:
   - Build complexity layer by layer
   - Start simple, add detail gradually
   - Use visual metaphors and analogies
   - Make abstract concepts tangible

🚀 3BLUE1BROWN SPECIFIC TECHNIQUES TO USE:

1. **Dark Background** (MANDATORY - first line after def construct):
   self.camera.background_color = "#0C0D0F"

2. **Smooth Rate Functions** (ALWAYS add rate_func=smooth):
   self.play(obj.animate.shift(RIGHT * 3), rate_func=smooth, run_time=1.5)

3. **Indicate for Emphasis** (3B1B signature move):
   self.play(Indicate(shape, color="#FCBA03", scale_factor=1.2), run_time=1)

4. **Pulsing/Breathing Effects**:
   self.play(
       shape.animate.scale(1.15),
       rate_func=there_and_back,
       run_time=1.5
   )

5. **GrowFromCenter & GrowArrow** (smoother than Create):
   self.play(GrowFromCenter(dot), run_time=0.8)
   self.play(GrowArrow(arrow), run_time=0.8)

6. **Progressive AnimationGroup**:
   self.play(
       AnimationGroup(
           *[GrowFromCenter(obj) for obj in objects],
           lag_ratio=0.2
       ),
       run_time=2.5
   )

7. **Transform with Smooth Motion**:
   self.play(Transform(circle, square), rate_func=smooth, run_time=2)

8. **Rotate Around Point**:
   self.play(
       Rotate(radius, angle=PI/2, about_point=ORIGIN),
       rate_func=smooth,
       run_time=2
   )

9. **Coordinated Group Motion**:
   group = VGroup(shape, label1, label2)
   self.play(
       group.animate.scale(1.2).shift(UP),
       rate_func=smooth,
       run_time=1.5
   )

📐 3BLUE1BROWN STORYTELLING STRUCTURE (Grant Sanderson's approach):

**Act 1: The Question/Hook (5-7s)**
- Pose intriguing question or puzzle
- Hook viewer's curiosity
- Example: "Why does e^(iπ) = -1?"
- Scale down and move to top after reveal:
  question.animate.scale(0.6).to_edge(UP)

**Act 2: Build Intuition (15-20s)**
- Start simple, build complexity layer by layer
- Progressive revelation:
  1. Show basic element (circle, point, line)
  2. Add first layer of detail (labels, annotations)
  3. Add second layer (motion, transformation)
  4. Show dynamic behavior (rotation, pulsing)
- Use visual metaphors to make abstract tangible
- Smooth, continuous motion throughout

**Act 3: The "Aha!" Moment (5-8s)**
- Show the beautiful answer/reveal
- Use Indicate() with yellow (#FCBA03) for emphasis
- Satisfying, elegant reveal
- Example: self.play(Indicate(shape, color="#FCBA03"))

**Act 4: Elegant Conclusion (3-5s)**
- Tie everything together
- Beautiful final statement
- FadeIn from below: FadeIn(conclusion, shift=UP * 0.3)
- Leave viewer satisfied and enlightened

🎨 COLOR PALETTE (Use these vibrant colors):
- Primary: BLUE, RED, GREEN
- Highlights: YELLOW, ORANGE
- Accents: PURPLE, PINK
- Background elements: WHITE, GRAY

⏱️ OPTIMAL TIMING:
- Create/Write: 1.5-2.5s
- Transform: 2-3s
- Wait: 1-1.5s
- FadeOut: 0.8-1.2s
- Complex animations: 3-4s

📏 POSITIONING (Keep ALL objects within bounds):
- Center: ORIGIN or (0, 0, 0)
- Top: (0, 2.5, 0)
- Bottom: (0, -2.5, 0)
- Left: (-5, 0, 0)
- Right: (5, 0, 0)

✅ MUST USE (Advanced techniques):
- Transform() for shape morphing
- AnimationGroup() with lag_ratio for staggered effects
- VGroup() for grouping related objects
- .set_fill() and .set_stroke() for color styling
- Rotate() for dynamic rotations
- .animate.scale() for smooth scaling
- Multiple simultaneous animations with self.play()

✅ REQUIRED (Technical):
- Text() for all text (NEVER MathTex/Tex)
- Shapes: Circle, Square, Rectangle, Line, Dot, Arrow, Polygon, Triangle
- .move_to() or .shift() for positioning
- FadeOut() before new content
- .scale() for size management
- Vibrant professional colors

❌ FORBIDDEN:
- MathTex() or Tex()
- LaTeX syntax (\\frac, \\sqrt, etc.)
- Objects without positioning
- More than 3 objects without cleanup
- Static, boring animations (use Transform, rotation, scaling!)
- FadeOut on variables that don't exist or weren't stored
- Using variables before defining them
- FadeOut on VGroup elements individually (FadeOut the VGroup instead)

🚨 CRITICAL - PREVENT "Animation only works on Mobjects" ERROR:
1. ALWAYS store every object in a variable BEFORE animating
2. ONLY FadeOut variables that YOU created and stored
3. If using VGroup, FadeOut the VGroup, NOT individual elements
4. Keep track of which variables are on screen

CORRECT EXAMPLE:
shape = Circle(radius=2, color=BLUE)  # Store first
shape.move_to(ORIGIN)
self.play(Create(shape))              # Now animate
self.play(FadeOut(shape))             # Can FadeOut stored variable

WRONG EXAMPLE - CAUSES ERROR:
self.play(Create(Circle(radius=2)))   # No variable stored
self.play(FadeOut(???))               # ERROR: Nothing to FadeOut!

🎯 VISUAL CONSTRUCTION TEMPLATES:

**Trigonometry - Unit Circle:**
circle = Circle(radius=2.5, color=BLUE)
radius = Line(ORIGIN, [2.5, 0, 0], color=YELLOW, stroke_width=5)
angle_arc = Arc(radius=0.6, start_angle=0, angle=PI/4, color=RED)

**Calculus - Curve with Tangent:**
points = [[-4, 1.6, 0], [-3, 0.9, 0], [-2, 0.4, 0], [-1, 0.1, 0], [0, 0, 0], [1, 0.1, 0], [2, 0.4, 0], [3, 0.9, 0], [4, 1.6, 0]]
curve = Polygon(*points, color=GREEN, fill_opacity=0, stroke_width=4)
tangent = Line([-2, -0.5, 0], [2, 0.5, 0], color=RED, stroke_width=4)

**Geometry - Triangle with Construction:**
triangle = Polygon([-2, -1.5, 0], [2, -1.5, 0], [0, 2, 0], color=BLUE, fill_opacity=0.3)
sides = [
    Line([-2, -1.5, 0], [2, -1.5, 0], color=YELLOW, stroke_width=4),
    Line([2, -1.5, 0], [0, 2, 0], color=YELLOW, stroke_width=4),
    Line([0, 2, 0], [-2, -1.5, 0], color=YELLOW, stroke_width=4)
]

Return in this EXACT JSON format:
{
  "explanation": "Comprehensive, engaging 2-3 paragraph explanation for ${difficulty} level students",
  "manimCode": "Complete ADVANCED Manim code using: Transform, AnimationGroup with lag_ratio, VGroup, color gradients, rotation, scaling, and stunning visual figures. Must be cinematic and professional!"
}`;

    // Use system prompt that enforces simple shapes only
    const systemPrompt = `You are an expert mathematics educator and Manim Community Edition animator.

🚨 CRITICAL REQUIREMENTS - FOLLOW EXACTLY:

1. NEVER use MathTex() or Tex() - ONLY use Text()
2. NEVER use LaTeX syntax (\\frac, \\sqrt, etc.)
3. ONLY use simple shapes: Circle, Square, Rectangle, Line, Dot, Arrow, Polygon
4. ALWAYS store objects in variables before animating
5. ALWAYS remove old objects before adding new ones (use FadeOut)
6. Keep screen clean - maximum 2-3 objects visible at once
7. ALWAYS use .move_to() or .shift() to position objects on screen
8. NEVER let objects go outside screen bounds
9. Use .scale() to ensure objects fit on screen
10. Professional pacing: Write (2s) → Wait (1s) → FadeOut (1s) → Next object

📐 SCREEN POSITIONING RULES:
- Screen center: ORIGIN or (0, 0, 0)
- Top: UP * 3 or (0, 3, 0)
- Bottom: DOWN * 3 or (0, -3, 0)
- Left: LEFT * 6 or (-6, 0, 0)
- Right: RIGHT * 6 or (6, 0, 0)
- ALWAYS keep objects within these bounds

🎬 PROFESSIONAL ANIMATION FLOW:
1. Show title → Wait → Remove title
2. Show concept 1 → Wait → Remove concept 1
3. Show concept 2 → Wait → Remove concept 2
4. Show conclusion → Wait → End
- NEVER show more than 2-3 objects at once
- ALWAYS clean up before showing next concept

❌ FORBIDDEN:
- MathTex() or Tex()
- LaTeX commands
- Objects without position (will go off-screen)
- More than 3 objects visible at once
- Forgetting to FadeOut old objects

✅ REQUIRED:
- Text() for all text
- .move_to(ORIGIN) or .shift() for positioning
- FadeOut() before showing new content
- .scale(0.8) if object is too large
- Clean, professional transitions

EXAMPLE PROFESSIONAL CODE WITH VISUAL FIGURES:
from manim import *

class ExampleScene(Scene):
    def construct(self):
        # Step 1: Title (then remove)
        title = Text("Pythagorean Theorem", font_size=48, color=WHITE)
        title.move_to(ORIGIN)
        self.play(Write(title), run_time=2)
        self.wait(1)
        self.play(FadeOut(title))  # Clean up!

        # Step 2: VISUAL FIGURE - Draw right triangle
        triangle = Polygon(
            [-2, -1.5, 0], [2, -1.5, 0], [2, 1.5, 0],
            color=BLUE, fill_opacity=0.3
        )
        triangle.move_to(ORIGIN)

        label_a = Text("a", font_size=32, color=YELLOW)
        label_a.next_to(triangle, DOWN)
        label_b = Text("b", font_size=32, color=YELLOW)
        label_b.next_to(triangle, RIGHT)
        label_c = Text("c", font_size=32, color=RED)
        label_c.move_to([-0.5, 0.5, 0])

        self.play(Create(triangle))
        self.play(Write(label_a), Write(label_b), Write(label_c))
        self.wait(2)
        self.play(FadeOut(triangle), FadeOut(label_a), FadeOut(label_b), FadeOut(label_c))

        # Step 3: Formula
        formula = Text("a squared + b squared = c squared", font_size=36, color=GREEN)
        formula.move_to(ORIGIN)
        self.play(Write(formula))
        self.wait(2)

Respond ONLY in this JSON format:
{
  "explanation": "Clear 2-3 paragraph explanation",
  "manimCode": "Complete working Manim code using ONLY Text and simple shapes"
}`;

    const result = await callDeepSeek(prompt, systemPrompt);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate content',
      },
      { status: 500 }
    );
  }
}
