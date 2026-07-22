import { useEffect, useState } from "react";
import {
  ChevronDown,
  Search,
  SlidersHorizontal,
  Download,
  MoreVertical,
} from "lucide-react";
import axios from "../../Config/axiosconfig";

type TabKey = "both" | "assist" | "chauffeur";

type StatusKey =
  | "Pending"
  | "Scheduled"
  | "In Transit"
  | "Completed"
  | "Cancelled";

interface RequestRow {
  requestId: string;
  requestDate: string;
  time: string;
  motoristId: string;
  motoristName: string;
  email: string;
  phoneNo: string;
  location1: string;
  location2: string;
  spId: string;
  spName: string;
  spEmail: string;
  spPhoneNo: string;
  serviceType: string;
  serviceCharge: string;
  commission: string;
  duration: string;
  eta: string;
  status: StatusKey;
}

// const ROWS: RequestRow[] = [
//   { requestId: "123456", requestDate: "12/04/2024", time: "08:53am", motoristId: "12345", motoristName: "James Adeleke", email: "Jamesadeleke@gmail.com", phoneNo: "+124567809872", location1: "Texas", location2: "New Jersey", spId: "12345", spName: "James Adeleke", spEmail: "Jamesadeleke@gmail.com", spPhoneNo: "+124567809872", serviceType: "Chaffeur", serviceCharge: "$34.00", commission: "$4", duration: "1h 30M", eta: "3:00PM", status: "Pending" },
//   { requestId: "123456", requestDate: "12/04/2024", time: "08:53am", motoristId: "12345", motoristName: "James Adeleke", email: "Jamesadeleke@gmail.com", phoneNo: "+124567809872", location1: "Texas", location2: "New Jersey", spId: "12345", spName: "James Adeleke", spEmail: "Jamesadeleke@gmail.com", spPhoneNo: "+124567809872", serviceType: "Chaffeur", serviceCharge: "$34.00", commission: "$4", duration: "1h 30M", eta: "3:00PM", status: "Scheduled" },
//   { requestId: "123456", requestDate: "12/04/2024", time: "08:53am", motoristId: "12345", motoristName: "James Adeleke", email: "Jamesadeleke@gmail.com", phoneNo: "+124567809872", location1: "Texas", location2: "", spId: "12345", spName: "", spEmail: "", spPhoneNo: "+124567809872", serviceType: "Assist", serviceCharge: "$34.00", commission: "$4", duration: "1h 30M", eta: "3:00PM", status: "Pending" },
//   { requestId: "123456", requestDate: "12/04/2024", time: "08:53am", motoristId: "12345", motoristName: "James Adeleke", email: "Jamesadeleke@gmail.com", phoneNo: "+124567809872", location1: "Texas", location2: "New Jersey", spId: "12345", spName: "James Adeleke", spEmail: "Jamesadeleke@gmail.com", spPhoneNo: "+124567809872", serviceType: "Chaffeur", serviceCharge: "$34.00", commission: "$4", duration: "1h 30M", eta: "3:00PM", status: "Pending" },
//   { requestId: "123456", requestDate: "12/04/2024", time: "08:53am", motoristId: "12345", motoristName: "James Adeleke", email: "Jamesadeleke@gmail.com", phoneNo: "+124567809872", location1: "Texas", location2: "", spId: "", spName: "", spEmail: "", spPhoneNo: "+124567809872", serviceType: "Assist", serviceCharge: "$34.00", commission: "$4", duration: "1h 30M", eta: "3:00PM", status: "Pending" },
//   { requestId: "123456", requestDate: "12/04/2024", time: "08:53am", motoristId: "12345", motoristName: "James Adeleke", email: "Jamesadeleke@gmail.com", phoneNo: "+124567809872", location1: "Texas", location2: "New Jersey", spId: "12345", spName: "James Adeleke", spEmail: "Jamesadeleke@gmail.com", spPhoneNo: "+124567809872", serviceType: "Chaffeur", serviceCharge: "$34.00", commission: "$4", duration: "1h 30M", eta: "3:00PM", status: "In Transit" },
//   { requestId: "123456", requestDate: "12/04/2024", time: "08:53am", motoristId: "12345", motoristName: "James Adeleke", email: "Jamesadeleke@gmail.com", phoneNo: "+124567809872", location1: "Texas", location2: "", spId: "12345", spName: "", spEmail: "", spPhoneNo: "+124567809872", serviceType: "Assist", serviceCharge: "$34.00", commission: "$4", duration: "1h 30M", eta: "3:00PM", status: "In Transit" },
//   { requestId: "123456", requestDate: "12/04/2024", time: "08:53am", motoristId: "12345", motoristName: "James Adeleke", email: "Jamesadeleke@gmail.com", phoneNo: "+124567809872", location1: "Texas", location2: "New Jersey", spId: "12345", spName: "James Adeleke", spEmail: "Jamesadeleke@gmail.com", spPhoneNo: "+124567809872", serviceType: "Chaffeur", serviceCharge: "$34.00", commission: "$4", duration: "1h 30M", eta: "3:00PM", status: "In Transit" },
//   { requestId: "123456", requestDate: "12/04/2024", time: "08:53am", motoristId: "12345", motoristName: "James Adeleke", email: "Jamesadeleke@gmail.com", phoneNo: "+124567809872", location1: "Texas", location2: "", spId: "12345", spName: "", spEmail: "", spPhoneNo: "+124567809872", serviceType: "Assist", serviceCharge: "$34.00", commission: "$4", duration: "1h 30M", eta: "3:00PM", status: "Complete" },
//   { requestId: "123456", requestDate: "12/04/2024", time: "08:53am", motoristId: "12345", motoristName: "James Adeleke", email: "Jamesadeleke@gmail.com", phoneNo: "+124567809872", location1: "Texas", location2: "New Jersey", spId: "12345", spName: "James Adeleke", spEmail: "Jamesadeleke@gmail.com", spPhoneNo: "+124567809872", serviceType: "Chaffeur", serviceCharge: "$34.00", commission: "$4", duration: "1h 30M", eta: "3:00PM", status: "Complete" },
//   { requestId: "123456", requestDate: "12/04/2024", time: "08:53am", motoristId: "12345", motoristName: "James Adeleke", email: "Jamesadeleke@gmail.com", phoneNo: "+124567809872", location1: "Texas", location2: "New Jersey", spId: "12345", spName: "James Adeleke", spEmail: "Jamesadeleke@gmail.com", spPhoneNo: "+124567809872", serviceType: "Chaffeur", serviceCharge: "$34.00", commission: "$4", duration: "1h 30M", eta: "3:00PM", status: "Complete" },
//   { requestId: "123456", requestDate: "12/04/2024", time: "08:53am", motoristId: "12345", motoristName: "James Adeleke", email: "Jamesadeleke@gmail.com", phoneNo: "+124567809872", location1: "Texas", location2: "New Jersey", spId: "12345", spName: "James Adeleke", spEmail: "Jamesadeleke@gmail.com", spPhoneNo: "+124567809872", serviceType: "Chaffeur", serviceCharge: "$34.00", commission: "$4", duration: "1h 30M", eta: "3:00PM", status: "Cancelled" },
//   { requestId: "123456", requestDate: "12/04/2024", time: "08:53am", motoristId: "12345", motoristName: "James Adeleke", email: "Jamesadeleke@gmail.com", phoneNo: "+124567809872", location1: "Texas", location2: "New Jersey", spId: "12345", spName: "James Adeleke", spEmail: "Jamesadeleke@gmail.com", spPhoneNo: "+124567809872", serviceType: "Chaffeur", serviceCharge: "$34.00", commission: "$4", duration: "1h 30M", eta: "3:00PM", status: "Cancelled" },
// ];

