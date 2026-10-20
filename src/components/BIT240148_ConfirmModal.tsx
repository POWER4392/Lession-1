// xac nhan xoa

import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../localization/BIT240148_LanguageContext';
import { BIT240148_Strings } from '../localization/BIT240148_Strings';

interface ConfirmModalProps {
  visible: boolean;
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const BIT240148_ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  name,
  onConfirm,
  onCancel
}) => {
  const { language } = useLanguage();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{BIT240148_Strings.confirmDeleteTitle(language)}</Text>
          <Text style={styles.msg}>{BIT240148_Strings.confirmDeleteMessage(name, language)}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>{BIT240148_Strings.cancel(language)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm}>
              <Text style={styles.deleteText}>{BIT240148_Strings.delete(language)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  box: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    elevation: 4
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8
  },
  msg: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 20,
    lineHeight: 20
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8
  },
  cancelText: {
    color: '#757575',
    fontWeight: '600'
  },
  deleteBtn: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  deleteText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  }
});
