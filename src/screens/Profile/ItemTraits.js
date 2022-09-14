import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import images from '../../assets/fields/images.js';
import { StyleSheet, View, Text } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

const ViewArea = styled.View`
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
  flex: 1;
  padding: 10px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const FlatlistView = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  border-radius: 100px;
  flex: 1;
  align-items: center;

`;

const TextArea = styled.View`
  flex: 1;
`;

const StatusBarV = styled.View`
  height: 80px;
  width: 25px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #018598;
`;

const StatusBar = styled.View`

`;

const TextParam = styled.Text`
  font-size: 14px;
  margin-top: 5px;
  text-align: center;
`;

const StatusBarStyle = (cor) => {
  return StyleSheet.create({
    statusBar: {
      height: 10,
      width: 80,
      borderRadius: 20,
      backgroundColor: cor
    }
  })
}

const ThemeIcon = styled.Image`
  height: 80px;
  width: 80px;
  aspect-ratio: 1;
`;

const Progress = ({ height, width, cor, progress, level }) => {
  return (
    <>
      <View style={{
        height: height,
        width: width,
        borderRadius: height,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}>

        <ProgressBar
          progress={progress}
          color={cor}
          visible={true}
          style={{
            flex: 1,
            height: width,
            width: height,
            transform: [{ rotate: '-90deg' }]
          }}
        />

      </View>
      <Text style={{
        fontSize: 12,
        fontWeight: "900",
        marginTop: 120,
        marginRight: 10
      }}>
        lvl: {level}
      </Text>
    </>
  )
}

export default ({ item }) => {
  const navigation = useNavigation();
  const statusStyle = StatusBarStyle(item.cor);
  const idName = item.nome
  // const valor = data + item.amount
  const progress = (item.amount % 10) / 10
  const level = Math.trunc(item.amount / 10) + 1
  console.log(item);
  return (

    <ViewArea>
      <FlatlistView>
        {/* {!!item.fotoPet && <ImagePet source={{ uri: item.fotoPet }} />} */}
        {!!item && <ThemeIcon source={images[idName]} />}
        <TextParam>{item.nome}</TextParam>
        <StatusBar style={statusStyle.statusBar}></StatusBar>
      </FlatlistView>
      <Progress height={85} width={20} cor={item.cor} progress={progress} level={level} />

    </ViewArea>
  );
};
