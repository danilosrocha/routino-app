import React, { useEffect, useState } from "react";
import { Container, ViewArea, Title, FlatList, HorizontalList, ViewPostInput, HandleButtonText } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../../firebase";
import Header from "../../components/HeaderRoutino";
import SearchButton from "../../components/SearchButton";
import ItemTraits from "./ItemTraits";
import ItemEmpty from "../../components/ItemEmpty";
import SelectedTraits from "./SelectedTraits";
import { addDoc, onSnapshot, collection, query, limit, doc, updateDoc, arrayUnion, increment, arrayRemove, getDoc } from "firebase/firestore"

export default (object) => {
    auth
    const currentDateTime = new Date().toISOString()
    const idUser = auth.currentUser?.uid
    const [fields, setFields] = useState([]);
    const [selectedTraits, setSelectedTraits] = useState([]);
    const [traits, setTraits] = useState([]);
    const [loading, setLoading] = useState(false)
    const docData = object.route.params.docData

    const handleButtonPress = async () => {
        const coll = collection(db, "Artigo");
        setLoading(true)
        docData.Campo = selectedTraits
        console.log(docData);
        addDoc(coll, docData)
            .then(() => {
                setLoading(false)
                alert("Artigo publicado com sucesso");
                navigation.navigate("MainTab")
            })
            .catch((error) => {
                alert("Erro ao publicar o artigo");
                console.log(error.message)
            })

        const userRef = doc(db, "users", idUser);
        for (const fieldTrait of selectedTraits) {
            await getAccount(fieldTrait)
        }
        await updateDoc(userRef, {
            amountTraits: increment(1),
            updatedAt: currentDateTime
        });
    }

    const getAccount = async (traits) => {
        const userRef = doc(db, "users", idUser);
        const docSnap = await getDoc(userRef);
        if (docSnap.data().Traits) {
            let tempory = []
            docSnap.data().Traits.forEach((findTrait) => {
                let objeto = {
                    ...findTrait
                }
                tempory.push(objeto)
            })

            let cont = true
            for (const fieldTrait of tempory) {

                if (traits.nome == fieldTrait.nome) {
                    console.log(">>>>>>>>>> BRINCANDO AGORA");
                    await updateDoc(userRef, {
                        Traits: arrayRemove(fieldTrait)
                    });

                    let amountTrait = parseInt(fieldTrait.amount) + 1

                    const updateTraits = {
                        ...traits,
                        amount: amountTrait
                    }
                    console.log(">>>>>>>>>> updateTraits", updateTraits);
                    await updateDoc(userRef, {
                        Traits: arrayUnion(updateTraits)
                    });
                    cont = false

                }
            }

            if (cont) {
                const createTraits = {
                    ...traits,
                    amount: 1,
                }
                console.log(">>>>>>>>>> PRIMEIRO ELSE", createTraits);

                await updateDoc(userRef, {
                    Traits: arrayUnion(createTraits)
                });
            }



        } else {
            console.log(">>>>>>>>>> PRIMEIRA CRIACAO");
            const createTraits = {
                ...traits,
                amount: 1,
            }
            await updateDoc(userRef, {
                Traits: arrayUnion(createTraits)
            });
        }
    }

    const selectTrait = (item) => {
        if (!selectedTraits.includes(item)) {
            setSelectedTraits([...selectedTraits, item])
        }
    }

    const removeTrait = (item) => {
        const index = selectedTraits.indexOf(item);
        if (index > -1) {
            selectedTraits.splice(index, 1);
            console.log(selectedTraits);
            setSelectedTraits([...selectedTraits]);
        }

    }

    const navigation = useNavigation();
    const renderItemTraits = ({ item }) => <ItemTraits item={item} addOnPress={() => selectTrait(item)} />;
    const renderSelectedraits = ({ item }) => <SelectedTraits item={item} removeOnPress={() => removeTrait(item)} />;

    const numColumns = 3

    useEffect(() => {
        const list = [];
        const coll = collection(db, "Traits");
        const q = query(coll, limit(24));
        onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                list.push({ ...doc.data(), nome: doc.id })
            })
            setTraits(list);
        })
    }, [])

    return (
        <Container>
            <Header></Header>
            <Title>Browse</Title>
            <ViewArea>
                <SearchButton>

                </SearchButton>
            </ViewArea>
            <HorizontalList
                data={selectedTraits}
                renderItem={renderSelectedraits}
                horizontal
                contentContainerStyle={{ justifyContent: "space-between" }}
            // numColumns={numColumns}
            />
            <FlatList
                data={traits}
                renderItem={renderItemTraits}
                contentContainerStyle={{ marginHorizontal: 10 }}
                numColumns={numColumns}
            />

            <ViewPostInput onPress={(handleButtonPress)}>
                <HandleButtonText>Publicar o artigo</HandleButtonText>
            </ViewPostInput>

        </Container>
    );
};