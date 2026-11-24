import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';
import api, { errMsg } from '../api';
import { colors } from '../theme';
import { Loading, ErrorView, Chip, Button } from '../components/ui';

const TYPES = ['Preventive', 'Corrective', 'Inspection'];
const STATUSES = ['Pending', 'In Progress', 'Selesai'];
const today = () => new Date().toISOString().slice(0, 10);

export default function AddMaintenanceScreen({ route, navigation }) {
  const [machines, setMachines] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    machine_id: route.params?.machineId || null,
    title: '',
    type: 'Preventive',
    technician: '',
    maintenance_date: today(),
    status: 'Pending',
    notes: '',
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const loadMachines = async () => {
    try {
      setError(null);
      const res = await api.get('/machines');
      setMachines(res.data.data);
    } catch (e) {
      setError(errMsg(e));
    }
  };
  useEffect(() => { loadMachines(); }, []);

  const submit = async () => {
    if (!form.machine_id) return Alert.alert('Validasi', 'Pilih mesin terlebih dahulu.');
    if (!form.title.trim()) return Alert.alert('Validasi', 'Judul pekerjaan wajib diisi.');
    if (!form.technician.trim()) return Alert.alert('Validasi', 'Nama teknisi wajib diisi.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.maintenance_date)) return Alert.alert('Validasi', 'Format tanggal harus YYYY-MM-DD.');
    try {
      setSaving(true);
      await api.post('/maintenance', form);
      Alert.alert('Berhasil', 'Catatan pemeliharaan ditambahkan.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert('Gagal', errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  if (error) return <ErrorView message={error} onRetry={loadMachines} />;
  if (!machines) return <Loading />;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <Text style={s.label}>Mesin</Text>
      <View style={s.wrap}>
        {machines.map((m) => (
          <Chip key={m.id} label={`${m.code}`} active={form.machine_id === m.id} onPress={() => set('machine_id', m.id)} />
        ))}
      </View>
      {form.machine_id ? <Text style={s.hint}>{machines.find((m) => m.id === form.machine_id)?.name}</Text> : null}

      <Text style={s.label}>Judul Pekerjaan</Text>
      <TextInput style={s.input} value={form.title} onChangeText={(v) => set('title', v)} placeholder="Contoh: Penggantian bearing" placeholderTextColor={colors.muted} />

      <Text style={s.label}>Jenis Perawatan</Text>
      <View style={s.wrap}>
        {TYPES.map((t) => <Chip key={t} label={t} active={form.type === t} onPress={() => set('type', t)} />)}
      </View>

      <Text style={s.label}>Teknisi</Text>
      <TextInput style={s.input} value={form.technician} onChangeText={(v) => set('technician', v)} placeholder="Nama teknisi" placeholderTextColor={colors.muted} />

      <Text style={s.label}>Tanggal (YYYY-MM-DD)</Text>
      <TextInput style={s.input} value={form.maintenance_date} onChangeText={(v) => set('maintenance_date', v)} placeholder="2026-11-20" placeholderTextColor={colors.muted} />

      <Text style={s.label}>Status</Text>
      <View style={s.wrap}>
        {STATUSES.map((t) => <Chip key={t} label={t} active={form.status === t} onPress={() => set('status', t)} />)}
      </View>

      <Text style={s.label}>Catatan</Text>
      <TextInput style={[s.input, { height: 100, textAlignVertical: 'top' }]} multiline value={form.notes} onChangeText={(v) => set('notes', v)} placeholder="Keterangan pekerjaan..." placeholderTextColor={colors.muted} />

      <View style={{ marginTop: 20 }}>
        <Button title={saving ? 'Menyimpan...' : 'Simpan'} icon="save-outline" onPress={submit} disabled={saving} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 14, marginBottom: 6 },
  hint: { fontSize: 12.5, color: colors.primary, fontWeight: '600', marginTop: -2 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, color: colors.text, fontSize: 15 },
});
