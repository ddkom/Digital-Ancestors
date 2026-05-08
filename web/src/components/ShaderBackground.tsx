import { useEffect, useRef } from "react";
import p5 from "p5";

/* `#version 300 es` MUST be the first byte of each shader source — no leading whitespace. */
const VERT = `#version 300 es
precision highp float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

in vec3 aPosition;
in vec3 aNormal;
in vec2 aTexCoord;
in vec4 aVertexColor;

out vec3 var_vertPos;
out vec4 var_vertCol;
out vec3 var_vertNormal;
out vec2 var_vertTexCoord;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
  var_vertPos = aPosition;
  var_vertCol = aVertexColor;
  var_vertNormal = aNormal;
  var_vertTexCoord = aTexCoord;
}
`;

const FRAG = `#version 300 es
// Author Pierre MARZIN 01/2017 — adapted to WebGL2 / GLSL ES 3.00
precision mediump float;

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;
uniform int noctaves;
uniform float c[22];

/* Editable palette — set from React with hex colors. */
uniform vec3 uColorDeep;      // shadowy/cool foundation
uniform vec3 uColorLight;     // bright midtone
uniform vec3 uColorAccent;    // warm accent flares
uniform vec3 uColorHighlight; // soft top highlight wash

in vec3 var_vertPos;
in vec4 var_vertCol;
in vec3 var_vertNormal;
in vec2 var_vertTexCoord;

out vec4 fragColor;

float noise(in vec2 x) {
  return sin(1.5 * x.x) * sin(1.5 * x.y);
}

const mat2 rot = mat2(0.80, 0.6, -0.6, 0.8);

float fbm(in vec2 _st) {
  float v = 0.0;
  float a = 0.6;
  vec2 shift = 10.0 * vec2(c[11], c[12]);
  for (int i = 0; i < 12; ++i) {
    if (i >= noctaves) break;
    v += a * noise(_st);
    _st = rot * _st * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 mouse = iMouse / iResolution;
  vec2 st = (-iResolution.xy + 2.0 * gl_FragCoord.xy) / iResolution.y;

  /* fbm field — same noise structure as the original sketch. */
  vec2 q = vec2(0.0);
  q.x = fbm(st + vec2(c[0], c[1] * .01 * iTime));
  q.y = fbm(st + vec2(c[2], c[3]));
  vec2 r = vec2(0.0);
  r.x = fbm(st + (3.0 * mouse.x + 0.4) * q + vec2(c[5], c[6]));
  r.y = fbm(st + (6.0 * mouse.y + 0.5) * q * sin(.01 * iTime) + vec2(c[8] * .05 * iTime, c[9]));
  float f = fbm(st + c[10] * (r + length(q)));

  /*
    Every color below is a blend of the palette uniforms.
    Time only modulates the AMOUNT of each blend (scalar tAccent / tSecondary),
    never the hue, so setting all four palette entries to the same color yields
    a uniform field of that color.
  */
  float ridge = clamp(0.5 + 0.5 * f, 0.0, 1.0);
  vec3 color = mix(uColorDeep, uColorLight, ridge);

  float tAccent = clamp(r.y + length(q), 0.0, 1.0);
  float pulseA = 0.5 + 0.5 * cos(1.5 + 0.2 * iTime);
  color = mix(color, uColorAccent, tAccent * pulseA);

  float tSecondary = clamp(length(r + q), 0.0, 1.0);
  float pulseB = 0.5 + 0.5 * sin(0.13 * iTime);
  color = mix(color, uColorDeep, tSecondary * pulseB * 0.35);

  color = mix(color, uColorHighlight, clamp(dot(r, r), 0.0, 1.0));

  /* Brightness shaping — scalar so it does not change hue. */
  float brightness = 0.6 + 0.4 * (1.5 * f * f * f + 1.8 * f * f + 1.7 * f);
  color *= brightness;
  color = pow(color, vec3(0.6));

  fragColor = vec4(color, 1.0);
}
`;

export type ShaderPalette = {
  /** Cool/shadow base color */
  deep: string;
  /** Bright midtone */
  light: string;
  /** Warm accent for animated flares */
  accent: string;
  /** Soft highlight wash */
  highlight: string;
};

const DEFAULT_PALETTE: ShaderPalette = {
  deep: "#68877A",
  light: "#fff",
  accent: "#A0A7E5",
  highlight: "#fff",
};

/** "#rrggbb" or "#rgb" → [r, g, b] in 0..1. Returns black on parse failure. */
function hexToRgb(hex: string): [number, number, number] {
  const trimmed = hex.trim().replace(/^#/, "");
  const expanded =
    trimmed.length === 3
      ? trimmed
          .split("")
          .map((c) => c + c)
          .join("")
      : trimmed;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return [0, 0, 0];
  const n = parseInt(expanded, 16);
  return [((n >> 16) & 0xff) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
}

type Props = {
  palette?: Partial<ShaderPalette>;
};

export function ShaderBackground({ palette }: Props = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef({ ...DEFAULT_PALETTE, ...palette });

  /* Keep the latest palette accessible to the (long-lived) sketch closure. */
  paletteRef.current = { ...DEFAULT_PALETTE, ...palette };

  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;

    const sketch = (p: p5) => {
      let test: p5.Shader;
      let shaderOK = false;
      let noctaves = 4;
      const c: number[] = [];

      const initc = () => {
        for (let i = 0; i < 22; i++) c[i] = p.random(-5, 5);
      };

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        const gl = p.drawingContext as WebGL2RenderingContext | WebGLRenderingContext;
        gl.disable(gl.DEPTH_TEST);
        p.noStroke();
        noctaves = 4;
        c.length = 0;
        initc();

        try {
          test = p.createShader(VERT, FRAG);
          /*
            Force compile/link now so we get the real WebGL error here instead of inside draw,
            where p5 swallows it. setDefaultUniforms() invokes init() on the shader.
          */
          p.shader(test);
          shaderOK = true;
        } catch (err) {
          console.error("[ShaderBackground] Shader compile/link failed:", err);
        }
      };

      p.draw = () => {
        if (!shaderOK) {
          /* Fallback so something visible appears if the shader did not compile. */
          p.background(244, 230, 210);
          return;
        }
        test.setUniform("iResolution", [p.width, p.height]);
        test.setUniform("iTime", p.millis() * 0.0005);
        test.setUniform("iMouse", [p.mouseX, p.mouseY]);
        test.setUniform("noctaves", noctaves);
        test.setUniform("c", c);
        const pal = paletteRef.current;
        test.setUniform("uColorDeep", hexToRgb(pal.deep));
        test.setUniform("uColorLight", hexToRgb(pal.light));
        test.setUniform("uColorAccent", hexToRgb(pal.accent));
        test.setUniform("uColorHighlight", hexToRgb(pal.highlight));
        p.shader(test);
        /* Flat fullscreen quad — no depth, no strokes, fills the entire WebGL canvas. */
        p.plane(p.width, p.height);
      };

      p.mouseReleased = () => {
        noctaves = noctaves === 5 ? 4 : noctaves + 1;
        if (noctaves === 4) initc();
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const instance = new p5(sketch, parent);

    return () => {
      instance.remove();
    };
  }, []);

  return <div ref={containerRef} className="shader-background" aria-hidden />;
}
