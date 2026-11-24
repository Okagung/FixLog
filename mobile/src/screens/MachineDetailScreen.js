import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api, { errMsg } from '../api';
import { colors, formatDate } from '../theme';
import { Loading, ErrorView, Card, StatusBadge, InfoRow, Button } from '../components/ui';
import MaintenanceItem from '../components/MaintenanceItem';

export default function MachineDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [machine, setMachine] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get(`/machines/${id}`);
      setMachine(res.data.data);
    } catch (e) {
      setError(errMsg(e));
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (error) return <ErrorView message={error} onRetry={load} />;
  if (!machine) return <Loading />;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <Card>
        <Text style={s.code}>{machine.code}</Text>
        <Text style={s.name}>{machine.name}</Text>
        <View style={{ marginVertical: 10 }}><StatusBadge status={machine.status} /></View>
        <InfoRow icon="location-outline" label="Lokasi" value={machine.location} />
        <InfoRow icon="calendar-outline" label="Perawatan Terakhir" value={formatDate(machine.last_maintenance)} />
        <InfoRow icon="document-text-outline" label="Deskripsi" value={machine.description} />
      </Card>

      <Button title="Tambah Pemeliharaan" icon="add-circle-outline" onPress={() => navigation.navigate('AddMaintenance', { machineId: machine.id })} />

      <Text style={s.section}>Riwayat Pemeliharaan ({machine.history.length})</Text>
      {machine.history.length === 0 ? (
        <Card><Text style={{ color: colors.muted }}>Belum ada riwayat pemeliharaan.</Text></Card>
      ) : (
        machine.history.map((h) => (
          <MaintenanceItem key={h.id} item={h} showMachine={false} onPress={() => navigation.navigate('MaintenanceDetail', { id: h.id })} />
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  code: { fontSize: 13, color: colors.primary, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  section: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 20, marginBottom: 10 },
});
