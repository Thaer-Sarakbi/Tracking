import React from 'react';
import { Modal } from 'react-native';

const ModalComponent = ({ modalVisible, onChange, children }: { modalVisible: boolean, onChange:(arg: boolean) => void, children: any }) => (
    <>
              <Modal
                transparent= {true}
                animationType= 'fade'
                visible= {modalVisible}
                onRequestClose={() => onChange(false)}
              >
                {children}
              </Modal>
    </>
)

export default ModalComponent