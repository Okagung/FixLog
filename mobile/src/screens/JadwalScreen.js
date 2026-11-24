import React, { useCallback, useState } from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api, { errMsg } from '../api';
import { colors } from '../theme';
import { Loading, ErrorView, Empty } from '../components/ui';
import MaintenanceItem from '../components/MaintenanceItem';

const todayStr = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export default function JadwalScreen({ navigation }) {
  const [list, setList] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get('/maintenance');
      setList(res.data.data);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (error) return <ErrorView message={error} onRetry={load} />;
  if (!list) return <Loading />;

  const t = todayStr();
  const open = list
    .filter((i) => i.status !== 'Selesai')
    .sort((a, b) => a.maintenance_date.localeCompare(b.maintenance_date));

  const sections = [
    { title: 'Terlambat', color: colors.red, data: open.filter((i) => i.maintenance_date < t) },
    { title: 'Hari Ini', color: colors.amber, data: open.filter((i) => i.maintenance_date === t) },
    { title: 'Mendatang', color: colors.primary, data: open.filter((i) => i.maintenance_date > t) },
  ].filter((s) => s.data.length > 0);

  return (
    <View style={s.container}>
      <SectionList
        sections={sections}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        refreshing={refreshing}
        onRefresh={() => { setRefreshing(true); load(); }}
        ListEmptyComponent={<Empty text="Tidak ada pekerjaan yang tertunda" />}
        renderSectionHeader={({ section }) => (
          <Text style={[s.header, { color: section.color }]}>
            {section.title} ({section.data.length})
          </Text>
        )}
        renderItem={({ item }) => (
          <MaintenanceItem item={item} onPress={() => navigation.navigate('MaintenanceDetail', { id: item.id })} />
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { fontSize: 15, fontWeight: '800', marginTop: 6, marginBottom: 10 },
});