const STATUS_STYLES: Record<StatusKey, string> = {
  Pending: "text-amber-500",
  Scheduled: "text-blue-500",
  "In Transit": "text-emerald-500",
  Completed: "text-sky-500",
  Cancelled: "text-red-500",
};

const COLUMNS: { key: string; label: string }[] = [
  { key: "requestId", label: "Request ID" },
  { key: "requestDate", label: "Request Date" },
  { key: "time", label: "Time" },
  { key: "motoristId", label: "Motorist ID" },
  { key: "motoristName", label: "Motorist Name" },
  { key: "email", label: "Email" },
  { key: "phoneNo", label: "Phone No" },
  { key: "location1", label: "Location 1" },
  { key: "location2", label: "Location 2" },
  { key: "spId", label: "SP ID" },
  { key: "spName", label: "Sp Name" },
  { key: "spEmail", label: "Email" },
  { key: "spPhoneNo", label: "Phone No" },
  { key: "serviceType", label: "Service Type" },
  { key: "serviceCharge", label: "Service Charge" },
  { key: "commission", label: "Commission" },
  { key: "duration", label: "Duration" },
  { key: "eta", label: "ETA" },
  { key: "status", label: "Service Status" },
];

const AllRequest = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("both");

  const [rows, setRows] = useState<RequestRow[]>([]);
