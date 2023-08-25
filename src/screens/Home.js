import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {showToast} from '../components/Toast';
import {getItemFromStorage, remove, saveItemToStorage} from '../utils/storage';
import * as Papa from 'papaparse';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {scanOCR} from 'vision-camera-ocr';
import {runOnJS} from 'react-native-reanimated';

import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Qrscan from '../components/Qrscan';
import ListData from '../components/ListData';
import Button from '../components/Button';

const Home = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [showCamera, setShowCamera] = useState(0);
  const [data, setData] = useState([]);
  const [ocr, setOcr] = React.useState('');
  const [generate, setGenerate] = React.useState(false);
  const tabsData = [
    {id: 0, value: 'Scan QRCode'},
    {id: 1, value: 'Scanned Cards'},
  ];
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;

  useEffect(() => {
    getPermissions();
    getDataFRomAsync();
  }, []);

  const getDataFRomAsync = async () => {
    try {
      const serializedList = await getItemFromStorage('myListKey');
      if (serializedList) {
        const existingList = JSON.parse(serializedList);
        setData(existingList);
      } else {
        setData([]); // Set an empty array if no data is found
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getPermissions = async () => {
    try {
      const cameraPermission = await Camera.requestCameraPermission();
    } catch (error) {}
  };

  const getPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission == 'authorized') {
      setShowCamera(true);
    } else {
      const cameraPermission = await Camera.requestCameraPermission();
      console.log({cameraPermission});
      showToast('Please grant camera permission from app settings');
    }
  };

  const generateAndSaveCSV = async () => {
    try {
      setGenerate(true);
      const serializedList = await getItemFromStorage('myListKey');
      const existingList = JSON.parse(serializedList) || [];
      const csvData = Papa.unparse(existingList);
      let date = (N = new Date().getDate());
      let sec = (N = new Date().getSeconds());
      const csvFilePath = `${RNFS.DocumentDirectoryPath}/ScannedCards${date}_${sec}.csv`;
      await RNFS.writeFile(csvFilePath, csvData, 'utf8');
      // Share the CSV file
      await Share.open({
        url: `file://${csvFilePath}`,
        type: 'text/csv',
        subject: 'Scanned Cards Data',
      });
      showToast('CSV File Generated');
    } catch (error) {
      if (
        error != '[Error: User did not share]' ||
        error != ' [Error: User did not share]'
      ) {
      } else {
        showToast(`Can't generate csv file`);
      }
    } finally {
      setGenerate(false);
    }
  };

  const fetchData = async () => {
    try {
      const serializedList = await getItemFromStorage('myListKey');
      const existingList = JSON.parse(serializedList) || [];
      setData(existingList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const addItemToList = async newItem => {
    try {
      const serializedList = await getItemFromStorage('myListKey');
      const existingList = JSON.parse(serializedList) || [];
      existingList.push(newItem);
      const updatedSerializedList = JSON.stringify(existingList);
      await saveItemToStorage('myListKey', updatedSerializedList);
      fetchData();
      showToast('data added');
      setData(updatedSerializedList);
      console.log('Item added successfully.', updatedSerializedList);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };
  const eraseData = async () => {
    try {
      await remove('myListKey');
      getDataFRomAsync();
    } catch (error) {}
  };

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const data = scanOCR(frame);
    runOnJS(setOcr)(data);
  }, []);

  renderTextBlocks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.textBlocks.map(this.renderTextBlock)}
    </View>
  );

  const renderOverlay = () => {
    return (
      <>
        {ocr?.result?.blocks?.map(block => {
          return block?.lines?.map(line => {
            return <Text style={styles.greenTeext}>{line.text}</Text>;
          });
        })}
      </>
    );
  };
  if (showCamera && device) {
    return (
      <View style={{flex: 1}}>
        <Camera
          style={[StyleSheet.absoluteFill]}
          frameProcessor={frameProcessor}
          device={device}
          isActive={true}></Camera>
        {renderOverlay()}
        <TouchableOpacity
          onPress={() => {
            setShowCamera(false);
          }}
          style={styles.cutText}>
          <Text style={styles.close}>X</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (ocr?.result?.blocks[3]?.text && ocr?.result?.blocks[4]?.text) {
              let a = {
                code: ocr?.result?.blocks[3]?.text,
                name: ocr?.result?.blocks[4]?.text,
              };
              addItemToList(a);
            }
          }}
          style={styles.tap}></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.toggleTabView}>
        {tabsData.map((item, index) => {
          return (
            <TouchableOpacity
              key={index.toString()}
              onPress={() => {
                setTabIndex(index);
              }}
              style={{
                ...styles.touchableStyle,
                backgroundColor: tabIndex === index ? '#5683f6' : 'transparent',
                borderColor: tabIndex === index ? 'transparent' : '#5683f6',
              }}>
              <Text
                style={{
                  ...styles.toggleText,
                  color: tabIndex === index ? '#fff' : '#5683f6',
                }}>
                {item.value}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {tabIndex == 0 ? (
        <Qrscan onPress={() => getPermission()} />
      ) : (
        <ListData data={data} />
      )}

      {tabIndex == 1 && data.length > 0 && (
        <View style={styles.buttonView}>
          <Button
            onPress={() => {
              eraseData();
            }}
            text={'Delete Data'}
          />

          <Button
            loading={generate}
            onPress={() => {
              generateAndSaveCSV();
            }}
            text={'Generate CSV'}
          />
        </View>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScale(10),
  },

  toggleTabView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  touchableStyle: {
    width: moderateScale(140),
    paddingVertical: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(7),
    borderWidth: moderateScale(1),
  },
  toggleText: {
    fontWeight: '700',
    fontSize: moderateScale(13),
  },

  camera: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cutText: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 10,
    right: 10,
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tap: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
  },
  buttonView: {
    height: moderateScale(65),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backColor: {
    backgroundColor: '#5683f6',
    width: '45%',
  },
  greenTeext: {
    fontSize: 25,
    justifyContent: 'center',
    color: 'green',
  },
  close: {
    fontWeight: '700',
    fontSize: moderateScale(22),
  },
});
