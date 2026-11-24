import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api, { errMsg } from '../api';
import { colors } from '../theme';
import { Loading, ErrorView, Empty, Card, StatusBadge, Chip } from '../components/ui';

const FILTERS = ['Semua', 'Normal', 'Perlu Perawatan', 'Rusak'];

export default function MachinesScreen({ navigation }) {
  const [list, setList] = useState(null);
  const [error, setError] = useState(null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get('/machines');
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

  const keyword = q.trim().toLowerCase();
  const data = list.filter(
    (m) =>
      (filter === 'Semua' || m.status === filter) &&
      (!keyword || `${m.name} ${m.code} ${m.location}`.toLowerCase().includes(keyword))
  );

  return (
    <View style={s.container}>
      <View style={s.search}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput style={s.input} placeholder="Cari nama, kode, atau lokasi..." value={q} onChangeText={setQ} placeholderTextColor={colors.muted} />
      </View>
      <View style={{ height: 46 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {FILTERS.map((f) => <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />)}
        </ScrollView>
      </View>
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ padding: 16, paddingTop: 6, paddingBottom: 90, flexGrow: 1 }}
        refreshing={refreshing}
        onRefresh={() => { setRefreshing(true); load(); }}
        ListEmptyComponent={<Empty text="Mesin tidak ditemukan" />}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('MachineDetail', { id: item.id })}>
            <View style={s.row}>
              <View style={s.icon}><Ionicons name="hardware-chip-outline" size={24} color={colors.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={s.code}>{item.code}</Text>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.loc}>{item.location}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </View>
            <View style={s.foot}>
              <StatusBadge status={item.status} />
              <Text style={s.loc}>{item.total_maintenance} riwayat</Text>
            </View>
          </Card>
        )}
      />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('MachineForm')}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, marginBottom: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, paddingVertical: 11, paddingHorizontal: 8, color: colors.text },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#E8F0F8', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  code: { fontSize: 12, color: colors.primary, fontWeight: '800' },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  loc: { fontSize: 12.5, color: colors.muted, marginTop: 2 },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 58, height: 58, borderRadius: 29, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6 },
});