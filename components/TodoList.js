import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../Colors';
import TodoModal from './TodoModal';

export default class TodoList extends React.Component {
    state = {
        showListVisible: false
    }

    renderList = list => {
        return <TodoList list={list} updateList={this.updateList} deleteList={this.deleteList}  />
    };

    toggleListModal() {
        this.setState({ showListVisible: !this.state.showListVisible});
    }

    render() {
        const list = this.props.list;
        
        const completedCount = list.todos.filter(todo => todo.completed).length;
        const remainingCount = list.todos.length - completedCount;

        return (
            <View>
                <Modal
                    animationType="slide"
                    visible={this.state.showListVisible}
                    onRequestClose={() => this.toggleListModal()}
                >
                    <TodoModal 
                        list={list} 
                        closeTodoModal={() => this.toggleListModal()} 
                        updateList={this.props.updateList}
                    />
                </Modal>
                <TouchableOpacity 
                    style={[styles.listContainer, {backgroundColor: list.color}]}
                    onPress={() => this.toggleListModal()}
                    onLongPress={() => this.props.deleteList(list)}>
                    <Text style={styles.listTitle} numberOfLines={1}>
                        {list.name}
                    </Text>
        
                    <View>
                        <View style={{alignItems: "center"}}>
                            <Text style={styles.count}>{remainingCount}</Text>
                            <Text style={styles.subtitle}>Remaining</Text>
                        </View>
                        <View style={{alignItems: "center"}}>
                            <Text style={styles.count}>{completedCount}</Text>
                            <Text style={styles.subtitle}>Completed</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        paddinVertical: 128,
        paddingHorizontal: 16,
        borderRadius: 18,
        marginHorizontal: 12,
        justifyContent: 'center',
        alignItems: "center",
        width: 200
    },
    listTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.light,
        marginBottom: 18
    },
    count: {
        fontSize: 48,
        fontWeight: '200',
        color: colors.light,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.light
    }
});
