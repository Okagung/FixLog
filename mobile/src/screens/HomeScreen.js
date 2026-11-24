import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api, { errMsg } from '../api';
import { colors } from '../theme';
import { Loading, ErrorView, Card } from '../components/ui';
import MaintenanceItem from '../components/MaintenanceItem';

function Stat({ icon, label, value, color }) {
  return (
    <View style={s.stat}>
      <View style={[s.statIcon, { backgroundColor: color + '1A' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get('/dashboard');
      setData(res.data.data);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (error) return <ErrorView message={error} onRetry={load} />;
  if (!data) return <Loading />;
  const { machines: m, maintenance: t, recent } = data;

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
      <View style={s.hero}>
        <Text style={s.heroSmall}>Total Mesin Terdaftar</Text>
        <Text style={s.heroBig}>{m.total}</Text>
        <Text style={s.heroSmall}>{t.total} aktivitas pemeliharaan tercatat</Text>
      </View>

      <Text style={s.section}>Kondisi Mesin</Text>
      <View style={s.statRow}>
        <Stat icon="checkmark-circle" label="Normal" value={m.normal} color={colors.green} />
        <Stat icon="warning" label="Perlu Rawat" value={m.perlu} color={colors.amber} />
        <Stat icon="close-circle" label="Rusak" value={m.rusak} color={colors.red} />
      </View>

      <Text style={s.section}>Status Pekerjaan</Text>
      <View style={s.statRow}>
        <Stat icon="time" label="Pending" value={t.pending} color={colors.muted} />
        <Stat icon="sync" label="In Progress" value={t.progress} color={colors.blue} />
        <Stat icon="checkmark-done" label="Selesai" value={t.selesai} color={colors.green} />
      </View>

      <Text style={s.section}>Aktivitas Terbaru</Text>
      {recent.length === 0 ? (
        <Card><Text style={{ color: colors.muted }}>Belum ada aktivitas.</Text></Card>
      ) : (
        recent.map((it) => (
          <MaintenanceItem key={it.id} item={it} onPress={() => navigation.navigate('MaintenanceDetail', { id: it.id })} />
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { backgroundColor: colors.primary, borderRadius: 18, padding: 20, marginBottom: 6 },
  heroSmall: { color: '#BFD4EA', fontSize: 13 },
  heroBig: { color: '#fff', fontSize: 44, fontWeight: '800', marginVertical: 2 },
  section: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 16, marginBottom: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 12, marginHorizontal: 4, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 },
  statIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 11.5, color: colors.muted, marginTop: 2 },
});
