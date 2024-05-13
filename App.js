import { StatusBar } from 'expo-status-bar';
import React from "react"
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons'
import colors from './Colors';
import tempData from './tempData';
import TodoList from './components/TodoList';
import AddListModal from './components/AddListModal';
import Firebase from './Firebase';

export default class App extends React.Component {
  state={
    addToDoVisible: false,
    lists: tempData,
    user: {},
    loading: true
  };

  componentDidMount() {
    firebase = new Firebase((error, user) => {
      if(error) {
        return alert('Something went wrong')
      }

      firebase.getLists(lists => {
        this.setState({lists, user}, () => {
          this.setState({loading: false});
        })
      })

      this.setState({user})
    });
  }

  componentWillUnmount() {
    firebase.detach();
  }

  toggleAddToDoModal() {
    this.setState({ addToDoVisible: !this.state.addToDoVisible});
  }

  renderList = list => {
    return <TodoList list={list} updateList={this.updateList} deleteList={this.deleteList}/>
  }

  addList = list => {
    firebase.addList({
      name: list.name,
      color: list.color,
      todos: []
    })
  }

  updateList = list => {
    firebase.updateList(list);
  }

  deleteList = list => {
    firebase.deleteList(list);
  };

  render() {
    if(this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' color={colors.green}/>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Modal 
          animationType="slide" 
          visible={this.state.addToDoVisible} 
          onRequestClose={() => this.toggleAddToDoModal()}
        >
          <AddListModal closeModal={() => this.toggleAddToDoModal()} addList={this.addList}/>
        </Modal>
        <View style={{flexDirection: "row"}}>
          <View style={styles.divider}/>
          <Text style={styles.title}>
            Todo <Text style={{fontWeight: "bold", color: colors.green}}>Lists</Text>
          </Text>
          <View style={styles.divider}/>
        </View>

        <View style={{marginVertical: 48}}>
          <TouchableOpacity style={styles.addList} onPress={() => this.toggleAddToDoModal()}>
            <AntDesign name="plus" size={56} color={colors.green}/>
          </TouchableOpacity>

          <Text style={styles.add}>Add List</Text>
        </View>

        <View style={
          this.state.lists.length != 0 ? {justifyContent: 'center', height: 300, paddingLeft: 16} : {}
          }>
          {
            this.state.lists.length != 0 ?
            <FlatList 
            data={this.state.lists} 
            keyExtractor={item => item.id.toString()} 
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => this.renderList(item)}
            keyboardShouldPersistTaps='always'/>  
          :
            <View style={{alignItems: "center",}}>
              <Text style={styles.empty}>Nothing here, yet</Text>
              <AntDesign name="edit" size={80} color={colors.light_green} />
            </View>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: colors.light_green,
    height: 5,
    flex: 1,
    alignSelf: "center"
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.dark,
    paddingHorizontal: 64
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.light_green,
    borderRadius: 4,
    padding: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  add:{
    color: colors.green,
    fontWeight: "600",
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center'
  },
  empty: {
    fontSize: 20,
    fontWeight: "800",
    textTransform:"uppercase",
    color: colors.light_green,
  }
});
