import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View,PixelRatio, FlatList, Alert, Image, Button, Dimensions, Clipboard} from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';
import {moderateScale} from 'react-native-size-matters';
import {showToast} from '../components/Toast';
import {getItemFromStorage, saveItemToStorage} from '../utils/storage';
import {MemoizedRenderData} from '../components/MemoizedData';
import * as Papa from 'papaparse';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { labelImage } from "vision-camera-image-labeler";
import { scanOCR } from 'vision-camera-ocr';
import { runOnJS } from 'react-native-reanimated';

// import RNFS from 'react-native-fs';
// import Share from 'react-native-share';

const Home = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [showCamera, setShowCamera] = useState(0);
  const [data, setData] = useState([]);
  const [previousCode, setPreviousCode] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [ocr, setOcr] = React.useState('');
  const [pixelRatio, setPixelRatio] = React.useState(1);
  const cameraRef = useRef(null);
  const tabsData = [
    {id: 0, value: 'Scan QRCode'},
    {id: 1, value: 'Scanned Cards'},
  ];
  const [hasPermission, setHasPermission] = useState(false);
  // const currentLabel = useSharedValue('');

  // const devices = useCameraDevices();
  // const device = devices.back;

  useEffect(() => {
   getPermissions()
  }, []);
 
const getPermissions=async()=>{
  try {
    const cameraPermission = await Camera.requestCameraPermission();
  } catch (error) {
    
  }
  
}

  const renderItem = ({item, index}) => {
    return <MemoizedRenderData item={item} />;
  };
 
  const getPermission=async()=>{
    const cameraPermission = await Camera.getCameraPermissionStatus()
           console.log({cameraPermission})
           if(cameraPermission=="authorized"){
            setShowCamera(true);
           }
           else{
            const cameraPermission = await Camera.requestCameraPermission();
            console.log({cameraPermission})
             showToast("Please grant camera permission from app settings")
           }
          //  setShowCamera(true);
  }
  renderTextBlocks = () => (
<View style={styles.facesContainer} pointerEvents="none">
{
this.state.textBlocks.map(this.renderTextBlock)
}
</View>
);
  const devices = useCameraDevices('wide-angle-camera')
  const device = devices.back
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const data = scanOCR(frame);
    runOnJS(setOcr)(data);
  }, []);
  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet';
  //   // console.log({frame})
  //   const scannedOcr = scanOCR(frame);
  //   if(scannedOcr.result?.blocks?.length>0){
  //     console.log(scannedOcr.result?.blocks[0].lines[0].text)
  //   }
   
  // }, []);
  const renderOverlay = () => {
    console.log('{block}',ocr?.result?.blocks)
    return (
      <>
      <View style={{borderWidth:1,borderColor:'green'}}>
      <Text
                style={{
                  fontSize: 25,
                  justifyContent: 'center',
                  // textAlign: 'center',
                  color:'green'
                }}
              >
                {ocr?.result?.text}
              </Text>
      </View>
      
        {/* {ocr?.result?.blocks?.map((block) => {
          console.log('{block}',block?.lines)
          if(block.text==''){
            return null
          }
          return (
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(block.text);
                Alert.alert(`"${block.text}" copied to the clipboard`);
              }}
              style={{
                position: 'absolute',
                // left: block.frame.x * pixelRatio,
                // top: block.frame.y * pixelRatio,
                backgroundColor: 'white',
                marginVertical:moderateScale(3)
                // padding: 8,
                // borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                {block.text}
              </Text>
            </TouchableOpacity>
          );
        })} */}
      </>
    );
  };
  if (device == null) return <Text>vfdfdf</Text>
  if (showCamera) {
    return (
      <View style={{flex:1}}>
      <Camera
       style={[StyleSheet.absoluteFill]}
        // style={{width:'100%',height:'10%'}}
        frameProcessor={frameProcessor}
        device={device}
        isActive={true}
        // frameProcessorFps={5}
        // onLayout={(event) => {
        //   setPixelRatio(
        //     event.nativeEvent.layout.width /
        //       PixelRatio.getPixelSizeForLayoutSize(
        //         event.nativeEvent.layout.width
        //       )
        //   );
        // }}
      >
      {renderOverlay()}
       
      </Camera>
      <TouchableOpacity onPress={()=>{
          // Clipboard.setString(block.text);
                Alert.alert(`"${ocr?.result?.text}"`);
          }} style={{backgroundColor:'red',position:'absolute',bottom:0,width:'30%',height:'20%'}}>
          <Text>Copy</Text>
        </TouchableOpacity>
      </View>
      
    )
    return (
      <View style={{ flex: 1,
        justifyContent: 'center',
        alignItems: 'center',}}>
     

      
      <Button title="Capture Image" onPress={()=>{}} />
      {/* {extractedText !== '' && <Text style={{marginTop: 20,}}>{extractedText}</Text>} */}
    </View>
      // <View style={{flex: 1,backgroundColor:'white'}}>
      //   <QRCodeScanner
      //     ref={cameraRef}
      //     reactivate
      //     reactivateTimeout={2000}
      //     onRead={onQRCodeRead}
      //     showMarker
      //     customMarker={marker('white', '60%', '30%', 6, 20)}
      //     topContent={
      //       <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',height:moderateScale(100),paddingHorizontal:moderateScale(20)}}>
      //   <Text style={{color:'white'}}>Code</Text>
      //       <Text style={{color:'#151515',fontSize:moderateScale(18),fontWeight:'700'}}>Scan QR Code</Text>
      //       <TouchableOpacity onPress={()=>setShowCamera(false)}>
      //       <Image source={require('../assets/close.png')} style={{width:moderateScale(30),height:moderateScale(30)}}/>
      //       </TouchableOpacity>
            

      //   </View>
      //   }
      //   bottomContent={
      //       <View style={{justifyContent:'center',alignItems:'center'}}>
      //   <Text style={{color:'#151515',fontSize:moderateScale(18),fontWeight:'600'}}>Align QR Code within the frame</Text>
      //   </View>
      //   }
      //   />
      //   {/* <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:moderateScale(20)}}>
      //   <Text style={{color:'white'}}>Code</Text>
      //       <Text style={{color:'#151515',fontSize:moderateScale(18),fontWeight:'700'}}>Scan QR Code</Text>
      //       <TouchableOpacity onPress={()=>setShowCamera(false)}>
      //       <Image source={require('../assets/close.png')} style={{width:moderateScale(30),height:moderateScale(30)}}/>
      //       </TouchableOpacity>
            

      //   </View>
      //   <View style={{flex:5}}>
      //   <RNCamera
      //   captureAudio={false}
      //   ref={cameraRef}
      //   style={styles.camera}
      //   // onBarCodeRead={handleQRCodeRead}
      //   // onGoogleVisionBarcodesDetected={barcodeRecognized}
      //   // barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
      // >
      //  <View
      //   style={{
      //     height: moderateScale(250),
      //     width: moderateScale(250),
      //     borderWidth: moderateScale(3),
      //     borderColor: 'white',
      //     borderRadius: moderateScale(10),
      //   //   alignSelf:'center',
      //   //   justifyContent:'center'
      //   }}>

      //   </View>
      // </RNCamera>
      //   </View>

      //   <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      //   <Text style={{color:'#151515',fontSize:moderateScale(18),fontWeight:'600'}}>Align QR Code within the frame</Text>
      //   </View> */}
       
       
      
      // </View>
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
        <View
          style={styles.firstIndexRootView}>
            <View style={{width:'90%',borderRadius:moderateScale(6),backgroundColor:'#eff0f3',padding:moderateScale(10),marginTop:moderateScale(25)}}>

            <Text style={{color:'#151515',fontSize:moderateScale(18),fontWeight:'700',textAlign:'center',marginBottom:moderateScale(10)}}>Scan QR Code</Text>
            <Text style={{color:'#151515',fontSize:moderateScale(14),fontWeight:'400',textAlign:'center',}}>You can scan qrcodes continuously , same qrcode will not be treated and data will be save on scanned cards tab</Text>
            </View>
          <Image source={require('../assets/qcode.png')} style={{width:moderateScale(250),height:moderateScale(250),marginVertical:moderateScale(20)}}/>
          <TouchableOpacity
            onPress={() => {
              getPermission()
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
        <View style={{marginTop: moderateScale(15),flex:1,height:'75%'}}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={7}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            renderItem={(item, index) => renderItem(item, index)}
            ListEmptyComponent={() => {
              return (
                <View
                  style={styles.nodata}>
                  <Text>No data available</Text>
                </View>
              );
            }}
          />
        </View>
      )}


      {tabIndex==1&& data.length>0&&<View style={{height:moderateScale(65),alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity
            onPress={() => {
                generateAndSaveCSV()
            }}
            style={{
              ...styles.touchableStyle,
            //   paddingVertical:moderateScale(),
              backgroundColor: '#5683f6',
              width:'100%'
            }}>
            <Text
              style={{
                ...styles.toggleText,
                color: 'white',
              }}>
              Generate CSV
            </Text>
          </TouchableOpacity> 
      </View>}
    
    </View>
  );
};
// const Home = () => {
//   const [tabIndex, setTabIndex] = useState(0);
//   const [showCamera, setShowCamera] = useState(0);
//   const [data, setData] = useState([]);
//   const [previousCode, setPreviousCode] = useState('');
//   const [extractedText, setExtractedText] = useState('');
//   const cameraRef = useRef(null);
//   const tabsData = [
//     {id: 0, value: 'Scan QRCode'},
//     {id: 1, value: 'Scanned Cards'},
//   ];
//   useEffect(() => {
//     getDataFRomAsync();
//   }, []);
//   const captureImage = async () => {
//     if (cameraRef.current) {
//       const options = {
//         quality: 0.6,
//         // base64: true,
//         width: 500,
//         height:500,
//       };

//       const data = await cameraRef.current.takePictureAsync(options);
//       console.log({data})
//       // setExtractedText(data.uri)
//       // setShowCamera(false)
//       processText(data.uri);
//     }
//   };

//   const processText = async (imageData) => {
//     try {
//       const result =  await TextRecognition.recognize(imageData);
//       console.log('Recognized text:', result.text);
//       console.log('result.blocks', result.blocks);
//       let a={code:result.blocks[1]?.text,name:result.blocks[0]?.text}
//       console.log(result.blocks[1]?.text,previousCode)
//       if(result.blocks[1]?.text!=previousCode){
//         setPreviousCode(result.blocks[1]?.text)
//         addItemToList(a)
//       }
//       else{
//         showToast("Already Added Into List")
//       }
      
//         // let da=[]
//       // for (let block of result.blocks) {
//       //   console.log('Block text:', block.text);
//         // console.log('Block frame:', block.frame);
      
//         // for (let line of block.lines) {
//         //   console.log('Line text:', line.text);
//         //   da.push()
//         //   // console.log('Line frame:', line.frame);
//         // }
//       // }
//       // const text = result.textBlocks.map(block => block.value).join('\n');
//       // setExtractedText(text);
//     } catch (error) {
//       console.error('Text Recognition Error:', error);
//     }
//   };
//   const getDataFRomAsync = async () => {
//     try {
//         const serializedList = await getItemFromStorage('myListKey');
//         if (serializedList) {
//           const existingList = JSON.parse(serializedList);
//           setData(existingList);
//         } else {
//           setData([]); // Set an empty array if no data is found
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//   };
//   const addItemToList = async (newItem) => {
//     try {
//       // Step 1: Retrieve the existing list (if any)
//       const serializedList = await getItemFromStorage('myListKey');
//       const existingList = JSON.parse(serializedList) || [];
  
//       // Step 2: Append the new item to the list
//       existingList.push(newItem);
  
//       // Step 3: Serialize and save the updated list
//       const updatedSerializedList = JSON.stringify(existingList);
//       await saveItemToStorage('myListKey', updatedSerializedList);
//       fetchData()
//     // setShowCamera(false);
//     showToast('data added');
//     // let ss=JSON.stringify(updatedSerializedList)
//     setData(updatedSerializedList)
//       console.log('Item added successfully.',updatedSerializedList);
//     } catch (error) {
//       console.error('Error adding item:', error);
//     }
//   };
//   const fetchData = async () => {
//     try {
//       const serializedList = await getItemFromStorage('myListKey');
//       const existingList = JSON.parse(serializedList) || [];
//       setData(existingList);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleQRCodeRead = (event) => {
//     let code=event.data
//     const qrData = event.data;
//     console.log('QR Code Data:', qrData);

   
//     // Resume scanning after a short delay
//     // setTimeout(() => {
//     //     showToast('fdfdfd')
//     //   cameraRef.current.resumePreview();
//     // }, 1000);
//   };


//   const selectFile = async () => {
//     const data = await ImagePicker.openCamera({
//       mediaType: 'photo',
//       // width: 350,
//       // height: 200,
//       // cropping: true,
//     })
//       .then(async (data) => {
//         console.log('dadadadad',data)
//         processText(data.path);
//       })
//       .catch((err) => {
//         console.log({ err });
//         // reject(err);
//       });
//   };
  
//   const onQRCodeRead = async event => {
//     try {
//         if(event.data===previousCode){
//             showToast('Duplicate QRcode')
//             return
//         }
//         setPreviousCode(event.data)
//         const qrData = event.data;
//         console.log('onQRCodeRead',qrData)
//         let a={code:qrData}
//         addItemToList(a)
//         } catch (error) {
//             setShowCamera(false);
//             Alert.alert('Error',error.toString())
//         }
//   };

//   // Function to generate and save CSV file
// const generateAndSaveCSV = async () => {
//     try {
//       const serializedList = await getItemFromStorage('myListKey');
//       const existingList = JSON.parse(serializedList) || [];
  
//       const csvData = Papa.unparse(existingList);
//       let date=N=new Date().getDate();
//       let sec=N=new Date().getSeconds();
//       // Define the path where the CSV file will be saved
//       const csvFilePath = `${RNFS.ExternalDirectoryPath}/ScannedCards${date}_${sec}.csv`;
  
//       // Write the CSV data to the file
//       await RNFS.writeFile(csvFilePath, csvData, 'utf8');
//         // Share the CSV file
//         await Share.open({
//             url: `file://${csvFilePath}`,
//             type: 'text/csv',
//             subject: 'Scanned Cards Data',
//           });
  
//       console.log('CSV file generated and saved:', csvFilePath);
//     } catch (error) {
//       console.log('Error generating CSV:', error);
//       showToast(`Can't generate csv file`)
//     }
//   };

//   const marker = (
//     color,
//     size,
//     borderLength,
//     thickness = 2,
//     borderRadius = 0,
//   ) => {
//     return (
//       <View
//         style={{
//           height: size,
//           width: size,
//           borderWidth: moderateScale(3),
//           borderColor: 'white',
//           borderRadius: moderateScale(10),
//         //   alignSelf:'center',
//         //   justifyContent:'center'
//         }}>
//         {/* <View style={{ position: 'absolute', height: borderLength, width: borderLength, top: 0, left: 0, borderColor: color, borderTopWidth: thickness, borderLeftWidth: thickness, borderTopLeftRadius: borderRadius }}></View>
//           <View style={{ position: 'absolute', height: borderLength, width: borderLength, top: 0, right: 0, borderColor: color, borderTopWidth: thickness, borderRightWidth: thickness, borderTopRightRadius: borderRadius }}></View>
//           <View style={{ position: 'absolute', height: borderLength, width: borderLength, bottom: 0, left: 0, borderColor: color, borderBottomWidth: thickness, borderLeftWidth: thickness, borderBottomLeftRadius: borderRadius }}></View>
//           <View style={{ position: 'absolute', height: borderLength, width: borderLength, bottom: 0, right: 0, borderColor: color, borderBottomWidth: thickness, borderRightWidth: thickness, borderBottomRightRadius: borderRadius }}></View> */}
//       </View>
//     );
//   };

//   const renderItem = ({item, index}) => {
//     return <MemoizedRenderData item={item} />;
//   };
//   const handleTextRecognized = ({ textBlocks }) => {
//     // Process the recognized text blocks
//     console.log('Text Blocks:', textBlocks);
//   };

//   if (showCamera) {
//     return (
//       <View style={{ flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',}}>
//       <RNCamera
//         ref={cameraRef}
//         style={{ 
//     width: '100%',
//     height:'80%'}}
    
//         captureAudio={false}
//         type={RNCamera.Constants.Type.back}
//          flashMode={'off'}
//           autoFocus={'on'}
//           zoom={0}
//           whiteBalance={'auto'}
//           focusDepth={0}
//           trackingEnabled={true}
//           // ratio={RNCamera.Constants.}
//           // onTextRecognized={({textBlocks})=>{console.log(textBlocks)}}
//       />

      
//       <Button title="Capture Image" onPress={captureImage} />
//       {/* {extractedText !== '' && <Text style={{marginTop: 20,}}>{extractedText}</Text>} */}
//     </View>
//       // <View style={{flex: 1,backgroundColor:'white'}}>
//       //   <QRCodeScanner
//       //     ref={cameraRef}
//       //     reactivate
//       //     reactivateTimeout={2000}
//       //     onRead={onQRCodeRead}
//       //     showMarker
//       //     customMarker={marker('white', '60%', '30%', 6, 20)}
//       //     topContent={
//       //       <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',height:moderateScale(100),paddingHorizontal:moderateScale(20)}}>
//       //   <Text style={{color:'white'}}>Code</Text>
//       //       <Text style={{color:'#151515',fontSize:moderateScale(18),fontWeight:'700'}}>Scan QR Code</Text>
//       //       <TouchableOpacity onPress={()=>setShowCamera(false)}>
//       //       <Image source={require('../assets/close.png')} style={{width:moderateScale(30),height:moderateScale(30)}}/>
//       //       </TouchableOpacity>
            

//       //   </View>
//       //   }
//       //   bottomContent={
//       //       <View style={{justifyContent:'center',alignItems:'center'}}>
//       //   <Text style={{color:'#151515',fontSize:moderateScale(18),fontWeight:'600'}}>Align QR Code within the frame</Text>
//       //   </View>
//       //   }
//       //   />
//       //   {/* <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:moderateScale(20)}}>
//       //   <Text style={{color:'white'}}>Code</Text>
//       //       <Text style={{color:'#151515',fontSize:moderateScale(18),fontWeight:'700'}}>Scan QR Code</Text>
//       //       <TouchableOpacity onPress={()=>setShowCamera(false)}>
//       //       <Image source={require('../assets/close.png')} style={{width:moderateScale(30),height:moderateScale(30)}}/>
//       //       </TouchableOpacity>
            

//       //   </View>
//       //   <View style={{flex:5}}>
//       //   <RNCamera
//       //   captureAudio={false}
//       //   ref={cameraRef}
//       //   style={styles.camera}
//       //   // onBarCodeRead={handleQRCodeRead}
//       //   // onGoogleVisionBarcodesDetected={barcodeRecognized}
//       //   // barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
//       // >
//       //  <View
//       //   style={{
//       //     height: moderateScale(250),
//       //     width: moderateScale(250),
//       //     borderWidth: moderateScale(3),
//       //     borderColor: 'white',
//       //     borderRadius: moderateScale(10),
//       //   //   alignSelf:'center',
//       //   //   justifyContent:'center'
//       //   }}>

//       //   </View>
//       // </RNCamera>
//       //   </View>

//       //   <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
//       //   <Text style={{color:'#151515',fontSize:moderateScale(18),fontWeight:'600'}}>Align QR Code within the frame</Text>
//       //   </View> */}
       
       
      
//       // </View>
//     );
//   }

  
//   return (
//     <View style={styles.container}>
//       <View style={styles.toggleTabView}>
//         {tabsData.map((item, index) => {
//           return (
//             <TouchableOpacity
//               key={index.toString()}
//               onPress={() => {
//                 setTabIndex(index);
//               }}
//               style={{
//                 ...styles.touchableStyle,
//                 backgroundColor: tabIndex === index ? '#5683f6' : 'transparent',
//                 borderColor: tabIndex === index ? 'transparent' : '#5683f6',
//                 borderWidth: moderateScale(1),
//               }}>
//               <Text
//                 style={{
//                   ...styles.toggleText,
//                   color: tabIndex === index ? '#fff' : '#5683f6',
//                 }}>
//                 {item.value}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>

//       {tabIndex == 0 ? (
//         <View
//           style={styles.firstIndexRootView}>
//             <View style={{width:'90%',borderRadius:moderateScale(6),backgroundColor:'#eff0f3',padding:moderateScale(10),marginTop:moderateScale(25)}}>

//             <Text style={{color:'#151515',fontSize:moderateScale(18),fontWeight:'700',textAlign:'center',marginBottom:moderateScale(10)}}>Scan QR Code</Text>
//             <Text style={{color:'#151515',fontSize:moderateScale(14),fontWeight:'400',textAlign:'center',}}>You can scan qrcodes continuously , same qrcode will not be treated and data will be save on scanned cards tab</Text>
//             </View>
//           <Image source={require('../assets/qcode.png')} style={{width:moderateScale(250),height:moderateScale(250),marginVertical:moderateScale(20)}}/>
//           <TouchableOpacity
//             onPress={() => {
//               setShowCamera(true);
//               // selectFile()
//             }}
//             style={{
//               ...styles.touchableStyle,
//               backgroundColor: '#5683f6',
//             }}>
//             <Text
//               style={{
//                 ...styles.toggleText,
//                 color: 'white',
//               }}>
//               Scan Now
//             </Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <View style={{marginTop: moderateScale(15),flex:1,height:'75%'}}>
//           <FlatList
//             data={data}
//             keyExtractor={(item, index) => index.toString()}
//             initialNumToRender={7}
//             maxToRenderPerBatch={10}
//             removeClippedSubviews={true}
//             renderItem={(item, index) => renderItem(item, index)}
//             ListEmptyComponent={() => {
//               return (
//                 <View
//                   style={styles.nodata}>
//                   <Text>No data available</Text>
//                 </View>
//               );
//             }}
//           />
//         </View>
//       )}


//       {tabIndex==1&& data.length>0&&<View style={{height:moderateScale(65),alignItems:'center',justifyContent:'center'}}>
//       <TouchableOpacity
//             onPress={() => {
//                 generateAndSaveCSV()
//             }}
//             style={{
//               ...styles.touchableStyle,
//             //   paddingVertical:moderateScale(),
//               backgroundColor: '#5683f6',
//               width:'100%'
//             }}>
//             <Text
//               style={{
//                 ...styles.toggleText,
//                 color: 'white',
//               }}>
//               Generate CSV
//             </Text>
//           </TouchableOpacity> 
//       </View>}
    
//     </View>
//   );
// };

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
  firstIndexRootView:{
    marginTop: moderateScale(15),
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  nodata:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    // flex:1,
    width:'100%',
    height:"100%",
    // marginTop:moderateScale(20),
    // alignSelf:'center',
    justifyContent:'center',
    alignItems:'center'
  },
});
