import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { View, Text, ScrollView } from "react-native"
import { Button, registerCustomIconType } from 'react-native-elements';
import { ProgressBar, Snackbar, TextInput } from 'react-native-paper';

import { Plane } from '../Model/Plane';
import { getAllLocal, insertLocal, syncLocalToServer, syncServerToLocal } from '../Repository/local';
import { getAll, insert } from '../Repository/server';


const Socket = (): JSX.Element => {
  const [visibleSocket, setVisibleSocket] = React.useState(false)
  const [plane, setPlane] = React.useState({} as any);

  React.useEffect(() => {
    console.log("socket");
    const socket = new WebSocket('ws://192.168.1.9:1876');
    socket.onmessage = ({ data }) => {
      let obj = JSON.parse(data);
      setPlane(obj);
      setVisibleSocket(true);

    };
    return () => {
      console.log("socket closed");
      socket.close();
    }

  }, [])

  return (
    <Snackbar
          visible={visibleSocket}
          onDismiss={() => setVisibleSocket(false)}
          style={{ marginBottom: "5%" }}
          action={{
            label: 'x',
            onPress: () => {
              setVisibleSocket(false);
            },
          }}>
          New plane added: {plane.name} owned by {plane.owner} and the size {plane.size}
      </Snackbar>
  )
}

const PlaneLayout = ({ p, index }: any): JSX.Element => {
  const plane: Plane = p;
  return (
    <View
      style={{
        marginTop: "5%",
        marginLeft: "1%",
        marginRight: "1%",
        paddingLeft: "2%",
        paddingTop: "2%",
        borderRadius: 10,
        backgroundColor: index % 2 == 0 ? "#BB342F" : "#102542",

      }}>
      <Text style={{ color: "white" }}>
        Name: {plane.name}
      </Text>
      <Text style={{ color: "white" }}>
        Manufacturer: {plane.manufacturer}
      </Text>
      <Text style={{ color: "white" }}>
        Owner: {plane.owner}
      </Text>
      <Text style={{ fontSize: 14, color: "white" }}>
        Capacity: {plane.capacity}
      </Text>
      <Text style={{ color: "white" }}>
        Size: {plane.size}
      </Text>
      <Text style={{ color: "white" }}>
        Status: {plane.status}
      </Text>

    </View>
  )
}

function AllPlanesMode({ navigation }: any) {
  const [planeList, setPlaneList] = React.useState<Plane[]>([]);
  const [serverOffline, setServerOffline] = React.useState(false);
  const [buttonEnable, setButtonEnabled] = React.useState(true);
  const [showProgress, setShowProgress] = React.useState(true);
  const isFocused = useIsFocused();


  React.useEffect(() => {
    setShowProgress(true);
    getAll()
      .then(data => {
        syncServerToLocal().then(() => getAll().then(d => {
          syncLocalToServer(d);
          setPlaneList(d); 
          setServerOffline(false);
          setButtonEnabled(true);
          setShowProgress(false);
        }));
      })
      .catch(() => {
        getAllLocal().then(d => { setPlaneList(d); }).catch((error) => console.log(error));
        setServerOffline(true);
        setShowProgress(false);
      });
  }, [isFocused]);

  const retry = () => {
    setShowProgress(true);
    setButtonEnabled(false);
    getAll()
      .then(data => {
        syncServerToLocal().then(() => getAll().then(d => {
          syncLocalToServer(d);
          setPlaneList(d); 
          setServerOffline(false);
          setButtonEnabled(true);
          setShowProgress(false);
        }));

      })
      .catch(() => {
        setServerOffline(true);
        setButtonEnabled(true);
        setShowProgress(false);
      });
  }

  return (
    <View>
      <ProgressBar visible={showProgress} indeterminate={true} />

      {serverOffline ?
        <View>
          <Text>
            The server is offline
        </Text>
          <Button title="Retry" buttonStyle={{ marginLeft: "5%", marginRight: "5%" }} onPress={() => retry()} disabled={!buttonEnable} />
          <ScrollView style={{ display: "flex", height: "85%" }}>
            {
              planeList.map((plane, index) => {
                return <PlaneLayout p={plane} index={index} key={index} />
              })
            }
          </ScrollView>
        </View>
        :
        <ScrollView style={{ display: "flex", height: "85%" }}>
          {
            planeList.map((plane, index) => {
              return <PlaneLayout p={plane} index={index} key={index} />
            })
          }
        </ScrollView>
      }
    </View>
  )
}

function AddMode() {

  const [name, setName] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [size, setSize] = React.useState("");
  const [owner, setOwner] = React.useState("");
  const [manufacturer, setManufacturer] = React.useState("");
  const [capacity, setCapacity] = React.useState("");
  const [showProgress, setShowProgress] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  
  return (
    <View>
      <ScrollView style={{ marginTop: "12%" }}>
        <ProgressBar indeterminate={true} visible={showProgress} />
        <TextInput
          label="name"
          value={name.toString()}
          onChangeText={(name: string) => setName(name)}
        />
        <TextInput
          label="status"
          value={status.toString()}
          onChangeText={(status: string) => setStatus(status)}
        />
        <TextInput
          label="size"
          value={size.toString()}
          onChangeText={(size: string) => setSize(size)}
        />
        <TextInput
          label="owner"
          value={owner.toString()}
          onChangeText={(owner: string) => setOwner(owner)}
        />
        <TextInput
          label="manufacturer"
          value={manufacturer.toString()}
          onChangeText={(manufacturer: string) => setManufacturer(manufacturer)}
        />
        <TextInput
          label="capacity"
          value={capacity.toString()}
          onChangeText={(capacity: string) => setCapacity(capacity)}
        />
        <View style={{ flexDirection: 'row', marginTop: "5%" }}>
          <Button
            buttonStyle={{
              backgroundColor: '#1ba64b',
              marginLeft: "4%"
            }}
            title="Save"
            onPress={async () => {
              setShowProgress(true)
              insert(new Plane(-1, name, status, parseInt(size), owner, manufacturer, parseInt(capacity)))
                .then((data: any) => {
                  if (data.status == 404) {
                    setVisible(true);
                    data.json().then(d => setErrorMessage(d.text));
                  }
                  setShowProgress(false)
                })
                .catch((error) => {
                  insertLocal(new Plane(-1, name, status, parseInt(size), owner, manufacturer, parseInt(capacity)))
                  setShowProgress(false);
                })


            }} />
        </View>
      </ScrollView>
      <View style={{ height: "20%" }}></View>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        style={{ marginBottom: "5%" }}
        action={{
          label: 'x',
          onPress: () => {
            setVisible(false);
          },
        }}>
        {errorMessage}
      </Snackbar>
      
    </View>
  )
}


export function Registration({ navigation }: any) {

  const [viewMode, setViewMode] = React.useState(false); //false-all planes, true-add
  const [message, setMessage] = React.useState(0);
  

  
  return (
    <View style={{ marginTop: "5%", height: "85%" }}>
      <Text>Registration</Text>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Button
          buttonStyle={{ marginLeft: "5%" }}
          title="See all Planes"
          onPress={() => setViewMode(false)} />
        <Button
          buttonStyle={{ marginLeft: "5%" }}
          onPress={() => setViewMode(true)}
          title="Go to add a plane" />
      </View>
      {viewMode ? <AddMode /> : <AllPlanesMode navigation={navigation} />}
      <Socket />
    </View>
  );
}