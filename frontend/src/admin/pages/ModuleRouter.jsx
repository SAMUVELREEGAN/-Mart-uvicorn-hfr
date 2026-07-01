import { Navigate, useParams } from 'react-router-dom';
import { getModuleByKey } from '../config/modules';
import ModulePage from './ModulePage';

const RESERVED = new Set(['login', 'profile']);

export default function AdminModuleRouter() {
  const { moduleKey } = useParams();
  if (RESERVED.has(moduleKey)) return <Navigate to="/admin" replace />;
  const config = getModuleByKey(moduleKey);
  if (!config) return <Navigate to="/admin" replace />;
  return <ModulePage config={config} />;
}
