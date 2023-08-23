import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PixelRatio,
  FlatList,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';
import {moderateScale} from 'react-native-size-matters';
import {showToast} from '../components/Toast';
import {getItemFromStorage, remove, saveItemToStorage} from '../utils/storage';
import {MemoizedRenderData} from '../components/MemoizedData';
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

const Home = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [showCamera, setShowCamera] = useState(0);
  const [data, setData] = useState([]);
  const [previousCode, setPreviousCode] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [ocr, setOcr] = React.useState('');
  const [pixelRatio, setPixelRatio] = React.useState(1);
  const [generate, setGenerate] = React.useState(false);
  const cameraRef = useRef(null);
  const tabsData = [
    {id: 0, value: 'Scan QRCode'},
    {id: 1, value: 'Scanned Cards'},
  ];
  const [hasPermission, setHasPermission] = useState(false);

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

  const renderItem = ({item, index}) => {
    return <MemoizedRenderData item={item} />;
  };

  const getPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    console.log({cameraPermission});
    if (cameraPermission == 'authorized') {
      setShowCamera(true);
    } else {
      const cameraPermission = await Camera.requestCameraPermission();
      console.log({cameraPermission});
      showToast('Please grant camera permission from app settings');
    }
    //  setShowCamera(true);
  };

  const generateAndSaveCSV = async () => {
    try {
      setGenerate(true)
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
      showToast('CSV File Generated')
    } catch (error) {
      console.log('Error generating CSV:', error);
      if(error !='[Error: User did not share]'|| error !=' [Error: User did not share]'){

      }else{
        showToast(`Can't generate csv file`);
      }
      
    }
    finally{
      setGenerate(false)
    }
  };
  renderTextBlocks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.textBlocks.map(this.renderTextBlock)}
    </View>
  );
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;
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
      // Step 1: Retrieve the existing list (if any)
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

  const renderOverlay = () => {
    console.log('{block}', ocr?.result?.blocks);
    return (
      <>
        {ocr?.result?.blocks?.map(block => {
          return block?.lines?.map(line => {
            console.log('lines', line.text);
            return (
              <Text
                style={{
                  fontSize: 25,
                  justifyContent: 'center',
                  // textAlign: 'center',
                  color: 'green',
                }}>
                {line.text}
              </Text>
            );
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
          isActive={true}>
          
          
        </Camera>
        {renderOverlay()}
        <TouchableOpacity
          onPress={() => {
            setShowCamera(false);
          }}
          style={styles.cutText}>
          <Text style={{fontWeight: '700', fontSize: moderateScale(22)}}>
            X
          </Text>
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
                borderWidth: moderateScale(1),
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
        <View style={styles.firstIndexRootView}>
          <View
            style={{
              width: '90%',
              borderRadius: moderateScale(6),
              backgroundColor: '#eff0f3',
              padding: moderateScale(10),
              marginTop: moderateScale(25),
            }}>
            <Text
              style={{
                color: '#151515',
                fontSize: moderateScale(18),
                fontWeight: '700',
                textAlign: 'center',
                marginBottom: moderateScale(10),
              }}>
              Scan QR Code
            </Text>
            <Text
              style={{
                color: '#151515',
                fontSize: moderateScale(14),
                fontWeight: '400',
                textAlign: 'center',
              }}>
              You can scan cards continuously , when your desire data show on
              screen press tab to store your data and data will be save on
              scanned cards tab
            </Text>
          </View>
          <Image
            source={require('../assets/qcode.png')}
            style={{
              width: moderateScale(250),
              height: moderateScale(250),
              marginVertical: moderateScale(20),
            }}
          />
          <TouchableOpacity
            onPress={() => {
              getPermission();
              // setShowCamera(true);
              // selectFile()
            }}
            style={{
              ...styles.touchableStyle,
              backgroundColor: '#5683f6',
            }}>
            <Text
              style={{
                ...styles.toggleText,
                color: 'white',
              }}>
              Scan Now
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{marginTop: moderateScale(15), flex: 1, height: '75%'}}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={7}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            renderItem={(item, index) => renderItem(item, index)}
            ListEmptyComponent={() => {
              return (
                <View style={styles.nodata}>
                  <Text>No data available</Text>
                </View>
              );
            }}
          />
        </View>
      )}

      {tabIndex == 1 && data.length > 0 && (
        <View
          style={{
            height: moderateScale(65),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              eraseData();
            
            }}
            style={{
              ...styles.touchableStyle,
              //   paddingVertical:moderateScale(),
              backgroundColor: '#5683f6',
              width: '45%',
            }}>
            <Text
              style={{
                ...styles.toggleText,
                color: 'white',
              }}>
              Detete Data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              generateAndSaveCSV();
            }}
            style={{
              ...styles.touchableStyle,
              //   paddingVertical:moderateScale(),
              backgroundColor: '#5683f6',
              width: '45%',
            }}>
            {generate?<ActivityIndicator size={'small'} color={'white'}/>:<Text
              style={{
                ...styles.toggleText,
                color: 'white',
              }}>
              Generate CSV
            </Text>}
          </TouchableOpacity>
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
    //   height:50
  },
  toggleText: {
    fontWeight: '700',
    fontSize: moderateScale(13),
  },
  firstIndexRootView: {
    marginTop: moderateScale(15),
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  nodata: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    // flex:1,
    width: '100%',
    height: '100%',
    // marginTop:moderateScale(20),
    // alignSelf:'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cutText:{
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
  tap:{
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
  }
});
