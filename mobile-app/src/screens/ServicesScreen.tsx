import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ServicesScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>About Us</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.sectionText}>
          Our mission is to build India's most trusted platform for pre-owned commercial vehicles.
          We are here to eliminate uncertainty by controlling the entire vehicle journey from
          rigorous inspection and fair pricing to seamless financing and dedicated after-sales
          support. Through technology and integrity, we empower our customers to make confident
          decisions that keep their businesses moving forward.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Makes Us Different</Text>
        <View style={styles.featureItem}>
          <Ionicons name="shield-checkmark" size={24} color="#2563eb" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Certified Trucks</Text>
            <Text style={styles.featureText}>
              Every truck goes through rigorous inspection and certification
            </Text>
          </View>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="cash" size={24} color="#2563eb" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Fair Pricing</Text>
            <Text style={styles.featureText}>
              Transparent pricing based on market data and vehicle condition
            </Text>
          </View>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="time" size={24} color="#2563eb" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>24h Response</Text>
            <Text style={styles.featureText}>
              Quick response time for all inquiries and submissions
            </Text>
          </View>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="location" size={24} color="#2563eb" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Pan-India Service</Text>
            <Text style={styles.featureText}>
              Serving customers across all states in India
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactItem}>
          <Ionicons name="call-outline" size={20} color="#6b7280" />
          <Text style={styles.contactText}>+91-XXXX-XXXXXX</Text>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="mail-outline" size={20} color="#6b7280" />
          <Text style={styles.contactText}>info@axlerator.com</Text>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="location-outline" size={20} color="#6b7280" />
          <Text style={styles.contactText}>Mumbai, Maharashtra, India</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
});
