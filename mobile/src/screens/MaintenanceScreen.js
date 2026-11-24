import React, { useCallback, useState } from 'react';
import { View, FlatList, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api, { errMsg } from '../api';
import { colors } from '../theme';
import { Loading, ErrorView, Empty, Chip } from '../components/ui';
import MaintenanceItem from '../components/MaintenanceItem';

const FILTERS = ['Semua', 'Pending', 'In Progress', 'Selesai'];

export default function MaintenanceScreen({ navigation }) {
  const [list, setList] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('Semua');
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

  const data = list.filter((i) => filter === 'Semua' || i.status === filter);

  return (
    <View style={s.container}>
      <View style={{ height: 52, paddingTop: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {FILTERS.map((f) => <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />)}
        </ScrollView>
      </View>
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ padding: 16, paddingBottom: 90, flexGrow: 1 }}
        refreshing={refreshing}
        onRefresh={() => { setRefreshing(true); load(); }}
        ListEmptyComponent={<Empty text="Belum ada aktivitas pemeliharaan" />}
        renderItem={({ item }) => (
          <MaintenanceItem item={item} onPress={() => navigation.navigate('MaintenanceDetail', { id: item.id })} />
        )}
      />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('AddMaintenance')}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 58, height: 58, borderRadius: 29, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6 },
});
