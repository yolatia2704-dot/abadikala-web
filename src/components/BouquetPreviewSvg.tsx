import type {
  BuilderFinish,
  BuilderFlower,
  BuilderSize,
  ProductLineId,
} from '../data/catalog';

interface BouquetPreviewSvgProps {
  line: ProductLineId;
  size: BuilderSize;
  flowers: BuilderFlower[];
  finish: BuilderFinish;
}

const BOUQUET_POSITIONS = [
  { cx: 140, cy: 102, stemEnd: 215, r: 19 },
  { cx: 102, cy: 120, stemEnd: 218, r: 17 },
  { cx: 178, cy: 118, stemEnd: 218, r: 17 },
  { cx: 122, cy: 146, stemEnd: 222, r: 16 },
  { cx: 160, cy: 146, stemEnd: 222, r: 16 },
  { cx: 88, cy: 152, stemEnd: 226, r: 14 },
  { cx: 192, cy: 150, stemEnd: 226, r: 14 },
];

const FRAME_POSITIONS = [
  { cx: 140, cy: 116, r: 18 },
  { cx: 104, cy: 140, r: 15 },
  { cx: 176, cy: 140, r: 15 },
  { cx: 120, cy: 176, r: 15 },
  { cx: 160, cy: 176, r: 15 },
  { cx: 96, cy: 96, r: 12 },
  { cx: 184, cy: 96, r: 12 },
];

function FlowerBloom({
  flower,
  r,
}: {
  flower: BuilderFlower;
  r: number;
}) {
  if (flower.shape === 'rose') {
    return (
      <g>
        <circle
          r={r}
          fill={flower.petalColor}
          stroke="#2B2625"
          strokeOpacity="0.16"
          strokeWidth="1"
        />
        <circle
          r={r * 0.66}
          fill="none"
          stroke="#F7F3EE"
          strokeOpacity="0.55"
          strokeWidth="1.1"
          strokeDasharray="15 5"
        />
        <circle r={r * 0.34} fill={flower.centerColor} />
      </g>
    );
  }

  if (flower.shape === 'chrysanthemum') {
    return (
      <g>
        {[0, 45, 90, 135].map((deg) => (
          <ellipse
            key={deg}
            rx={r * 0.96}
            ry={r * 0.4}
            transform={`rotate(${deg})`}
            fill={flower.petalColor}
            stroke="#B8A995"
            strokeWidth="0.8"
          />
        ))}
        <circle r={r * 0.3} fill={flower.centerColor} />
      </g>
    );
  }

  if (flower.shape === 'lisianthus') {
    return (
      <g>
        {[0, 72, 144, 216, 288].map((deg) => (
          <circle
            key={deg}
            cx={Math.cos((deg * Math.PI) / 180) * (r * 0.44)}
            cy={Math.sin((deg * Math.PI) / 180) * (r * 0.44)}
            r={r * 0.54}
            fill={flower.petalColor}
            stroke="#DCD3C9"
            strokeWidth="0.9"
          />
        ))}
        <circle r={r * 0.24} fill={flower.centerColor} />
      </g>
    );
  }

  if (flower.shape === 'hydrangea') {
    return (
      <g>
        {[
          [-6, -6],
          [6, -6],
          [0, 0],
          [-7, 6],
          [7, 6],
          [0, -9],
          [0, 9],
        ].map(([dx, dy], pIdx) => (
          <circle
            key={pIdx}
            cx={dx}
            cy={dy}
            r={r * 0.37}
            fill={flower.petalColor}
            stroke="#F7F3EE"
            strokeWidth="0.8"
          />
        ))}
        <circle r="2.8" fill={flower.centerColor} />
      </g>
    );
  }

  // Baby's breath & eucalyptus cluster
  return (
    <g>
      {[
        [-8, -7],
        [7, -8],
        [-3, 2],
        [9, 4],
        [-9, 7],
        [2, -11],
        [1, 10],
      ].map(([dx, dy], bIdx) => (
        <circle
          key={bIdx}
          cx={dx}
          cy={dy}
          r={r * 0.24}
          fill={flower.petalColor}
          stroke="#C8BFB3"
          strokeWidth="0.7"
        />
      ))}
    </g>
  );
}

