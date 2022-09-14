import React, { useEffect, useState } from "react";
import { Container, FlatList, TitleText, Title, ImageProfile, TopArea, TopAreaNick, TraitsArea, AllView, ArticlesArea, IconLoading, LvlText } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { StyleSheet, View, Text } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { auth, db } from "../../../firebase";
import Header from "../../components/HeaderRoutino";
import ItemTraits from "./ItemTraits";
import ItemArticle from "./ItemArticle";
import ItemEmpty from "./ItemEmpty";

const Progress = ({ height, width, cor, progress }) => {
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
                        height: height,
                        width: width,
                    }}
                />

            </View>
        </>
    )
}

export default () => {

    auth
    const idUser = auth.currentUser?.uid
    const navigation = useNavigation();
    const [artigos, setArtigos] = useState([]);
    const [traits, setTraits] = useState([]);
    const [loading, setLoading] = useState(false)
    const [lvl, setLvl] = useState(0)
    const renderItemTraits = ({ item }) => <ItemTraits item={item} />;
    const renderItemArticle = ({ item }) => <ItemArticle item={item} />;
    const renderEmpty = () => <ItemEmpty />;

    const getuser = async () => {

        const userRef = doc(db, "users", idUser);
        const docSnap = await getDoc(userRef);
        setTraits(docSnap.data().Traits)
        console.log(">>>>>EU NAO SOU UNDEFINED >>>>", docSnap.data());
        let temporyAmount = []
        docSnap.data().Traits.forEach((traits) => {
            temporyAmount.push(traits.amount)
        })
        temporyAmount.push(docSnap.data().amountTraits)
        console.log("============> temporyAmount", temporyAmount);
        let sum = 0;

        for (let i = 0; i < temporyAmount.length; i++) {
            sum += temporyAmount[i];
        }
        setLvl(sum / temporyAmount.length)

        const q = query(collection(db, "Artigo"), where("IdUsuario", "==", idUser));
        const querySnapshot = await getDocs(q);
        let tempory = []
        querySnapshot.forEach((doc) => {
            const objeto = doc.data()
            // console.log(doc.id, "=> ", objeto);
            tempory.push(objeto)

        });
        setArtigos(tempory)
        setLoading(false)
    }


    useEffect(() => {
        setLoading(true)
        getuser()
    }, []);

    // const valor = data + item.amount
    const progress = (lvl % 10) / 10
    const level = Math.trunc(lvl / 10) + 1

    return (
        <Container>
            <Header></Header>

            {loading ? (<IconLoading size="large" color="black" />) :
                <AllView>
                    <Title>Profile</Title>

                    <TopArea>
                        <ImageProfile source={require("../../assets/profile.png")} />
                        <TopAreaNick>
                            <TitleText>{auth.currentUser?.email}</TitleText>
                            <Progress height={20} width={250} cor="black" progress={progress} />
                            <LvlText>Lvl: {level}</LvlText>
                        </TopAreaNick>

                    </TopArea>
                    <TraitsArea>
                        <TitleText>YOUR TRAITS</TitleText>
                        <FlatList
                            data={traits}
                            renderItem={renderItemTraits}
                            horizontal
                            ListEmptyComponent={renderEmpty}
                            contentContainerStyle={{ justifyContent: "center" }}
                        // numColumns={numColumns}
                        />
                    </TraitsArea>
                    <ArticlesArea>
                        <TitleText>YOUR ARTICLES</TitleText>
                        <FlatList
                            nestedScrollEnabled
                            data={artigos}
                            // refreshing={true}
                            renderItem={renderItemArticle}
                            ListEmptyComponent={renderEmpty}
                            contentContainerStyle={{ marginHorizontal: 30 }}
                        // ListHeaderComponent
                        />
                    </ArticlesArea>

                </AllView>
            }

        </Container>
    );
};