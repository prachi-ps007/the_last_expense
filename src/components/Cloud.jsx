export default function Cloud({ width = 240, style = {} }) {
  const h = Math.round(width * 0.52);
  const s = width / 320; // scale factor

  return (
    <svg
      viewBox="0 0 320 166"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={h}
      aria-hidden="true"
      style={{ display: "block", overflow: "visible", ...style }}
    >
      {/* Underbelly shadow */}
      <ellipse cx="165" cy="152" rx="130" ry="15" fill="#a8cfe0" opacity="0.45" />

      {/* Main cloud body — organic bezier, no stacked circles */}
      <path
        fill="white"
        d="
          M 26 152
          C 26 152, 14 130, 30 116
          C 40 104, 62 100, 78 110
          C 86 94,  104 82,  126 84
          C 136 66,  162 56,  188 66
          C 200 50,  230 46,  250 64
          C 268 50,  298 56,  304 78
          C 322 72,  336 90,  326 108
          C 342 108, 354 124, 342 140
          C 350 150, 342 162, 320 164
          L 40 164
          C 16 164, 8 154, 26 152
          Z
        "
      />

      {/* Highlight dome on tallest puff */}
      <ellipse cx="192" cy="60" rx="26" ry="11" fill="white" opacity="0.7" />
      <ellipse cx="144" cy="76" rx="18" ry="8"  fill="white" opacity="0.55" />

      {/* Soft blue underbelly crease for depth */}
      <path
        fill="none"
        stroke="#cce6f5"
        strokeWidth="2"
        opacity="0.6"
        d="M 50 150 Q 165 162 296 148"
      />
      <ellipse cx="165" cy="156" rx="110" ry="9" fill="#daeef8" opacity="0.4" />
    </svg>
  );
}