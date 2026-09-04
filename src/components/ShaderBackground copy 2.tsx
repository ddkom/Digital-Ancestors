import { useEffect, useRef } from "react";
import p5 from "p5";

/** GLSL ES 3.00 — matches p5’s default WebGL2 context (no `setAttributes({ version: 1 })`). */
const VERT = `
#version 300 es

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

const FRAG = `
#version 300 es

// Author Pierre MARZIN 01/2017 — adapted to WebGL2 / GLSL ES 3.00

precision mediump float;

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;
uniform int noctaves;
uniform float c[22];

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
  vec3 color = vec3(0.0);
  vec2 q = vec2(0.0);
  q.x = fbm(st + vec2(c[0], c[1] * .01 * iTime));
  q.y = fbm(st + vec2(c[2], c[3]));
  vec2 r = vec2(0.0);

  r.x = fbm(st + (3.0 * mouse.x + 0.4) * q + vec2(c[5], c[6]));
  r.y = fbm(st + (6.0 * mouse.y + 0.5) * q * sin(.01 * iTime) + vec2(c[8] * .05 * iTime, c[9]));
  float f = fbm(st + c[10] * (r + length(q)));
  color = smoothstep(
    vec3(0.101961, 0.19608, 0.666667),
    vec3(0.666667, 0.666667, 0.98039),
    color
  );
  color = mix(color, vec3(1.856, .05 * (1.0 + cos(1.5 + .2 * iTime)), 0.164706), r.y + length(q));
  color = mix(color, vec3(1.5 * sin(.1 * iTime), 0.0, cos(.13 * iTime)), length(r + q));
  color = mix(color, vec3(0.9, 0.9, 0.9), dot(r, r));
  color *= (1.5 * f * f * f + 1.8 * f * f + 1.7 * f);
  color += .4 * vec3(1.8 + r.x, 0.7 + q);
  color = pow(color, vec3(.5));

  fragColor = vec4(color, 1.0);
}
`;

export function ShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;

    const sketch = (p: p5) => {
      let test: p5.Shader;
      let noctaves = 4;
      const c: number[] = [];

      const initc = () => {
        for (let i = 0; i < 22; i++) c[i] = p.random(-5, 5);
      };

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        const gl = p.drawingContext as WebGL2RenderingContext | WebGLRenderingContext;
        gl.disable(gl.DEPTH_TEST);
        noctaves = 4;
        c.length = 0;
        initc();
        test = p.createShader(VERT, FRAG);
        p.shader(test);
      };

      p.draw = () => {
        test.setUniform("iResolution", [p.width, p.height]);
        test.setUniform("iTime", p.millis() * 0.0005);
        test.setUniform("iMouse", [p.mouseX, p.mouseY]);
        test.setUniform("noctaves", noctaves);
        test.setUniform("c", c);
        p.shader(test);
        p.box(p.width / 2);
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
