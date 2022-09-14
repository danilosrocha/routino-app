import React, { useState } from "react";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import images from '../../assets/fields/images.js';
import { StyleSheet, View, Text } from 'react-native';

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

const Progress = ({ step, steps, height, width }) => {
  return (
    <>
      <Text style={{
        fontSize: 12,
        fontWeight: "900",
        marginRight: 8
      }}>
        {step}/{steps}
      </Text>
      <View style={{
        height: height,
        width: width,
        backgroundColor: "#018598",
        borderRadius: height,
        overflow: "hidden",
      }}>
        <View
          styleAttr="Horizontal"
          indeterminate={false}
          progress={0.5}
        />
      </View>
    </>
  )
}

export default ({ item }) => {
  const navigation = useNavigation();
  const statusStyle = StatusBarStyle(item.cor);
  const idName = item.nome

  console.log(item.cor);
  console.log(item.nome);
  console.log(item.amount);
  return (

    <ViewArea>
      <FlatlistView>
        {/* {!!item.fotoPet && <ImagePet source={{ uri: item.fotoPet }} />} */}
        {!!item && <ThemeIcon source={images[idName]} />}
        <TextParam>{item.nome}</TextParam>
        <StatusBar style={statusStyle.statusBar}></StatusBar>
      </FlatlistView>
      <Progress step={item.amount} steps={10} height={85} width={item.amount/10} />

    </ViewArea>
  );
};