export function BouquetPreviewSvg({
  line,
  size,
  flowers,
  finish,
}: BouquetPreviewSvgProps) {
  const activeCount = size.id === 'petite' ? 3 : size.id === 'klasik' ? 5 : 7;

  return (
    <svg
      viewBox="0 0 280 310"
      className="w-full max-w-[264px] mx-auto h-auto select-none"
      role="img"
      aria-label={`Pratinjau visual ${
        line === 'segar' ? 'Lini Segar' : 'Lini Abadi'
      } ukuran ${size.name} dengan ${flowers.map((f) => f.name).join(', ')} dan ${
        finish.name
      }`}
    >
      {/* Editorial Paper Backdrop */}
      <rect
        x="22"
        y="14"
        width="236"
        height="282"
        rx="3"
        fill="#F7F3EE"
        stroke="#DCD3C9"
        strokeWidth="1"
      />

      {line === 'abadi' ? (
        /* LINI ABADI: Shadow-Box, Pressed Frame, or Geometric Resin Block */
        <g>
          {finish.id === 'blok-resin' ? (
            /* Crystal Clear Hexagonal Resin Block */
            <g>
              <polygon
                points="140,48 214,92 214,202 140,246 66,202 66,92"
                fill="#EFE9E0"
                fillOpacity="0.55"
                stroke="#B8ADA1"
                strokeWidth="1.5"
              />
              <polygon
                points="140,56 206,96 206,198 140,238 74,198 74,96"
                fill="#F7F3EE"
                fillOpacity="0.85"
                stroke="#DCD3C9"
                strokeWidth="1"
              />
              {/* Subtle crystal specular reflection line */}
              <line
                x1="82"
                y1="100"
                x2="132"
                y2="68"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeOpacity="0.8"
              />
            </g>
          ) : (
            /* Wooden Shadow-Box or Thin Oak Pressed Frame */
            <g>
              <rect
                x="54"
                y="40"
                width="172"
                height="218"
                rx="2"
                fill={finish.id === 'shadow-box-kayu' ? '#C7AC8E' : '#D3BC9F'}
                stroke="#8D7357"
                strokeWidth="1.4"
              />
              {/* Inner Mat / Cotton Board */}
              <rect
                x={finish.id === 'shadow-box-kayu' ? 68 : 63}
                y={finish.id === 'shadow-box-kayu' ? 54 : 49}
                width={finish.id === 'shadow-box-kayu' ? 144 : 154}
                height={finish.id === 'shadow-box-kayu' ? 190 : 200}
                fill="#F7F3EE"
                stroke="#DCD3C9"
                strokeWidth="1"
              />
              {finish.id === 'shadow-box-kayu' && (
                /* Inner depth shadow hairline */
                <path
                  d="M68 244 L68 54 L212 54"
                  fill="none"
                  stroke="#B7A896"
                  strokeWidth="2"
                  strokeOpacity="0.5"
                />
              )}
            </g>
          )}

          {/* Preserved Botanicals Inside Frame / Resin */}
          <g
            transform={`translate(140, 148) scale(${
              size.id === 'petite' ? 0.84 : size.id === 'klasik' ? 0.96 : 1.05
            }) translate(-140, -148)`}
          >
            {/* Sage Eucalyptus Leaves */}
            <path
              d="M140 208 Q108 152 88 94"
              fill="none"
              stroke="#7A8B74"
              strokeWidth="1.3"
            />
            <path
              d="M140 208 Q172 152 192 94"
              fill="none"
              stroke="#7A8B74"
              strokeWidth="1.3"
            />
            {[
              [96, 118],
              [106, 134],
              [184, 118],
              [174, 134],
              [112, 166],
              [168, 166],
            ].map(([lx, ly], idx) => (
              <ellipse
                key={idx}
                cx={lx}
                cy={ly}
                rx="7.5"
                ry="5"
                transform={`rotate(${idx % 2 === 0 ? -25 : 25} ${lx} ${ly})`}
                fill="#7A8B74"
                opacity="0.88"
              />
            ))}

            {/* Dried Stems for Shadow-Box */}
            {finish.id === 'shadow-box-kayu' && (
              <g stroke="#8E7B65" strokeWidth="1.4">
                <line x1="140" y1="150" x2="140" y2="218" />
                <line x1="126" y1="168" x2="136" y2="218" />
                <line x1="154" y1="168" x2="144" y2="218" />
                <line x1="130" y1="200" x2="150" y2="200" stroke="#6D3B47" strokeWidth="2.5" />
              </g>
            )}

            {/* Preserved Flowers */}
            {FRAME_POSITIONS.slice(0, activeCount).map((pos, idx) => {
              const flower = flowers[idx % flowers.length];
              if (!flower) return null;
              return (
                <g key={idx} transform={`translate(${pos.cx}, ${pos.cy})`}>
                  <FlowerBloom flower={flower} r={pos.r} />
                </g>
              );
            })}
          </g>

          {/* Tiny Abadikala Cream Label inside bottom */}
          <rect
            x="104"
            y="265"
            width="72"
            height="18"
            rx="1"
            fill="#EFE9E0"
            stroke="#DCD3C9"
            strokeWidth="0.9"
          />
          <text
            x="140"
            y="277"
            textAnchor="middle"
            fontSize="7"
            letterSpacing="1.6"
            fill="#2B2625"
            fontFamily="Cormorant Garamond, Georgia, serif"
            fontWeight="600"
          >
            ABADIKALA
          </text>
        </g>
      ) : (
        /* LINI SEGAR: Korean Linen Wrap, Blacu Wrap, or Stoneware Vase */
        <g
          transform={`translate(140, 208) scale(${size.scale}) translate(-140, -208)`}
        >
          {finish.id !== 'vas-stoneware' && (
            <path
              d="M72 152 L140 120 L208 152 L176 238 L104 238 Z"
              fill={finish.fillColor}
              stroke={finish.strokeColor}
              strokeWidth="1.2"
            />
          )}

          {/* Silvery Eucalyptus Foliage */}
          <g>
            <path
              d="M136 212 Q100 154 68 96"
              fill="none"
              stroke="#7A8B74"
              strokeWidth="1.4"
            />
            <path
              d="M144 212 Q180 152 212 94"
              fill="none"
              stroke="#7A8B74"
              strokeWidth="1.4"
            />
            <path
              d="M140 205 Q138 134 136 68"
              fill="none"
              stroke="#7A8B74"
              strokeWidth="1.3"
            />
            {[
              [82, 122],
              [96, 138],
              [74, 106],
              [110, 158],
              [198, 120],
              [184, 138],
              [206, 104],
              [170, 158],
              [130, 82],
              [145, 76],
            ].map(([lx, ly], i) => (
              <ellipse
                key={i}
                cx={lx}
                cy={ly}
                rx="8.5"
                ry="6"
                transform={`rotate(${i % 2 === 0 ? -28 : 28} ${lx} ${ly})`}
                fill="#7A8B74"
                stroke="#F7F3EE"
                strokeWidth="0.8"
                opacity="0.9"
              />
            ))}
          </g>

          {/* Fresh Stems */}
          {BOUQUET_POSITIONS.slice(0, activeCount).map((pos, idx) => (
            <line
              key={`stem-${idx}`}
              x1={pos.cx}
              y1={pos.cy}
              x2={140 + (pos.cx - 140) * 0.14}
              y2={pos.stemEnd}
              stroke="#63705E"
              strokeWidth="1.6"
            />
          ))}

          {/* Fresh Flowers */}
          {BOUQUET_POSITIONS.slice(0, activeCount).map((pos, idx) => {
            const flower = flowers[idx % flowers.length];
            if (!flower) return null;
            return (
              <g key={`flower-${idx}`} transform={`translate(${pos.cx}, ${pos.cy})`}>
                <FlowerBloom flower={flower} r={pos.r} />
              </g>
            );
          })}

          {/* Front Vessel or Korean Wrap + Abadikala Tag */}
          {finish.id === 'vas-stoneware' ? (
            <g>
              <path
                d="M114 196 L166 196 C174 214 182 232 174 260 C168 276 158 282 140 282 C122 282 112 276 106 260 C98 232 106 214 114 196 Z"
                fill={finish.fillColor}
                stroke={finish.strokeColor}
                strokeWidth="1.3"
              />
              <ellipse
                cx="140"
                cy="196"
                rx="26"
                ry="4.5"
                fill="#C7BCAD"
                stroke={finish.strokeColor}
                strokeWidth="1.1"
              />
            </g>
          ) : (
            <g>
              <path
                d="M84 176 L140 198 L196 176 L156 264 L124 264 Z"
                fill={finish.fillColor}
                stroke={finish.strokeColor}
                strokeWidth="1.2"
              />
              <line
                x1="140"
                y1="198"
                x2="140"
                y2="264"
                stroke={finish.strokeColor}
                strokeWidth="0.9"
                opacity="0.7"
              />
              <line x1="133" y1="264" x2="128" y2="284" stroke="#63705E" strokeWidth="1.8" />
              <line x1="140" y1="264" x2="140" y2="286" stroke="#63705E" strokeWidth="1.8" />
              <line x1="147" y1="264" x2="152" y2="284" stroke="#63705E" strokeWidth="1.8" />

              {/* Maroon Ribbon & Hanging Cream Abadikala Tag */}
              <rect x="122" y="236" width="36" height="7" rx="1" fill="#6D3B47" />
              <path d="M138 243 Q126 260 120 278" fill="none" stroke="#6D3B47" strokeWidth="2.4" />
              <path d="M142 243 Q154 258 162 276" fill="none" stroke="#6D3B47" strokeWidth="2.4" />

              {/* Hanging Cream Paper Tag */}
              <g transform="translate(154, 246) rotate(12)">
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="32"
                  rx="1"
                  fill="#F7F3EE"
                  stroke="#B9AA98"
                  strokeWidth="0.9"
                />
                <circle cx="12" cy="5" r="1.5" fill="#6D3B47" />
                <line x1="5" y1="15" x2="19" y2="15" stroke="#6E655F" strokeWidth="0.8" />
                <line x1="7" y1="20" x2="17" y2="20" stroke="#6E655F" strokeWidth="0.6" />
              </g>
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
