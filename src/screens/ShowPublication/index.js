import React, { useEffect, useState } from "react";
import {
    Container,
    ScrollViewSignUp,
    ImageProfile,
    ViewTitleInput,
    LevelImgView,
    LevelText,
    ViewTextInput,
    Title,
    Text,
    ButtonAvaluation,
    IconAvaluation,
    AvaluationArea,
    TextLike
} from "./styles";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../../firebase";
import Header from "../../components/HeaderRoutino";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore"
import { View } from "react-native-web";

export default (object) => {
    auth
    const navigation = useNavigation();
    const level = 30
    const title = object.route.params.article.Titulo
    const text = object.route.params.article.Texto
    const idArticle = object.route.params.article.id
    const idCreate = object.route.params.article.IdUsuario
    const traitArticle = object.route.params.article.Campo
    let Views = object.route.params.article.Views
    let [Upvote, setUpvote] = useState(object.route.params.article.Upvote)
    let [Downvote, setDownvote] = useState(object.route.params.article.Downvote)

    const updateView = async () => {
        const article = doc(db, "Artigo", idArticle);

        Views += 1
        await updateDoc(article, {
            Views: Views
        });
        const vViews = 1
        for (const fieldTrait of traitArticle) {
            await getAccount(fieldTrait, vViews)
        }
    }

    const handleLikeClick = async () => {
        const article = doc(db, "Artigo", idArticle);

        Upvote += 1
        setUpvote(Upvote)
        await updateDoc(article, {
            Upvote: Upvote
        });
        const vUpvote = 2
        for (const fieldTrait of traitArticle) {
            await getAccount(fieldTrait, vUpvote)
        }
    }

    const handleDislikeClick = async () => {
        const article = doc(db, "Artigo", idArticle);

        Downvote += 1
        setDownvote(Downvote)
        await updateDoc(article, {
            Downvote: Downvote
        });
        const vDownvote = -1
        for (const fieldTrait of traitArticle) {
            await getAccount(fieldTrait, vDownvote)
        }
    }
    const nUpvote = parseInt(Upvote)
    const nDownvote = parseInt(Downvote)
    const nViews = parseInt(Views)
    let valor = (nUpvote * 2) + (nViews) - (nDownvote)

    console.log(">>>>>>>>>> BRINCANDO AGORA", valor);
    console.log(">>>>>>>>>> idCreate ", idCreate);
    console.log(">>>>>>>>>> traitArticle", traitArticle);

    const getAccount = async (traits, vote) => {
        const userRef = doc(db, "users", idCreate);
        const docSnap = await getDoc(userRef);
        if (docSnap.data().Traits) {
            let tempory = []
            docSnap.data().Traits.forEach((findTrait) => {
                let objeto = {
                    ...findTrait
                }
                tempory.push(objeto)
            })
            console.log(">>>>>>>>>> vote", vote);
            for (const fieldTrait of tempory) {

                if (traits.nome == fieldTrait.nome) {
                    console.log(">>>>>>>>>> BRINCANDO AGORA");
                    await updateDoc(userRef, {
                        Traits: arrayRemove(fieldTrait)
                    });

                    let amountTrait = parseInt(fieldTrait.amount) + vote

                    const updateTraits = {
                        ...traits,
                        amount: amountTrait
                    }
                    console.log(">>>>>>>>>> updateTraits", updateTraits);
                    await updateDoc(userRef, {
                        Traits: arrayUnion(updateTraits)
                    });
                }
            }
        }
    }


    useEffect(() => {
        updateView();
    }, []);

    return (
        <Container>
            <Header></Header>
            <ScrollViewSignUp>
                <ViewTitleInput>
                    <LevelImgView>
                        <ImageProfile source={require("../../assets/profile.png")} />
                        <LevelText>Lv. {level}</LevelText>
                    </LevelImgView>
                    <Title>{title}</Title>
                </ViewTitleInput>
                <ViewTextInput>
                    <Text>{text}</Text>
                </ViewTextInput>
                <AvaluationArea>
                    <ButtonAvaluation onPress={() => handleLikeClick()}>
                        <IconAvaluation source={require("../../assets/likeArticle.png")} />
                        <TextLike>{Upvote}</TextLike>
                    </ButtonAvaluation>

                    <ButtonAvaluation onPress={() => handleDislikeClick()}>
                        <IconAvaluation source={require("../../assets/dislikeArticle.png")} />
                        <TextLike>{Downvote}</TextLike>
                    </ButtonAvaluation>
                </AvaluationArea>
            </ScrollViewSignUp>
        </Container>
    );
};