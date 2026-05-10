import { Scene } from './systems/rendering/Scene';

export default function App() {
  return (
    <div className="relative h-full w-full">
      <Scene />
      <header className="pointer-events-none absolute inset-x-0 top-0 px-6 py-4">
        <h1 className="text-xl font-semibold tracking-tight">KeyboardLab</h1>
        <p className="text-xs text-neutral-400">v0 — drag to rotate, scroll to zoom</p>
      </header>
    </div>
  );
}
