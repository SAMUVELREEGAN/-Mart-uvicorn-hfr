import { useCallback, useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminAlert from '../components/AdminAlert';
import AdminButton from '../components/AdminButton';
import SkeletonTable from '../components/SkeletonTable';
import '../styles/admin.css';
import './VendorConfigPage.css';

export default function VendorApplicationsPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get('/admin/vendors', { params: { limit: 100 } });
      const pending = (data.data || []).filter((v) => v.approvalStatus === 'pending');
      setItems(pending);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const viewApplication = async (id) => {
    try {
      const { data } = await adminApi.get(`/admin/vendors/${id}`);
      setSelected(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load application');
    }
  };

  const approve = async (id) => {
    try {
      await adminApi.patch(`/admin/vendors/${id}/approve`);
      setMessage('Vendor approved');
      setSelected(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Approval failed');
    }
  };

  const reject = async (id) => {
    try {
      await adminApi.patch(`/admin/vendors/${id}/reject`, { reason: rejectReason });
      setMessage('Vendor rejected');
      setSelected(null);
      setRejectReason('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Rejection failed');
    }
  };

  return (
    <div>
      <AdminPageHeader title="Vendor Applications" subtitle="Review and approve pending vendor registrations" />
      {message && <AdminAlert type="success" message={message} onClose={() => setMessage(null)} />}
      {error && <AdminAlert type="error" message={error} onClose={() => setError(null)} />}

      {loading ? (
        <SkeletonTable rows={5} cols={4} />
      ) : items.length === 0 ? (
        <p>No pending applications.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Business</th>
              <th>Email</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.businessName}</td>
                <td>{v.email}</td>
                <td>{v.businessType}</td>
                <td>
                  <div className="vendor-applications__actions">
                    <AdminButton label="View" icon="view" size="sm" variant="secondary" title="View application" onClick={() => viewApplication(v.id)} />
                    <AdminButton label="Approve" icon="approve" size="sm" variant="primary" title="Approve vendor" onClick={() => approve(v.id)} />
                    <AdminButton label="Reject" icon="reject" size="sm" variant="danger" title="Reject vendor" onClick={() => viewApplication(v.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <div className="vendor-applications__detail">
          <h3>{selected.businessName}</h3>
          <p><strong>Owner:</strong> {selected.ownerName}</p>
          <p><strong>Email:</strong> {selected.email}</p>
          <p><strong>Phone:</strong> {selected.phone}</p>
          <p><strong>Status:</strong> {selected.approvalStatus}</p>
          <p><strong>Plan ID:</strong> {selected.selectedPlanId}</p>
          <pre>{JSON.stringify(selected.registrationData || {}, null, 2)}</pre>
          <div className="vendor-applications__actions" style={{ marginTop: '1rem' }}>
            <AdminButton label="Approve" icon="approve" variant="primary" title="Approve vendor" onClick={() => approve(selected.id)} />
            <input
              type="text"
              placeholder="Rejection reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <AdminButton label="Reject" icon="reject" variant="danger" title="Reject vendor" onClick={() => reject(selected.id)} />
          </div>
        </div>
      )}
    </div>
  );
}
