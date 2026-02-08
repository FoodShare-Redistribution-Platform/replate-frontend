import React, { useEffect, useMemo, useState } from 'react';

const mockAssignments = [
  {
    id: 'DEL-1001',
    volunteerName: 'Ava Thompson',
    donationItem: 'Canned Beans (20 packs)',
    status: 'Ongoing',
    route: 'Central Hub → Maple St Shelter',
  },
  {
    id: 'DEL-1002',
    volunteerName: 'Liam Patel',
    donationItem: 'Blankets (15)',
    status: 'Completed',
    route: 'North Depot → Riverbend Center',
  },
  {
    id: 'DEL-1003',
    volunteerName: 'Noah Kim',
    donationItem: 'Fresh Produce (12 crates)',
    status: 'Pending',
    route: 'East Hub → Sunrise Pantry',
  },
  {
    id: 'DEL-1004',
    volunteerName: 'Sophia Garcia',
    donationItem: 'Hygiene Kits (30)',
    status: 'Ongoing',
    route: 'West Warehouse → Hope Street Outreach',
  },
  {
    id: 'DEL-1005',
    volunteerName: 'Ethan Brooks',
    donationItem: 'Rice (10 bags)',
    status: 'Pending',
    route: 'Central Hub → Lakeside Shelter',
  },
];

const statusOptions = ['All', 'Ongoing', 'Completed', 'Pending'];

function LogisticsRouting() {
  const [assignments, setAssignments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    setAssignments(mockAssignments);
  }, []);

  const filteredAssignments = useMemo(() => {
    if (statusFilter === 'All') {
      return assignments;
    }
    return assignments.filter((assignment) => assignment.status === statusFilter);
  }, [assignments, statusFilter]);

  const handleMarkDelay = (deliveryId) => {
    console.log(`Delay marked for delivery ${deliveryId}`);
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Logistics Routing</h2>
          <p className="text-sm text-gray-500">
            Track delivery assignments and route status updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-600" htmlFor="status-filter">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Delivery ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Volunteer Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Donation Item
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Route
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredAssignments.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={6}>
                  No assignments found for the selected status.
                </td>
              </tr>
            ) : (
              filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {assignment.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {assignment.volunteerName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {assignment.donationItem}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={
                        assignment.status === 'Completed'
                          ? 'inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700'
                          : assignment.status === 'Ongoing'
                          ? 'inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700'
                          : 'inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'
                      }
                    >
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{assignment.route}</td>
                  <td className="px-4 py-3 text-right text-sm">
                    <button
                      type="button"
                      onClick={() => handleMarkDelay(assignment.id)}
                      className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
                    >
                      Mark Delay
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LogisticsRouting;
