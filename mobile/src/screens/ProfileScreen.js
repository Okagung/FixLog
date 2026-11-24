import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { Card, InfoRow } from '../components/ui';

const TECH = ['React Native (Expo)', 'JavaScript', 'React Navigation', 'Axios', 'Node.js + Express.js', 'SQLite', 'GitHub'];

export default function ProfileScreen() {
  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <View style={s.header}>
        <View style={s.logo}><Ionicons name="construct" size={40} color="#fff" /></View>
        <Text style={s.app}>FixLog</Text>
        <Text style={s.tag}>Industrial Maintenance Tracker</Text>
        <Text style={s.ver}>Versi 1.0.0</Text>
      </View>

      <Card>
        <Text style={s.h}>Tentang Aplikasi</Text>
        <Text style={s.p}>
          FixLog membantu mencatat, mengelola, dan memantau aktivitas pemeliharaan mesin di lingkungan industri.
          Pengguna dapat melihat kondisi mesin, mencatat pekerjaan perawatan, dan menelusuri riwayat pemeliharaan setiap mesin.
        </Text>
      </Card>

      <Card>
        <Text style={s.h}>Pengembang</Text>
        <InfoRow icon="person-outline" label="Nama" value="I Dewa Gede Agung Oka W.B.D" />
        <InfoRow icon="card-outline" label="NIM" value="21120124140149" />
        <InfoRow icon="school-outline" label="Program Studi" value="Teknik Komputer" />
        <InfoRow icon="business-outline" label="Universitas" value="Universitas Diponegoro" />
        <InfoRow icon="book-outline" label="Mata Kuliah" value="Praktikum Pemrograman Perangkat Bergerak 2026" />
      </Card>

      <Card>
        <Text style={s.h}>Teknologi</Text>
        <View style={s.wrap}>
          {TECH.map((t) => (
            <View key={t} style={s.tech}><Text style={s.techText}>{t}</Text></View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { alignItems: 'center', paddingVertical: 20 },
  logo: { width: 80, height: 80, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  app: { fontSize: 26, fontWeight: '800', color: colors.text },
  tag: { fontSize: 14, color: colors.muted, marginTop: 2 },
  ver: { fontSize: 12, color: colors.muted, marginTop: 4 },
  h: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 8 },
  p: { fontSize: 14, color: colors.muted, lineHeight: 21 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  tech: { backgroundColor: '#E8F0F8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  techText: { color: colors.primary, fontWeight: '600', fontSize: 12.5 },
});
