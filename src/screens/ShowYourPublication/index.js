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


    console.log(">>>>>>>>>>>>>>>>>>>>title", object);

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
                    <ButtonAvaluation >
                        <IconAvaluation source={require("../../assets/likeArticle.png")} />
                        <TextLike>{Upvote}</TextLike>
                    </ButtonAvaluation>

                    <ButtonAvaluation>
                        <IconAvaluation source={require("../../assets/dislikeArticle.png")} />
                        <TextLike>{Downvote}</TextLike>
                    </ButtonAvaluation>
                </AvaluationArea>
            </ScrollViewSignUp>
        </Container>
    );
};