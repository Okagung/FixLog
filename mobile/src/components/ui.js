import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, statusColor } from '../theme';

export function StatusBadge({ status }) {
  const c = statusColor[status] || colors.muted;
  return (
    <View style={[s.badge, { backgroundColor: c + '1A' }]}>
      <View style={[s.dot, { backgroundColor: c }]} />
      <Text style={[s.badgeText, { color: c }]}>{status}</Text>
    </View>
  );
}

export function Card({ children, onPress, style }) {
  const Comp = onPress ? TouchableOpacity : View;
  return (
    <Comp activeOpacity={0.7} onPress={onPress} style={[s.card, style]}>
      {children}
    </Comp>
  );
}

export function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[s.chip, active && s.chipActive]}>
      <Text style={[s.chipText, active && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Loading() {
  return (
    <View style={s.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export function ErrorView({ message, onRetry }) {
  return (
    <View style={s.center}>
      <Ionicons name="cloud-offline-outline" size={48} color={colors.muted} />
      <Text style={s.errText}>{message}</Text>
      <TouchableOpacity style={s.btn} onPress={onRetry}>
        <Text style={s.btnText}>Coba Lagi</Text>
      </TouchableOpacity>
    </View>
  );
}

export function Empty({ text }) {
  return (
    <View style={s.center}>
      <Ionicons name="file-tray-outline" size={44} color={colors.muted} />
      <Text style={s.errText}>{text}</Text>
    </View>
  );
}

export function Button({ title, onPress, color = colors.primary, icon, outline, disabled }) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[s.btn, { backgroundColor: outline ? 'transparent' : color, borderColor: color, borderWidth: 1.5, opacity: disabled ? 0.6 : 1 }]}>
      {icon ? <Ionicons name={icon} size={18} color={outline ? color : '#fff'} style={{ marginRight: 6 }} /> : null}
      <Text style={[s.btnText, outline && { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function InfoRow({ icon, label, value }) {
  return (
    <View style={s.infoRow}>
      <Ionicons name={icon} size={18} color={colors.primary} style={{ marginTop: 2 }} />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value || '-'}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errText: { color: colors.muted, textAlign: 'center', marginTop: 10, marginBottom: 14 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: 13, paddingHorizontal: 20, borderRadius: 12 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  infoRow: { flexDirection: 'row', paddingVertical: 8 },
  infoLabel: { fontSize: 12, color: colors.muted },
  infoValue: { fontSize: 15, color: colors.text, fontWeight: '600', marginTop: 1 },
});
