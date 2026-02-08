import { useState, useEffect } from 'react';
import { getUsers, getVerificationRequests, getDonations, getVolunteers, getNGOs, getAssignments } from '../api/admin';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const token = localStorage.getItem('token'); // JWT from login

  useEffect(() => {
    const fetchData = async () => {
      setUsers(await getUsers(token));
      setRequests(await getVerificationRequests(token));
      setDonations(await getDonations(token));
      setVolunteers(await getVolunteers(token));
      setNgos(await getNGOs(token));
      setAssignments(await getAssignments(token));
    };
    fetchData();
  }, [token]);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Users</h2>
        <pre>{JSON.stringify(users, null, 2)}</pre>
      </section>

      <section>
        <h2>Verification Requests</h2>
        <pre>{JSON.stringify(requests, null, 2)}</pre>
      </section>

      <section>
        <h2>Food Donations</h2>
        <pre>{JSON.stringify(donations, null, 2)}</pre>
      </section>

      <section>
        <h2>Volunteers</h2>
        <pre>{JSON.stringify(volunteers, null, 2)}</pre>
      </section>

      <section>
        <h2>NGOs</h2>
        <pre>{JSON.stringify(ngos, null, 2)}</pre>
      </section>

      <section>
        <h2>Assignments</h2>
        <pre>{JSON.stringify(assignments, null, 2)}</pre>
      </section>
    </div>
  );
};

export default AdminDashboard;