const [loading, setLoading] = useState(false);


  const token = localStorage.getItem("token")


  const displayValue = (value: any): string => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "N/A";
  }

  return String(value);
};


const getTracking = async () => {
  try {
    setLoading(true);

    const res = await axios.get("/admin/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Bookings response:", res.data);

    const bookings = res.data.data.bookings
    console.log("this is the bookings:", bookings);
    

const formattedRows: RequestRow[] = bookings.map((booking: any) => ({
  requestId: displayValue(booking.request_id),

  requestDate: booking.request_date
    ? new Date(booking.request_date).toLocaleDateString("en-GB")
    : "N/A",

  time: displayValue(booking.request_time),

  // Motorist
  motoristId: displayValue(booking.motorist_id),
  motoristName: displayValue(booking.motorist_name || booking.customer_name),
  email: displayValue(booking.customer_email),
  phoneNo: displayValue(booking.customer_phone),

  // Locations
  location1: displayValue(booking.pickup_address),
  location2: displayValue(booking.destination_address), // API doesn't currently return this

  // Service Provider
  spId: displayValue(booking.provider_id), // API doesn't currently return this
  spName: displayValue(booking.provider_name), // API doesn't currently return this
  spEmail: displayValue(booking.provider_email),
  spPhoneNo: displayValue(booking.provider_phone),

  // Booking
  serviceType: displayValue(booking.service_type),

  serviceCharge: displayValue(booking.price),

  commission: displayValue(booking.commission),

  duration: displayValue(booking.duration), // API doesn't currently return this

  eta: displayValue(booking.eta), // API doesn't currently return this

  status: displayValue(booking.status || "Pending") as StatusKey,
}));
    setRows(formattedRows);
  } catch (error) {
    console.log("Error fetching bookings:", error);
  } finally {
    setLoading(false);
  }
};



useEffect(()=>{
  getTracking()
},[])








  return (
    <div className="flex h-full w-full flex-col bg-white p-4 font-sans text-sm">
      {/* ---------------------------------------------------------- */}
      {/* Top bar                                                     */}
      {/* ---------------------------------------------------------- */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-base font-semibold text-gray-900">
          All requests
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
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
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              placeholder="Search"
              className="w-36 text-xs text-gray-600 outline-none placeholder:text-gray-400"
            />
          </div>

          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </button>

          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Table                                                       */}
      {/* ---------------------------------------------------------- */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1600px] border-collapse text-left">
            <thead>
              <tr className="bg-blue-600 text-white">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="whitespace-nowrap px-3 py-3 text-xs font-semibold"
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      <ChevronDown className="h-3 w-3" />
                    </span>
                  </th>
                ))}
                <th className="w-8 px-3 py-3" />
              </tr>
            </thead>
          <tbody>
  {loading ? (
    <tr>
      <td
        colSpan={COLUMNS.length + 1}
        className="py-10 text-center text-gray-500"
      >
        Loading bookings...
      </td>
    </tr>
  ) : rows.length === 0 ? (
    <tr>
      <td
        colSpan={COLUMNS.length + 1}
        className="py-10 text-center text-gray-500"
      >
        No bookings found
      </td>
    </tr>
  ) : (
    rows.map((row, i) => (
      <tr
                  key={i}
                  className="border-b border-gray-100 text-xs text-gray-700 hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-3 py-3">{row.requestId}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.requestDate}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.time}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.motoristId}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.motoristName}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.email}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.phoneNo}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.location1}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.location2}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.spId}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.spName}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.spEmail}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.spPhoneNo}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.serviceType}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.serviceCharge}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.commission}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.duration}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.eta}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span
                      className={`flex items-center gap-1.5 font-medium ${STATUS_STYLES[row.status]}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-400">
                    <button>
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
    ))
  )}
</tbody>
          </table>
        </div>

        {/* decorative horizontal scroll indicator, mirrors the table's real scrollbar */}
        {/* <div className="mx-3 mt-1 h-1.5 rounded-full bg-gray-100">
          <div className="h-1.5 w-1/3 rounded-full bg-blue-500" />
        </div> */}
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Footer / pagination                                         */}
      {/* ---------------------------------------------------------- */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>1 - 14 of 40 Pages</span>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-50">
            Previous
          </button>
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllRequest;