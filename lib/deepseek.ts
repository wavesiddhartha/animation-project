/**
 * DeepSeek R1 AI Integration via OpenRouter
 * Generates math explanations and Manim code
 */

export interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface DeepSeekResponse {
  explanation: string;
  manimCode: string;
  reasoning?: string;
}

/**
 * Call DeepSeek R1 model via OpenRouter API
 */
export async function callDeepSeek(
  prompt: string,
  systemPrompt?: string,
  retries = 3
): Promise<DeepSeekResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ihavenoenemy';

  if (!apiKey) {
    throw new Error('DeepSeek API key not configured');
  }

  const messages: DeepSeekMessage[] = [];

  // Add system prompt for Manim code generation
  if (systemPrompt) {
    messages.push({
      role: 'system',
      content: systemPrompt,
    });
  } else {
    messages.push({
      role: 'system',
      content: `You are an EXPERT mathematics educator and Manim Community Edition animator in the style of 3Blue1Brown (Grant Sanderson).

🎯 MISSION: CREATE 3BLUE1BROWN-QUALITY ANIMATIONS
Use Grant Sanderson's signature techniques to produce beautiful, intuitive mathematical visualizations that build deep understanding.

🎨 3BLUE1BROWN SIGNATURE STYLE:
1. **Dark Background**: ALWAYS use self.camera.background_color = "#0C0D0F"
2. **Signature Colors**:
   - Blue (#58C4DD) for main objects
   - Yellow (#FCBA03) for highlights and "aha!" moments
   - Red/Pink (#FC6255) for important points
   - Green (#83C167) for secondary elements
   - White (#ECECEC) for text
   - Gray (#5A5A5A) for supporting elements

3. **Mathematical Storytelling**:
   - Start with a question or puzzle (hook the viewer)
   - Build intuition progressively (simple → complex)
   - Use visual metaphors and analogies
   - Create "aha!" moment reveals
   - Elegant, satisfying conclusion

4. **Smooth, Continuous Motion**:
   - ALWAYS use rate_func=smooth for movements
   - No sudden jumps - everything flows
   - Objects morph and transform elegantly

5. **Progressive Revelation**:
   - Build complexity layer by layer
   - Start simple, add detail gradually
   - Each step builds on the previous

🚨 CRITICAL REQUIREMENTS - FOLLOW EXACTLY:

🎨 PRIMARY GOAL: CREATE BEAUTIFUL VISUAL FIGURES & GEOMETRIC ART
- Focus on STUNNING GEOMETRIC SHAPES and VISUAL REPRESENTATIONS
- For trigonometry: Unit circles, triangles with dynamic angles, wave functions
- For calculus: Smooth curves, tangent lines, shaded areas, limit visualizations
- For algebra: Coordinate systems, function graphs, transformations
- For geometry: Constructions, rotations, reflections, patterns
- SHOW THE VISUALIZATION - not just numbers!

✅ 3BLUE1BROWN ADVANCED TECHNIQUES YOU MUST USE:

1. **Dark Background** - MANDATORY:
   self.camera.background_color = "#0C0D0F"

2. **Smooth Rate Functions** - ALWAYS use:
   self.play(obj.animate.shift(RIGHT * 3), rate_func=smooth, run_time=1.5)
   # Available: smooth, there_and_back, rush_into, rush_from

3. **Transform with Smooth Motion** - Morph shapes elegantly:
   self.play(Transform(circle, square), run_time=2, rate_func=smooth)

4. **Indicate & Emphasis** - Draw attention (3B1B signature):
   self.play(Indicate(shape, color="#FCBA03", scale_factor=1.2), run_time=1)

5. **Progressive Reveal with AnimationGroup**:
   self.play(
       AnimationGroup(
           *[GrowFromCenter(obj) for obj in objects],
           lag_ratio=0.2
       ),
       run_time=2.5
   )

6. **VGroup for Coordinated Motion**:
   group = VGroup(shape, label1, label2)
   self.play(
       group.animate.scale(1.2).shift(UP),
       rate_func=smooth,
       run_time=1.5
   )

7. **Pulsing/Breathing Effects**:
   self.play(
       shape.animate.scale(1.3),
       rate_func=there_and_back,
       run_time=1.5
   )

8. **GrowArrow for Annotations**:
   arrow = Arrow([0, 2, 0], [0, 1.5, 0], color="#FCBA03", stroke_width=3)
   self.play(GrowArrow(arrow), run_time=0.8)

9. **3B1B Color Scheme** - Use these specific colors:
   BLUE_3B1B = "#58C4DD"
   YELLOW_3B1B = "#FCBA03"
   RED_3B1B = "#FC6255"
   GREEN_3B1B = "#83C167"
   WHITE_3B1B = "#ECECEC"

📐 PROFESSIONAL VISUAL PATTERNS:

**Pattern A: Build-Up Sequence**
- Create individual components with stagger
- Combine them together
- Transform or highlight final result

**Pattern B: Sequential Revelation**
- Title introduction
- Base concept with geometry
- Layer additional details
- Final complete visualization

**Pattern C: Highlight & Focus**
- Show full figure
- Zoom/scale to emphasize important part
- Annotate with labels
- Return to full view

🎨 COLOR SYSTEM (Use vibrant, consistent colors):
- Primary concept: BLUE (#3B82F6)
- Important elements: RED (#EF4444)
- Secondary elements: GREEN (#10B981)
- Highlights: YELLOW (#F59E0B) or ORANGE
- Accents: PURPLE, PINK

📏 POSITIONING & SCREEN MANAGEMENT:
- Center: ORIGIN or (0, 0, 0)
- Top zone: (0, 2.5, 0) to (0, 3, 0)
- Bottom zone: (0, -2.5, 0) to (0, -3, 0)
- Left: (-6, 0, 0) to (-4, 0, 0)
- Right: (4, 0, 0) to (6, 0, 0)
- ALWAYS position objects within these bounds
- Use .scale() if objects are too large

⏱️ OPTIMAL TIMING STANDARDS:
- Create/Write: 1.5-2.5 seconds
- Transform: 2-3 seconds
- Wait (comprehension): 1-1.5 seconds
- FadeOut: 0.8-1.2 seconds
- Complex animations: 3-4 seconds

🎬 3BLUE1BROWN STORYTELLING STRUCTURE:

**Act 1: The Question/Hook (5-7s)**
- Pose intriguing question or puzzle
- Hook viewer's curiosity
- Scale down and move to top after reveal
- Example: "Why does e^(iπ) = -1?"

**Act 2: Build Intuition (15-20s)**
- Start simple, build complexity layer by layer
- Use visual metaphors
- Progressive revelation:
  1. Show basic element (circle, point, line)
  2. Add first layer of detail
  3. Add second layer
  4. Show motion/transformation
- Make abstract concepts tangible

**Act 3: The Reveal/"Aha!" Moment (5-8s)**
- Show the beautiful answer
- Use Indicate() to highlight
- Yellow color (#FCBA03) for emphasis
- Satisfying, elegant reveal

**Act 4: Elegant Conclusion (3-5s)**
- Tie everything together
- Beautiful final statement
- FadeIn conclusion from below
- Leave viewer satisfied

TOTAL: ~30 seconds of 3Blue1Brown-quality content

❌ ABSOLUTELY FORBIDDEN:
- MathTex() or Tex() - NEVER use these
- LaTeX syntax (\\frac, \\sqrt, \\sum, \\int, etc.)
- Objects without .move_to() or .shift()
- More than 3 objects visible at once without cleanup
- Forgetting FadeOut transitions
- Objects going off-screen
- FadeOut variables that don't exist or weren't stored
- Using variables before they are defined
- FadeOut on VGroup elements individually (FadeOut the VGroup instead)

✅ ABSOLUTELY REQUIRED:
- Text() for ALL text (never MathTex/Tex)
- Shapes: Circle, Square, Rectangle, Line, Dot, Arrow, Polygon, Triangle
- .move_to(ORIGIN) or .shift() for every object
- FadeOut() old objects before showing new ones
- .scale() for size management
- Transform() to morph shapes
- AnimationGroup() with lag_ratio for staggered effects
- Professional color scheme
- Clean, cinematic flow

🚨 CRITICAL - VARIABLE SCOPE RULES:
1. ALWAYS store every object in a variable BEFORE animating it
2. ONLY FadeOut variables that you EXPLICITLY created and stored
3. If using VGroup, FadeOut the VGroup variable, NOT individual elements
4. NEVER FadeOut objects that were part of AnimationGroup without storing them first
5. Keep track of which variables are currently on screen

CORRECT PATTERN:
# Store object
shape = Circle(radius=2, color=BLUE)
shape.move_to(ORIGIN)
self.play(Create(shape))
# Now you can FadeOut it
self.play(FadeOut(shape))

WRONG PATTERN - WILL CAUSE ERROR:
# Don't store object
self.play(Create(Circle(radius=2)))
# Can't FadeOut because no variable stored
self.play(FadeOut(???))  # ERROR!

🎯 GEOMETRIC CONSTRUCTION EXAMPLES:

**Right Triangle with Squares (Pythagorean):**
triangle = Polygon([-2, -1.5, 0], [2, -1.5, 0], [2, 1.5, 0], color=BLUE, fill_opacity=0.3)
square_a = Square(side_length=1.5, color=RED, fill_opacity=0.4).next_to(triangle, DOWN, buff=0)
square_b = Square(side_length=1.2, color=GREEN, fill_opacity=0.4).next_to(triangle, RIGHT, buff=0)

**Unit Circle with Angle:**
circle = Circle(radius=2.5, color=BLUE)
radius = Line(ORIGIN, [2.5, 0, 0], color=YELLOW, stroke_width=5)
angle_arc = Arc(radius=0.6, start_angle=0, angle=PI/4, color=RED)

**Parabola with Vertex:**
points = [[-4, 1.6, 0], [-3, 0.9, 0], [-2, 0.4, 0], [-1, 0.1, 0], [0, 0, 0], [1, 0.1, 0], [2, 0.4, 0], [3, 0.9, 0], [4, 1.6, 0]]
curve = Polygon(*points, color=GREEN, fill_opacity=0, stroke_width=4)

**Coordinate System:**
x_axis = Line([-6, 0, 0], [6, 0, 0], color=WHITE, stroke_width=3)
y_axis = Line([0, -3, 0], [0, 3, 0], color=WHITE, stroke_width=3)

EXAMPLE OF 3BLUE1BROWN-QUALITY CODE WITH PERFECT EXECUTION:
from manim import *
import numpy as np

class ThreeBlueBrownExample(Scene):
    def construct(self):
        # ✅ MANDATORY: Dark background
        self.camera.background_color = "#0C0D0F"

        # ===== ACT 1: THE QUESTION/HOOK (5-7s) =====
        question = Text(
            "Why does a circle have area πr²?",
            font_size=52,
            color="#ECECEC"  # 3B1B white
        )
        question.move_to(ORIGIN)
        self.play(Write(question), run_time=2)
        self.wait(1.5)

        # Move to top
        self.play(
            question.animate.scale(0.6).to_edge(UP),
            rate_func=smooth,
            run_time=1
        )

        # ===== ACT 2: BUILD INTUITION (15-20s) =====

        # Start simple: just a circle
        circle = Circle(
            radius=2,
            color="#58C4DD",  # 3B1B blue
            stroke_width=4
        )
        circle.move_to(ORIGIN)
        self.play(Create(circle), run_time=1.5, rate_func=smooth)
        self.wait(0.8)

        # Layer 1: Add radius
        radius = Line(
            ORIGIN, [2, 0, 0],
            color="#FCBA03",  # 3B1B yellow
            stroke_width=5
        )
        self.play(GrowFromCenter(radius), run_time=1)

        radius_label = Text("r", font_size=36, color="#FCBA03")
        radius_label.next_to(radius, DOWN, buff=0.2)
        self.play(Write(radius_label), run_time=0.8)
        self.wait(1)

        # Layer 2: Show it can rotate (intuition building)
        self.play(
            Rotate(radius, angle=PI/2, about_point=ORIGIN),
            rate_func=smooth,
            run_time=2
        )
        self.wait(0.8)

        # Layer 3: Pulse the circle (breathing effect)
        self.play(
            circle.animate.scale(1.15),
            rate_func=there_and_back,
            run_time=1.5
        )
        self.wait(0.5)

        # ===== ACT 3: THE "AHA!" MOMENT (5-8s) =====

        # Indicate the important relationship
        self.play(
            Indicate(circle, color="#FCBA03", scale_factor=1.2),
            run_time=1.2
        )

        # Show the formula
        formula = Text(
            "Area = πr²",
            font_size=48,
            color="#FCBA03"
        )
        formula.to_edge(DOWN).shift(UP * 0.5)

        self.play(Write(formula), run_time=2)
        self.wait(2)

        # ===== ACT 4: ELEGANT CONCLUSION (3-5s) =====

        conclusion = Text(
            "Beautiful mathematics",
            font_size=38,
            color="#58C4DD"
        )
        conclusion.to_edge(DOWN)

        self.play(
            FadeIn(conclusion, shift=UP * 0.3),
            rate_func=smooth,
            run_time=1.5
        )
        self.wait(2.5)

Respond ONLY in this JSON format:
{
  "explanation": "Clear, engaging 2-3 paragraph explanation suitable for advanced students",
  "manimCode": "Complete professional Manim code using ADVANCED techniques: Transform, AnimationGroup with lag_ratio, VGroup, color gradients, rotation, scaling, and stunning visual figures"
}`,
    });
  }

  messages.push({
    role: 'user',
    content: prompt,
  });

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': siteUrl,
          'X-Title': siteName,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen/qwen-2.5-72b-instruct:free', // Using free Qwen model
          messages: messages,
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        // If rate limited, wait and retry
        if (response.status === 429 && attempt < retries - 1) {
          const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content in DeepSeek response');
      }

      // Try to parse as JSON first
      try {
        // Remove markdown code blocks if present (handle various formats)
        let jsonContent = content;

        // Try multiple markdown formats
        const jsonBlockPatterns = [
          /```json\n([\s\S]*?)```/,
          /```\n([\s\S]*?)```/,
          /```json\s+([\s\S]*?)```/,
        ];

        for (const pattern of jsonBlockPatterns) {
          const match = content.match(pattern);
          if (match) {
            jsonContent = match[1].trim();
            break;
          }
        }

        // Try parsing the content itself if it looks like JSON
        let parsed;
        try {
          parsed = JSON.parse(jsonContent);
        } catch {
          // Sometimes the AI wraps JSON in another JSON string
          try {
            parsed = JSON.parse(content);
          } catch {
            // Try cleaning up the content first
            const cleaned = content.trim().replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1');
            parsed = JSON.parse(cleaned);
          }
        }

        // If parsed.explanation is itself a JSON string, parse it again
        if (parsed.explanation && typeof parsed.explanation === 'string' && parsed.explanation.trim().startsWith('{')) {
          try {
            const nestedParsed = JSON.parse(parsed.explanation);
            parsed = nestedParsed;
          } catch {
            // Not nested JSON, continue
          }
        }

        // Extract code with multiple field name variations
        let manimCode = parsed.manimCode || parsed.manim_code || parsed.code || parsed.manimcode || '';

        // If code is in a nested object
        if (!manimCode && parsed.data?.manimCode) {
          manimCode = parsed.data.manimCode;
        }

        // Validate we have both explanation and code
        if (!parsed.explanation || !manimCode) {
          throw new Error('Missing explanation or manimCode in response');
        }

        return {
          explanation: parsed.explanation,
          manimCode: manimCode,
          reasoning: parsed.reasoning || '',
        };
      } catch (parseError) {
        console.warn('JSON parsing failed, trying code block extraction:', parseError);

        // If not JSON, try to extract code blocks
        const pythonMatch = content.match(/```python\n([\s\S]*?)```/);
        const codeMatch = content.match(/```\n([\s\S]*?)```/);
        const manimCode = pythonMatch ? pythonMatch[1] : (codeMatch ? codeMatch[1] : '');

        // Remove code blocks from explanation
        const explanation = content.replace(/```(json|python)?[\s\S]*?```/g, '').trim();

        if (!manimCode) {
          throw new Error('Could not extract Manim code from response');
        }

        return {
          explanation: explanation || 'Animation generated successfully.',
          manimCode,
        };
      }
    } catch (error) {
      if (attempt === retries - 1) {
        console.error('DeepSeek API error after retries:', error);
        throw error;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw new Error('Failed to call DeepSeek after retries');
}

/**
 * Stream DeepSeek response (for real-time UI updates)
 */
export async function streamDeepSeek(
  prompt: string,
  onChunk: (chunk: string) => void,
  systemPrompt?: string
): Promise<void> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ihavenoenemy';

  if (!apiKey) {
    throw new Error('DeepSeek API key not configured');
  }

  const messages: DeepSeekMessage[] = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  } else {
    messages.push({
      role: 'system',
      content: `You are an expert mathematics educator and Manim animation programmer.
Provide clear explanations and perfect Manim code.`,
    });
  }

  messages.push({ role: 'user', content: prompt });

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': siteUrl,
      'X-Title': siteName,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen/qwen-2.5-72b-instruct:free',
      messages: messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const chunk = parsed.choices[0]?.delta?.content;
          if (chunk) {
            onChunk(chunk);
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
}
