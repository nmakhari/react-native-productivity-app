import React from 'react';
import {
  SectionList,
  StyleSheet,
  SectionListData,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Colors } from '../shared/Colors';
import { IGroup } from '../../db/Groups';
import { IReading } from '../../db/Readings';
import { ITodo } from '../../db/Todo';
import { ProgressState, SectionTitles } from '../shared/Utils';
import TodoCard from '../components/TodoCard';
import GroupCard from '../components/GroupCard';
import ReadingCard from '../components/ReadingCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DisplayItem from './DisplayItem';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { ITodoListStore } from '../../stores/TodoListStore';

export type DisplayItemType = IGroup | IReading | ITodo;

export interface IDisplayItemSection {
  title: string;
  data: DisplayItemType[];
}

export interface IProgressData {
  completed: number;
  total: number;
}

export interface IModalData {
  name: string;
  description?: string;
  progressString?: string;
  parentName?: string;
  progressValue?: IProgressData;
}

interface IProps {
  data: IDisplayItemSection[];
  progressState: ProgressState;
  todoListStore: ITodoListStore;
  onEditTodoPressed: (todo: ITodo) => void;
}

// contentContainerStyle on SectionList needs to be set to flexGrow 1 in order
// to center the resulting view on the screen
@observer
export default class DisplayList extends React.Component<IProps> {
  @observable private isModalVisible: boolean;
  @observable private modalData: IModalData;

  constructor(props: IProps) {
    super(props);
    runInAction(() => {
      this.isModalVisible = false;
      this.modalData = {
        name: '',
      };
      // https://mobx.js.org/migrating-from-4-or-5.html
      makeObservable(this);
    });
  }

  render() {
    const windowHeight = Dimensions.get('window').height;
    return (
      // minHeight is needed because FAB breaks the flex on this parent view
      <View style={[Styles.root, { minHeight: windowHeight - 60 }]}>
        <Modal
          animationType={'fade'}
          onRequestClose={this.onModalClosePressed}
          transparent={true}
          visible={this.isModalVisible}>
          <TouchableWithoutFeedback onPress={this.onModalClosePressed}>
            <View style={Styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <DisplayItem
            name={this.modalData.name}
            onClosePress={this.onModalClosePressed}
            description={this.modalData.description}
            progressString={this.modalData.progressString}
            parentName={this.modalData.parentName}
            progressValue={this.modalData.progressValue}
          />
        </Modal>

        <SectionList
          style={Styles.list}
          sections={this.props.data}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          ListEmptyComponent={
            <View style={Styles.listEmptyRoot}>
              <Text style={Styles.listEmptySubtitle}>Nothing here...</Text>
              <Text style={Styles.listEmptyTitle}>Time to get started! </Text>
              <MaterialCommunityIcons
                name="notebook"
                color={'white'}
                size={40}
                style={Styles.listEmptyIcon}
              />
            </View>
          }
          contentContainerStyle={Styles.listEmptyContentContainer}
        />
      </View>
    );
  }

  // The default case is a reading, it was written as default in order to keep the
  // function type as JSX.Element instead of JSX.Element | undefined
  private renderItem = ({
    item,
    section,
  }: {
    item: DisplayItemType;
    section: SectionListData<DisplayItemType, IDisplayItemSection>;
  }) => {
    const { progressState, todoListStore, onEditTodoPressed } = this.props;
    switch (section.title) {
      case SectionTitles.Groups.toString():
        return (
          <GroupCard
            group={item as IGroup}
            onLongPress={(group: IGroup) => {
              this.setModalDataGroup(group);
              this.openModal();
            }}
            progressState={progressState}
            onEditPressed={() => {
              console.log('Group edit pressed');
            }}
            onDeletePressed={() => {
              todoListStore.deleteGroup(item.id);
            }}
          />
        );
      case SectionTitles.Todos.toString():
        return (
          <TodoCard
            todo={item as ITodo}
            onPress={(todo: ITodo) => {
              this.setModalDataTodo(todo);
              this.openModal();
            }}
            progressState={progressState}
            onSwipableLeftOpen={this.getProceedTodo(item as ITodo)}
            onEditPressed={() => {
              onEditTodoPressed(item as ITodo);
            }}
            onDeletePressed={() => {
              todoListStore.deleteTodo(item.id);
            }}
          />
        );
      default:
        return (
          <ReadingCard
            reading={item as IReading}
            onLongPress={(reading: IReading) => {
              this.setModalDataReading(reading);
              this.openModal();
            }}
            progressState={progressState}
            onEditPressed={() => {
              console.log('Reading edit pressed');
            }}
            onDeletePressed={() => {
              todoListStore.deleteReading(item.id);
            }}
          />
        );
    }
  };

  private renderSectionHeader = ({
    section,
  }: {
    section: IDisplayItemSection;
  }) => <Text style={Styles.sectionHeaderText}>{section.title}</Text>;

  private getProceedTodo(todo: ITodo): (() => void) | undefined {
    const { progressState, todoListStore } = this.props;
    switch (progressState) {
      case ProgressState.Pending:
        return () => {
          todoListStore.toggleTodoProgressState(todo.id);
        };
      case ProgressState.InProgress:
        return () => {
          todoListStore.toggleTodoDoneState(todo.id);
        };
      default:
    }
    return;
  }

  @action
  private openModal = () => {
    this.isModalVisible = true;
  };

  @action
  private onModalClosePressed = () => {
    this.isModalVisible = false;
    this.clearModalData();
  };

  @action
  private clearModalData() {
    this.modalData = {
      name: '',
      description: undefined,
      progressString: undefined,
      parentName: undefined,
      progressValue: undefined,
    };
  }

  @action
  private setModalDataGroup(group: IGroup) {
    this.modalData.name = group.name;
    this.modalData.description = group.description;
    this.modalData.progressValue = {
      completed: group.pointsCompleted,
      total: group.pointsTotal,
    };
  }

  @action
  private setModalDataTodo(todo: ITodo) {
    this.modalData.name = todo.name;
    this.modalData.description = todo.description;
  }

  @action
  private setModalDataReading(reading: IReading) {
    this.modalData.name = reading.name;
    this.modalData.progressValue = {
      completed: reading.pagesComplete,
      total: reading.pagesTotal,
    };
  }
}

// Known issues with bold font on certain devices, changed font family
// to fix the problem
const Styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    backgroundColor: Colors.primaryGreyDark,
  },
  sectionHeaderText: {
    fontSize: 32,
    color: 'white',
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 10,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryGreyLight,
  },
  listEmptySubtitle: {
    fontSize: 18,
    color: 'white',
  },
  listEmptyTitle: {
    fontSize: 28,
    color: 'white',
    fontFamily: 'sans-serif-bold',
    fontWeight: 'bold',
  },
  listEmptyIcon: {
    marginTop: 30,
  },
  listEmptyRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listEmptyContentContainer: {
    flexGrow: 1,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
