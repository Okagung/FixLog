import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';
import api, { errMsg } from '../api';
import { colors } from '../theme';
import { Chip, Button } from '../components/ui';

const STATUSES = ['Normal', 'Perlu Perawatan', 'Rusak'];

export default function MachineFormScreen({ route, navigation }) {
  const editing = route.params?.machine || null; // jika ada = mode edit
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: editing?.code || '',
    name: editing?.name || '',
    location: editing?.location || '',
    status: editing?.status || 'Normal',
    description: editing?.description || '',
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.code.trim()) return Alert.alert('Validasi', 'Kode mesin wajib diisi.');
    if (!form.name.trim()) return Alert.alert('Validasi', 'Nama mesin wajib diisi.');
    if (!form.location.trim()) return Alert.alert('Validasi', 'Lokasi wajib diisi.');
    try {
      setSaving(true);
      if (editing) await api.put(`/machines/${editing.id}`, form);
      else await api.post('/machines', form);
      Alert.alert('Berhasil', editing ? 'Data mesin diperbarui.' : 'Mesin baru ditambahkan.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      const msg = errMsg(e);
      Alert.alert('Gagal', msg.includes('UNIQUE') ? 'Kode mesin sudah dipakai mesin lain.' : msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <Text style={s.label}>Kode Mesin</Text>
      <TextInput style={s.input} value={form.code} onChangeText={(v) => set('code', v)} placeholder="Contoh: RM-007" autoCapitalize="characters" placeholderTextColor={colors.muted} />

      <Text style={s.label}>Nama Mesin</Text>
      <TextInput style={s.input} value={form.name} onChangeText={(v) => set('name', v)} placeholder="Contoh: Roller Mill A2" placeholderTextColor={colors.muted} />

      <Text style={s.label}>Lokasi</Text>
      <TextInput style={s.input} value={form.location} onChangeText={(v) => set('location', v)} placeholder="Contoh: Mill A - Lantai 2" placeholderTextColor={colors.muted} />

      <Text style={s.label}>Status Kondisi</Text>
      <View style={s.wrap}>
        {STATUSES.map((t) => <Chip key={t} label={t} active={form.status === t} onPress={() => set('status', t)} />)}
      </View>

      <Text style={s.label}>Deskripsi</Text>
      <TextInput style={[s.input, { height: 100, textAlignVertical: 'top' }]} multiline value={form.description} onChangeText={(v) => set('description', v)} placeholder="Keterangan mesin..." placeholderTextColor={colors.muted} />

      <View style={{ marginTop: 20 }}>
        <Button title={saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Simpan'} icon="save-outline" onPress={submit} disabled={saving} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 14, marginBottom: 6 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, color: colors.text, fontSize: 15 },
});