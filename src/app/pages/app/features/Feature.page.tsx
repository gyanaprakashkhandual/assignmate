"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  PenLine,
  Upload,
  Sparkles,
  FileDown,
  History,
  Settings2,
  ShieldCheck,
  ChevronRight,
  ArrowDown,
} from "lucide-react";
import * as THREE from "three";

function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.set(0, 0, 5);

    const particles = new THREE.BufferGeometry();
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: 0x111111,
      size: 0.04,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(particles, mat);
    scene.add(points);

    const torusGeo = new THREE.TorusKnotGeometry(1.6, 0.38, 120, 16);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x111111,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(3.5, -0.5, -1);
    scene.add(torus);

    const ringGeo = new THREE.TorusGeometry(2.2, 0.015, 8, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x222222,
      transparent: true,
      opacity: 0.12,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    ring.position.set(-3, 1, -2);
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(1.4, 0.01, 8, 80);
    const ring2 = new THREE.Mesh(ring2Geo, ringMat.clone());
    ring2.rotation.x = Math.PI / 5;
    ring2.rotation.y = Math.PI / 4;
    ring2.position.set(3, 2, -3);
    scene.add(ring2);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      points.rotation.y = t * 0.018;
      points.rotation.x = t * 0.008;

      torus.rotation.x = t * 0.12;
      torus.rotation.y = t * 0.08;

      ring.rotation.z = t * 0.06;
      ring2.rotation.z = -t * 0.04;

      camera.position.x += (mouseX - camera.position.x) * 0.04;
      camera.position.y += (-mouseY - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

const features = [
  {
    icon: ShieldCheck,
    title: "User Authentication",
    desc: "Secure JWT-based login and registration. Every account is fully private — your handwriting profiles and assignments are isolated and protected.",
    tag: "Security",
  },
  {
    icon: Upload,
    title: "Handwriting Profile Upload",
    desc: "Upload a single photo of your handwriting. Claude Vision AI analyzes slant, spacing, stroke weight, and irregularities to create your unique profile.",
    tag: "AI Vision",
  },
  {
    icon: Sparkles,
    title: "Assignment Generation",
    desc: "Type any question or topic. Claude generates a well-structured academic answer and renders it in your personal handwriting style automatically.",
    tag: "AI Writing",
  },
  {
    icon: PenLine,
    title: "Handwriting Rendering",
    desc: "Canvas-based engine applies natural variation — letter tilt, ink simulation, spacing randomness — so the output never looks machine-generated.",
    tag: "Rendering",
  },
  {
    icon: FileDown,
    title: "PDF Export",
    desc: "Export multi-page PDFs with your handwriting font embedded. Choose from lined notebook, plain white, or college-ruled paper styles.",
    tag: "Export",
  },
  {
    icon: History,
    title: "Assignment History",
    desc: "Every generated assignment is saved to your account with the original question, date, and paper style. Re-download at any time within 30 days.",
    tag: "Storage",
  },
  {
    icon: Settings2,
    title: "Customization Options",
    desc: "Adjust ink color, paper style, font size, line spacing, and page margins before generating. All settings are saved per assignment.",
    tag: "Control",
  },
];

const steps = [
  { num: "01", title: "Register & Login", desc: "Create your account with email and password." },
  { num: "02", title: "Upload Photo", desc: "Snap a photo of your natural handwriting on white paper." },
  { num: "03", title: "AI Analysis", desc: "Claude Vision extracts your personal handwriting style." },
  { num: "04", title: "Type Your Prompt", desc: "Enter a question, topic, or essay assignment." },
  { num: "05", title: "AI Generates", desc: "Claude writes a complete, well-structured academic answer." },
  { num: "06", title: "Preview & Adjust", desc: "Review the rendered output and tweak any settings." },
  { num: "07", title: "Download PDF", desc: "Export your multi-page handwritten PDF instantly." },
];

function FeatureCard({
  icon: Icon,
  title,
  desc,
  tag,
  index,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  tag: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
      className="group relative flex flex-col gap-4 p-6 border border-black/8 dark:border-white/8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm hover:border-black/20 dark:hover:border-white/20 transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-black/[0.02] to-transparent dark:from-white/[0.03]" />
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.05]">
          <Icon className="w-4.5 h-4.5 text-black dark:text-white" strokeWidth={1.5} />
        </div>
        <span className="text-[10px] font-medium tracking-widest uppercase text-black/30 dark:text-white/30 border border-black/8 dark:border-white/8 px-2 py-1 rounded-full">
          {tag}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-black dark:text-white mb-1.5 tracking-tight">
          {title}
        </h3>
        <p className="text-xs leading-relaxed text-black/50 dark:text-white/50">{desc}</p>
      </div>
    </motion.div>
  );
}

function StepItem({ num, title, desc, index }: { num: string; title: string; desc: string; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      className="flex items-start gap-5 group"
    >
      <div className="flex flex-col items-center gap-0 shrink-0">
        <div className="w-9 h-9 rounded-full border border-black/12 dark:border-white/12 flex items-center justify-center bg-black dark:bg-white shrink-0">
          <span className="text-[10px] font-bold text-white dark:text-black tracking-tight">{num}</span>
        </div>
        {index < steps.length - 1 && (
          <div className="w-px h-12 bg-gradient-to-b from-black/15 to-transparent dark:from-white/15 mt-1" />
        )}
      </div>
      <div className="pt-1.5 pb-10">
        <p className="text-sm font-semibold text-black dark:text-white mb-0.5">{title}</p>
        <p className="text-xs text-black/45 dark:text-white/45 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function SVGOrbit() {
  return (
    <svg
      viewBox="0 0 600 600"
      className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.06] pointer-events-none"
      fill="none"
    >
      <circle cx="300" cy="300" r="200" stroke="black" strokeWidth="0.5" className="dark:stroke-white" />
      <circle cx="300" cy="300" r="140" stroke="black" strokeWidth="0.5" className="dark:stroke-white" />
      <circle cx="300" cy="300" r="80" stroke="black" strokeWidth="0.5" className="dark:stroke-white" />
      <ellipse cx="300" cy="300" rx="260" ry="100" stroke="black" strokeWidth="0.5" className="dark:stroke-white" transform="rotate(30 300 300)" />
      <ellipse cx="300" cy="300" rx="260" ry="100" stroke="black" strokeWidth="0.5" className="dark:stroke-white" transform="rotate(80 300 300)" />
      <ellipse cx="300" cy="300" rx="260" ry="100" stroke="black" strokeWidth="0.5" className="dark:stroke-white" transform="rotate(130 300 300)" />
    </svg>
  );
}

function GridPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="0.5" className="dark:stroke-white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

export default function Featurespage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <main
      ref={containerRef}
      className="min-h-screen min-w-screen max-h-screen overflow-y-auto bg-white dark:bg-[#0a0a0a] text-black dark:text-white"
      style={{ maxWidth: "100vw" }}
    >
      <section className="relative min-h-screen max-h-screen w-full flex flex-col overflow-hidden">
        <ThreeCanvas />
        <GridPattern />

        <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-7 h-7 rounded-lg bg-black dark:bg-white flex items-center justify-center">
              <PenLine className="w-3.5 h-3.5 text-white dark:text-black" strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-black dark:text-white">
              Assignmate
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <a
              href="/how-to-use"
              className="text-xs text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors duration-200 tracking-wide"
            >
              How to use
            </a>
            <a
              href="/register"
              className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 transition-colors duration-200"
            >
              Get started
              <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
            </a>
          </motion.div>
        </nav>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.05] mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse" />
            <span className="text-[11px] font-medium tracking-widest uppercase text-black/50 dark:text-white/50">
              Powered by Claude AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[-0.03em] leading-[0.92] text-black dark:text-white max-w-5xl"
          >
            Your handwriting.
            <br />
            <span className="text-black/25 dark:text-white/25">Rendered by AI.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45 }}
            className="mt-7 text-sm sm:text-base text-black/45 dark:text-white/45 max-w-lg leading-relaxed"
          >
            Upload one photo of your handwriting. Type any question or topic.
            Assignmate generates a complete handwritten PDF that looks exactly like you wrote it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.58 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-3"
          >
            <a
              href="/register"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:bg-black/85 dark:hover:bg-white/85 transition-all duration-200 shadow-lg shadow-black/10"
            >
              Start for free
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </a>
            <a
              href="/how-to-use"
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-black/12 dark:border-white/12 text-black dark:text-white text-sm font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all duration-200"
            >
              See how it works
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-16 flex flex-col items-center gap-1.5"
          >
            <span className="text-[10px] tracking-widest uppercase text-black/25 dark:text-white/25">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <ArrowDown className="w-3.5 h-3.5 text-black/25 dark:text-white/25" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative w-full py-28 px-6 sm:px-10 lg:px-16 overflow-hidden bg-white dark:bg-[#0a0a0a]">
        <SVGOrbit />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 max-w-2xl"
          >
            <p className="text-[10px] tracking-widest uppercase text-black/30 dark:text-white/30 mb-4 font-medium">
              Everything you need
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.025em] leading-tight text-black dark:text-white">
              Seven features.
              <br />
              <span className="text-black/25 dark:text-white/25">One seamless flow.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full py-28 px-6 sm:px-10 lg:px-16 bg-[#f8f8f7] dark:bg-[#0f0f0f]">
        <GridPattern />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[10px] tracking-widest uppercase text-black/30 dark:text-white/30 mb-4 font-medium">
                How it works
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] leading-tight text-black dark:text-white mb-6">
                From photo to PDF
                <br />
                <span className="text-black/25 dark:text-white/25">in seven steps.</span>
              </h2>
              <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed max-w-sm">
                The entire process takes under two minutes once your handwriting profile is created.
                Your profile is saved and reused for every future assignment.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                {["Claude AI", "Custom Font Pipeline", "Calligraphr", "pdf-lib", "canvas rendering"].map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium tracking-wide px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-black/40 dark:text-white/40"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <div className="flex flex-col">
              {steps.map((s, i) => (
                <StepItem key={s.num} {...s} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full py-28 px-6 sm:px-10 lg:px-16 bg-white dark:bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg viewBox="0 0 1200 400" className="absolute bottom-0 left-0 w-full opacity-[0.03] dark:opacity-[0.05]" fill="none">
            <path d="M0 300 Q200 100 400 200 T800 150 T1200 250" stroke="black" strokeWidth="1" className="dark:stroke-white" />
            <path d="M0 350 Q300 150 600 250 T1200 200" stroke="black" strokeWidth="0.5" className="dark:stroke-white" />
            <path d="M0 250 Q150 50 350 180 T700 100 T1200 300" stroke="black" strokeWidth="0.8" className="dark:stroke-white" />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <p className="text-[10px] tracking-widest uppercase text-black/30 dark:text-white/30 mb-4 font-medium">
              Paper styles
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-black dark:text-white">
              Choose your canvas.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                name: "Lined Notebook",
                desc: "Classic horizontal lines. Most commonly used for school assignments and general handwritten notes.",
                lines: 8,
              },
              {
                name: "Plain White",
                desc: "Clean blank surface with no lines or guides. Ideal for creative writing and unstructured content.",
                lines: 0,
              },
              {
                name: "College Ruled",
                desc: "Narrower line spacing fits more text per page. Standard for college-level academic submissions.",
                lines: 11,
              },
            ].map((style, i) => (
              <motion.div
                key={style.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="group rounded-2xl border border-black/8 dark:border-white/8 overflow-hidden hover:border-black/18 dark:hover:border-white/18 transition-all duration-300"
              >
                <div className="h-44 bg-[#fdfcfa] dark:bg-[#141414] relative overflow-hidden flex flex-col justify-end p-5 gap-0">
                  {style.lines > 0 &&
                    Array.from({ length: style.lines }).map((_, j) => (
                      <div
                        key={j}
                        className="w-full border-b border-[#c5d0e6]/60 dark:border-[#2a3a5c]/40"
                        style={{ height: `${100 / style.lines}%` }}
                      />
                    ))}
                  <div className="absolute inset-0 flex flex-col justify-center px-6 gap-1.5">
                    {[0.7, 0.55, 0.65, 0.5].map((op, j) => (
                      <div
                        key={j}
                        className="h-px bg-black dark:bg-white rounded-full"
                        style={{ opacity: op, width: `${60 + j * 8}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-5 bg-white dark:bg-[#0a0a0a]">
                  <p className="text-sm font-semibold text-black dark:text-white mb-1">{style.name}</p>
                  <p className="text-xs text-black/45 dark:text-white/45 leading-relaxed">{style.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full py-28 px-6 sm:px-10 lg:px-16 bg-[#f8f8f7] dark:bg-[#0f0f0f]">
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: "1", unit: "photo", label: "to create your profile" },
              { value: "< 30", unit: "seconds", label: "average generation time" },
              { value: "3", unit: "paper styles", label: "to choose from" },
              { value: "30", unit: "days", label: "assignments stored free" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex flex-col gap-1"
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white">
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-black/40 dark:text-white/40">{stat.unit}</span>
                </div>
                <p className="text-xs text-black/40 dark:text-white/40 leading-snug">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full py-28 px-6 sm:px-10 lg:px-16 bg-white dark:bg-[#0a0a0a] overflow-hidden">
        <SVGOrbit />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-tight text-black dark:text-white mb-6">
              Ready to write
              <br />
              <span className="text-black/22 dark:text-white/22">without writing?</span>
            </h2>
            <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed mb-10 max-w-md mx-auto">
              One photo of your handwriting is all it takes. Assignmate handles everything else —
              from AI analysis to the final handwritten PDF.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/register"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:bg-black/85 dark:hover:bg-white/85 transition-all duration-200 shadow-xl shadow-black/10"
              >
                Create free account
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </a>
              <a
                href="/how-to-use"
                className="text-sm text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors duration-200 flex items-center gap-1.5"
              >
                Read the guide
                <ChevronRight className="w-3 h-3" strokeWidth={2} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="w-full border-t border-black/6 dark:border-white/6 py-8 px-6 sm:px-10 lg:px-16 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-black dark:bg-white flex items-center justify-center">
              <PenLine className="w-2.5 h-2.5 text-white dark:text-black" strokeWidth={2} />
            </div>
            <span className="text-xs font-medium text-black/50 dark:text-white/50">Assignmate</span>
          </div>
          <p className="text-[11px] text-black/30 dark:text-white/30">
            Powered by Claude AI — Handwriting cloned, assignments generated.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[11px] text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors duration-150"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}