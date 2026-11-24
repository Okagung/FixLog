export const colors = {
  primary: '#0F4C81',
  primaryDark: '#0A3560',
  accent: '#F59E0B',
  bg: '#F4F6F9',
  card: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#E5E7EB',
  green: '#16A34A',
  amber: '#D97706',
  red: '#DC2626',
  blue: '#2563EB',
};

export const statusColor = {
  Normal: colors.green,
  'Perlu Perawatan': colors.amber,
  Rusak: colors.red,
  Pending: colors.muted,
  'In Progress': colors.blue,
  Selesai: colors.green,
};

export const typeIcon = {
  Preventive: 'shield-checkmark-outline',
  Corrective: 'build-outline',
  Inspection: 'search-outline',
};

export const formatDate = (s) => {
  if (!s) return '-';
  const [y, m, d] = String(s).slice(0, 10).split('-');
  const bln = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${Number(d)} ${bln[Number(m) - 1]} ${y}`;
};
