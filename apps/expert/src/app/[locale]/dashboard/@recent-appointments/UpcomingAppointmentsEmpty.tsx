"use client";

export default function UpcomingAppointmentsEmpty() {
  return (
    <tr>
      <td colSpan={4} className="py-8 text-center text-gray-700 text-sm">
        No appointments found.
      </td>
    </tr>
  );
}
