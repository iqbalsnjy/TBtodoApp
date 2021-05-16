import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Modal, ActivityIndicator, ImageBackground} from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import colors from './Colors';
import TodoList from './components/TodoList';
import AddListModal from './components/AddListModal';
import Fire from './Fire';
const Image = require('./assets/bg.jpeg');

export default class App extends React.Component {
    state = {
        addTodoVisible: false,
        lists: [],
        user: {},
        loading: true
    };

    componentDidMount(){
        //koneksikan firebase ke app bila gagal muncul "terjadi kesalahan" bila sukses app mengambil data list dari user
        firebase = new Fire((error, user) => {
            if (error){
                return alert("Aw, terjadi kesalahan")
            }

            firebase.getLists(lists =>{
                this.setState({lists, user}, ()=> {
                    this.setState({ loading: false });
                });
            });

            this.setState({ user });
        });
    }

    componentWillUnmount(){
        firebase.detach();
    }

    toggleAddTodoModal() {
        this.setState({addTodoVisible: !this.state.addTodoVisible});
    }

    //load update dan delete
    rendereList = list => {
        return  <TodoList list={list} updateList={this.updateList} deleteList={this.deleteList} />
    };
    
    //menambahkan list
    addList = list => {
        firebase.addList({
            name: list.name,
            color: list.color,
            todos: []
        });
    };

    updateList = list => {
        firebase.updateList(list);
    };

    deleteList = list => {
        firebase.deleteList(list);
    };
    
    

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={colors.blue} />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <ImageBackground source={Image} style={styles.container}> 
                <Modal 
                    animationType="slide" 
                    visible={this.state.addTodoVisible}
                    onRequestClose={() => this.toggleAddTodoModal()}
                >
                    <AddListModal closeModal={() => this.toggleAddTodoModal()} addList={this.addList} />
                </Modal>

                <View style={{flexDirection: "row"}}>
                    <View style={styles.divider}/>
                        <Text style={styles.title}>
                            Todo <Text style={{fontWeight: "200", color: colors.blue }}>Lists</Text>
                        </Text>
                    <View style={styles.divider}/>
                </View>

                <View style={{marginVertical: 48}}>
                    <TouchableOpacity style={styles.addList} onPress={() => this.toggleAddTodoModal()}>
                        <AntDesign name="plus" size={16} color={colors.black}/>
                    </TouchableOpacity>

                    <Text style={styles.add}>Add List</Text>
                </View>
        
                <View style={{height: 275, paddingLeft: 32}}>
                    <FlatList
                        data={this.state.lists}
                        keyExtractor={item => item.id.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => this.rendereList(item)}
                        keyboardShouldPersistTaps="always"
                    />
                </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        backgroundColor: colors.lightBlue,
        height: 40,
        flex: 1,
        alignSelf: "center"
    },
    title: {
        fontSize: 38,
        fontWeight: "bold",
        color: colors.black,
        paddingHorizontal: 20
    },
    addList: {
        borderWidth: 2,
        borderColor: colors.lightBlue,
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    add: {
        color: colors.black,
        fontWeight: "600",
        fontSize: 14,
        marginTop: 8
    }
});
