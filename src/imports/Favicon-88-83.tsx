import svgPaths from "./svg-40japqypv7";

function Frame() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[22px] top-1/2" data-name="Frame">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Frame">
          <rect fill="var(--fill-0, #1A1816)" height="20" rx="10" width="20" x="1" y="1" />
          <rect height="20" rx="10" stroke="var(--stroke-0, #155DFC)" strokeWidth="2" width="20" x="1" y="1" />
          <path d={svgPaths.p1e200d80} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

export default function Favicon() {
  return (
    <div className="relative size-full" data-name="favicon">
      <Frame />
    </div>
  );
}