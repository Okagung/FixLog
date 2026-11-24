import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, StatusBadge } from './ui';
import { colors, typeIcon, formatDate } from '../theme';

export default function MaintenanceItem({ item, onPress, showMachine = true }) {
  return (
    <Card onPress={onPress}>
      <View style={s.row}>
        <View style={s.icon}>
          <Ionicons name={typeIcon[item.type] || 'construct-outline'} size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.title} numberOfLines={1}>{item.title}</Text>
          {showMachine && item.machine_name ? (
            <Text style={s.sub} numberOfLines={1}>{item.machine_code} • {item.machine_name}</Text>
          ) : null}
          <Text style={s.sub}>{item.type} • {formatDate(item.maintenance_date)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </View>
      <View style={{ marginTop: 10 }}>
        <StatusBadge status={item.status} />
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#E8F0F8', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  sub: { fontSize: 12.5, color: colors.muted, marginTop: 2 },
});
