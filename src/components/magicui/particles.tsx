"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  color?: string;
}

export function Particles({
  className = "",
  quantity = 35,
  staticity = 50,
  ease = 50,
  color = "#f59e0b",
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    let animationFrameId: number;
    let canvasW = container.offsetWidth;
    let canvasH = container.offsetHeight;

    const mouse = { x: 0, y: 0 };
    const mousePos = { x: 0, y: 0 };

    interface Particle {
      x: number;
      y: number;
      translateX: number;
      translateY: number;
      size: number;
      alpha: number;
      targetAlpha: number;
      dx: number;
      dy: number;
      magnetism: number;
    }

    const circles: Particle[] = [];

    const resizeCanvas = () => {
      canvasW = container.offsetWidth;
      canvasH = container.offsetHeight;
      canvas.width = canvasW * dpr;
      canvas.height = canvasH * dpr;
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticle = (): Particle => {
      return {
        x: Math.random() * canvasW,
        y: Math.random() * canvasH,
        translateX: 0,
        translateY: 0,
        size: Math.random() * 2 + 1,
        alpha: 0,
        targetAlpha: Math.random() * 0.5 + 0.1,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        magnetism: 0.1 + Math.random() * 3,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      const x = mousePos.x - rect.left - canvasW / 2;
      const y = mousePos.y - rect.top - canvasH / 2;
      const inside = x < canvasW / 2 && x > -canvasW / 2 && y < canvasH / 2 && y > -canvasH / 2;
      if (inside) {
        mouse.x = x;
        mouse.y = y;
      }
    };

    const remap = (
      val: number,
      min1: number,
      max1: number,
      min2: number,
      max2: number
    ): number => {
      const result = ((val - min1) * (max2 - min2)) / (max1 - min1) + min2;
      return result > 0 ? result : 0;
    };

    resizeCanvas();
    for (let i = 0; i < quantity; i++) {
      circles.push(createParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, canvasW, canvasH);

      for (let i = 0; i < circles.length; i++) {
        const p = circles[i];
        const distToEdge = Math.min(
          p.x + p.translateX - p.size,
          canvasW - p.x - p.translateX - p.size,
          p.y + p.translateY - p.size,
          canvasH - p.y - p.translateY - p.size
        );
        const remapEdge = remap(distToEdge, 0, 20, 0, 1);

        if (remapEdge > 1) {
          p.alpha += 0.02;
          if (p.alpha > p.targetAlpha) p.alpha = p.targetAlpha;
        } else {
          p.alpha = p.targetAlpha * remapEdge;
        }

        p.x += p.dx;
        p.y += p.dy;
        p.translateX += (mouse.x / (staticity / p.magnetism) - p.translateX) / ease;
        p.translateY += (mouse.y / (staticity / p.magnetism) - p.translateY) / ease;

        if (
          p.x < -p.size ||
          p.x > canvasW + p.size ||
          p.y < -p.size ||
          p.y > canvasH + p.size
        ) {
          circles[i] = createParticle();
        } else {
          ctx.beginPath();
          ctx.arc(p.x + p.translateX, p.y + p.translateY, p.size, 0, 2 * Math.PI);
          ctx.fillStyle = `${color}${Math.floor(p.alpha * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.fill();
        }
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [quantity, staticity, ease, color]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
