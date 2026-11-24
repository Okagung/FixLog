import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api, { errMsg } from '../api';
import { colors, formatDate } from '../theme';
import { Loading, ErrorView, Card, StatusBadge, InfoRow, Button, Chip } from '../components/ui';
import MaintenanceItem from '../components/MaintenanceItem';

const STATUSES = ['Normal', 'Perlu Perawatan', 'Rusak'];

export default function MachineDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [machine, setMachine] = useState(null);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

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

  const changeStatus = async (status) => {
    if (status === machine.status || updating) return;
    try {
      setUpdating(true);
      await api.put(`/machines/${id}`, {
        code: machine.code,
        name: machine.name,
        location: machine.location,
        description: machine.description,
        status,
      });
      await load();
    } catch (e) {
      Alert.alert('Gagal', errMsg(e));
    } finally {
      setUpdating(false);
    }
  };

  const remove = () =>
    Alert.alert('Hapus Mesin', 'Mesin beserta seluruh riwayat pemeliharaannya akan dihapus. Lanjutkan?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/machines/${id}`);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Gagal', errMsg(e));
          }
        },
      },
    ]);

  if (error) return <ErrorView message={error} onRetry={load} />;
  if (!machine) return <Loading />;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Card>
        <Text style={s.code}>{machine.code}</Text>
        <Text style={s.name}>{machine.name}</Text>
        <View style={{ marginVertical: 10 }}><StatusBadge status={machine.status} /></View>
        <InfoRow icon="location-outline" label="Lokasi" value={machine.location} />
        <InfoRow icon="calendar-outline" label="Perawatan Terakhir" value={formatDate(machine.last_maintenance)} />
        <InfoRow icon="document-text-outline" label="Deskripsi" value={machine.description} />
      </Card>

      <Card>
        <Text style={s.cardTitle}>Ubah Status Kondisi</Text>
        <View style={s.wrap}>
          {STATUSES.map((st) => (
            <Chip key={st} label={st} active={machine.status === st} onPress={() => changeStatus(st)} />
          ))}
        </View>
      </Card>

      <View style={{ gap: 10 }}>
        <Button title="Tambah Pemeliharaan" icon="add-circle-outline" onPress={() => navigation.navigate('AddMaintenance', { machineId: machine.id })} />
        <Button title="Edit Mesin" icon="create-outline" outline onPress={() => navigation.navigate('MachineForm', { machine })} />
        <Button title="Hapus Mesin" icon="trash-outline" outline color={colors.red} onPress={remove} />
      </View>

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
  cardTitle: { fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  section: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 20, marginBottom: 10 },
});