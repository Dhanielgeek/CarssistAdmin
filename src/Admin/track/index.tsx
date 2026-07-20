import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Phone,
  User,
  Navigation,
  MapPin,
} from "lucide-react";
import firstcar from '../../assets/firstcar.png'
import secondcar from '../../assets/secondcar.png'

type TabKey = "both" | "assist" | "chauffeur";

const Track = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("both");
  const [chauffeurOpen, setChauffeurOpen] = useState(false);
  const [assistOpen, setAssistOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans text-sm">
      {/* ------------------------------------------------------------ */}
      {/* Left panel                                                    */}
      {/* ------------------------------------------------------------ */}
      <div className="flex w-95 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white">
        {/* Search + filter */}
        <div className="flex items-center gap-2 p-4">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              placeholder="Search Vehicle, customer, location and others"
              className="w-full flex-1 text-xs text-gray-500 outline-none placeholder:text-gray-400"
            />
          </div>
          <button className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>

        {/* Tabs */}
        <div className="mx-4 mb-3 flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          {(
            [
              { key: "both", label: "Chauffeur & Assist" },
              { key: "assist", label: "Assist" },
              { key: "chauffeur", label: "Chauffeur" },
            ] as { key: TabKey; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 px-4 ">
          {/* Chauffeur card (collapsed) */}
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <button
              onClick={() => setChauffeurOpen((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-3"
            >
              <div className="flex items-center gap-2">
                <Badge color="bg-blue-500">Chauffeur</Badge>
                <Badge color="bg-gray-900">Ongoing</Badge>
              </div>
              {chauffeurOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>

       <div className="mx-4 mb-4 rounded-2xl border border-gray-200 p-4">
            <div className="mb-6">
    <img
        src={firstcar}
        className="h-10 object-contain"
        alt=""
    />
</div>
             <div className="flex">

    <div className="mr-4 flex flex-col items-center">

      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100">
    <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
</div>

<div className="h-16 border-l-2 border-dashed border-gray-300" />

      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
            <MapPin
                size={11}
                fill="#DC2626"
                className="text-red-600"
            />
        </div>

    </div>

    <div className="flex flex-col justify-between">

        <div>
            <h3 className="text-md font-bold text-neutral-900">
                2972 Westheimer
            </h3>

            <p className="mt-1 text-md text-neutral-500">
                Rd. Santa Ana, Illinois 85486
            </p>
        </div>

        <div className="mt-6">
            <h3 className="text-md font-bold text-neutral-900">
                8502 Preston
            </h3>

            <p className="mt-1 text-md text-neutral-500">
                Rd. Inglewood, Maine 98380
            </p>
        </div>

    </div>

</div>
            </div>
          </div>

          {/* Assist card (expanded) */}
          <div className="overflow-hidden rounded-xl border border-blue-400 shadow-sm">
            <button
              onClick={() => setAssistOpen((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <Badge color="bg-blue-500">Assist</Badge>
                <Badge color="bg-gray-900">Ongoing</Badge>
              </div>
              {assistOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>

            {assistOpen && (
              <div className="flex flex-col gap-4 px-4 pb-4">
                {/* Two vehicles, spread across the full card width */}
                <div className="flex items-center justify-between px-1">
                  <img src={firstcar} className="h-14 object-contain" alt="" />
                  <img src={secondcar} className="h-14 object-contain" alt="" />
                </div>

                {/* Pickup -> drop-off route, same marker/dashed-line style as the Chauffeur card */}
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                    </div>

                    <div className="h-10 border-l-2 border-dashed border-gray-300" />

                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                      <MapPin size={11} fill="#DC2626" className="text-red-600" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">2972 Westheimer</h3>
                      <p className="mt-1 text-xs text-neutral-500">Rd. Santa Ana, Illinois 85486</p>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-sm font-bold text-neutral-900">8502 Preston</h3>
                      <p className="mt-1 text-xs text-neutral-500">Rd. Inglewood, Maine 98380</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-100 pt-3">
                  <DetailRow label="REQUEST DATE / TIME" value="12/04/2024 | 12:00PM" badgeText="DONE" badgeColor="bg-blue-500" />
                  <DetailRow label="ETA:" value="12:45PM" badgeText="YET TO ARRIVE" badgeColor="bg-red-500" />
                  <DetailRow label="SERVICE DELIVERY:" value="1:15PM" badgeText="STILL ON IT" badgeColor="bg-red-500" />
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Current Location:</p>
                    <p className="mt-1 text-[11px] text-gray-400">Lat:</p>
                    <p className="text-[11px] text-gray-400">Lon:</p>
                  </div>
                  <p className="text-[11px] leading-4 text-gray-800">
                    Heading to :{" "}
                    <span className="font-bold text-gray-900">2972 Westheimer</span> Rd. Santa Ana, Illinois 85486
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                  <p className="text-xs font-bold text-gray-900">All Services</p>
                  <p className="text-[11px] leading-4 text-gray-800">
                    All Services All All Services All Services All Services All
                    Services All Services
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <p className="text-xs font-bold text-gray-900">Service Charge:</p>
                  <p className="text-xs font-semibold text-gray-900">$24</p>
                </div>

                <PersonSection
                  role="Driver"
                  name="Chris Richard"
                  phone="0852763849"
                  carModel="Thunder Blaze"
                  vin="ZAB-1234"
                />
                <PersonSection
                  role="Customer"
                  name="Chris Richard"
                  phone="0852763849"
                  carModel="Thunder Blaze"
                  vin="ZAB-1234"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Map panel                                                     */}
      {/* ------------------------------------------------------------ */}
      <div className="relative flex-1 bg-[#eef0f2]">
        <MapView />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                       */
/* ------------------------------------------------------------------ */

const Badge = ({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) => (
  <span
    className={`${color} rounded px-2 py-1 text-[10px] font-semibold text-white`}
  >
    {children}
  </span>
);

const DetailRow = ({
  label,
  value,
  badgeText,
  badgeColor,
}: {
  label: string;
  value: string;
  badgeText: string;
  badgeColor: string;
}) => (
  <div className="flex items-center justify-between gap-2">
    <p className="text-[11px] font-bold uppercase tracking-wide text-gray-800">
      {label} <span className="font-normal normal-case text-gray-400">{value}</span>
    </p>
    <span
      className={`${badgeColor} shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] font-semibold text-white`}
    >
      {badgeText}
    </span>
  </div>
);

const PersonSection = ({
  role,
  name,
  phone,
  carModel,
  vin,
}: {
  role: string;
  name: string;
  phone: string;
  carModel: string;
  vin: string;
}) => (
  <div className="grid grid-cols-2 gap-x-2 gap-y-2 border-t border-gray-100 pt-3">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-800">
        {role}
      </p>
      <div className="mt-1 flex items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
          <User className="h-3 w-3 text-gray-500" />
        </span>
        <span className="text-[11px] text-gray-700">{name}</span>
      </div>
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-800">
        Contact Detail
      </p>
      <div className="mt-1 flex items-center gap-1.5">
        <Phone className="h-3 w-3 text-gray-500" />
        <span className="text-[11px] text-gray-700">{phone}</span>
      </div>
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-800">
        Car Model
      </p>
      <p className="mt-1 text-[11px] text-gray-700">{carModel}</p>
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-800">
        VIN
      </p>
      <p className="mt-1 text-[11px] text-gray-700">{vin}</p>
    </div>
  </div>
);





const MapView = () => (
  <svg
    viewBox="0 0 760 690"
    className="absolute inset-0 h-full w-full"
    preserveAspectRatio="xMidYMid slice"
  >
    <rect width="760" height="690" fill="#e8eaed" />

    {/* background roads */}
    <g stroke="#ffffff" strokeWidth="10" fill="none" opacity="0.9">
      <path d="M0 90 L760 40" />
      <path d="M0 250 L760 190" />
      <path d="M260 0 L200 690" />
      <path d="M420 0 L520 690" />
      <path d="M0 470 L760 430" />
      <path d="M0 560 L620 690" />
      <path d="M330 0 L610 690" />
    </g>
    <g stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.7">
      <path d="M80 0 L60 690" />
      <path d="M150 0 L150 690" />
      <path d="M480 0 L480 690" />
      <path d="M640 0 L660 690" />
      <path d="M0 340 L760 320" />
      <path d="M0 610 L760 600" />
    </g>

    {/* road labels */}
    <g fill="#9aa1a9" fontSize="11" fontFamily="sans-serif">
      <text x="415" y="20" transform="rotate(-8 415 20)">
        s Memorial Blvd
      </text>
      <text x="490" y="55">
        Lone Star
      </text>
      <text x="360" y="45" transform="rotate(-25 360 45)">
        Terrace Dr
      </text>
      <text x="40" y="80" transform="rotate(-15 40 80)">
        Eagle Ave
      </text>
      <text x="300" y="150" transform="rotate(35 300 150)">
        E Central Texas Expy
      </text>
      <text x="35" y="220" transform="rotate(-25 35 220)">
        Lowes Blvd
      </text>
      <text x="235" y="290" transform="rotate(-70 235 290)">
        Lew Ln
      </text>
      <text x="255" y="255" transform="rotate(15 255 255)">
        E Elms Rd
      </text>
      <text x="315" y="345" transform="rotate(-72 315 345)">
        Cunningham Rd
      </text>
      <text x="330" y="410" transform="rotate(-72 330 410)">
        Lowe St
      </text>
      <text x="440" y="330">
        Fawn Dr
      </text>
      <text x="590" y="410" transform="rotate(25 590 410)">
        Stagecoach Rd
      </text>
      <text x="200" y="470" transform="rotate(-80 200 470)">
        Featherline Rd
      </text>
      <text x="230" y="560">
        Addison St
      </text>
      <text x="650" y="500" transform="rotate(35 650 500)">
        Chaparral Rd
      </text>
      <text x="640" y="580" transform="rotate(-80 640 580)">
        Platinum Dr
      </text>
      <text x="700" y="45" transform="rotate(65 700 45)">
        N Roy Reynolds
      </text>
      <text x="590" y="215" fontWeight="600" fill="#8b929a">
        Killeen Municipal Airport
      </text>
      <text x="560" y="285" fontWeight="600" fill="#8b929a">
        Seton Medical Center
      </text>
      <text x="590" y="300" fontWeight="600" fill="#8b929a">
        Harker Heights
      </text>
    </g>

    {/* small P (parking) markers along the route */}
    {[
      [403, 282],
      [596, 318],
      [580, 388],
    ].map(([cx, cy], i) => (
      <g key={i}>
        <circle
          cx={cx}
          cy={cy}
          r="10"
          fill="#ffffff"
          stroke="#c7ccd1"
          strokeWidth="2"
        />
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="#9aa1a9"
        >
          P
        </text>
      </g>
    ))}

    {/* route */}
    <path
      d="M350 95 L350 150 L430 195 L480 230 L490 270 L520 300 L540 320 L560 345 L590 345 L615 370 L650 390 L655 420 L690 450"
      fill="none"
      stroke="#3b7cf6"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* pickup marker + label card */}
    <circle cx="350" cy="95" r="6" fill="#22c55e" stroke="white" strokeWidth="2" />
    <g transform="translate(365, 60)">
      <rect
        width="200"
        height="46"
        rx="8"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
      <circle cx="18" cy="17" r="4" fill="#22c55e" />
      <text x="30" y="21" fontSize="12" fontWeight="700" fill="#1f2937">
        2972 Westheimer
      </text>
      <text x="30" y="36" fontSize="10" fill="#9aa1a9">
        Rd. Santa Ana, Illinois 85486
      </text>
    </g>

    {/* current location marker */}
    <g transform="translate(540, 320)">
      <circle r="18" fill="#1f2937" />
      <circle r="15" fill="#22c55e" stroke="#1f2937" strokeWidth="3" />
      <foreignObject x="-8" y="-8" width="16" height="16">
        <div className="flex h-4 w-4 items-center justify-center">
          <Navigation className="h-4 w-4 rotate-45 text-white" fill="white" />
        </div>
      </foreignObject>
    </g>

    {/* destination pin */}
    <g transform="translate(690, 450)">
      <path
        d="M0 -18 C8 -18 14 -12 14 -4 C14 6 0 18 0 18 C0 18 -14 6 -14 -4 C-14 -12 -8 -18 0 -18 Z"
        fill="#ef4444"
      />
      <circle cx="0" cy="-4" r="4.5" fill="white" />
    </g>
  </svg>
);

export default Track;