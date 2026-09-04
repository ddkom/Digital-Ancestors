import React, { useEffect, useRef } from "react";
import p5 from "p5";

export const ShaderBackground: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sketchRef.current) return;

    // Instance mode p5
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(400, 400);
      };

      p.draw = () => {
        p.background(220);
        p.ellipse(p.width / 2, p.height / 2, 50, 50);
      };
    };

    // Instantiate p5
    const myP5 = new p5(sketch, sketchRef.current);

    // Cleanup: remove p5 instance on unmount to prevent memory leaks
    return () => {
      myP5.remove();
    };
  }, []);

  return <div ref={sketchRef} />;
};

