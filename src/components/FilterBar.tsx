import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FilterType } from '../features/tasks/model/Task';

interface FilterOption {
  label: string;
  value: FilterType;
}

const FILTER_OPTIONS: FilterOption[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Completadas', value: 'completed' },
];

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterBar = ({ activeFilter, onFilterChange }: FilterBarProps) => {
  return (
    <View style={styles.container}>
      {FILTER_OPTIONS.map(option => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onFilterChange(option.value)}
          activeOpacity={0.7}
          style={[styles.tab, activeFilter === option.value && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabLabel,
              activeFilter === option.value && styles.activeTabLabel,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#888',
  },
  activeTabLabel: {
    color: '#1A1A2E',
    fontWeight: '700',
  },
});

export default FilterBar;
