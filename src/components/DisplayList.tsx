import React from 'react';
import {
  SectionList,
  StyleSheet,
  SectionListData,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors } from '../shared/Colors';
import { IGroup } from '../../db/Groups';
import { IReading } from '../../db/Readings';
import { ITodo } from '../../db/Todo';
import { SectionTitles } from '../shared/Utils';
import TodoCard from '../components/TodoCard';
import GroupCard from '../components/GroupCard';
import ReadingCard from '../components/ReadingCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DisplayItem from './DisplayItem';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import AddItemFABGroup from './AddItemFABGroup';
import { Dimensions } from 'react-native';

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
}

// contentContainerStyle on SectionList needs to be set to flexGrow 1 in order
// to center the resulting view on the screen
@observer
export default class DisplayList extends React.Component<IProps> {
  @observable private isModalVisible: boolean;
  @observable private modalData: IModalData;
  @observable private isFABOpen: boolean;

  constructor(props: IProps) {
    super(props);
    runInAction(() => {
      this.isModalVisible = false;
      this.modalData = {
        name: '',
      };
      this.isFABOpen = false;
      // https://mobx.js.org/migrating-from-4-or-5.html
      makeObservable(this);
    });
  }

  render() {
    const screenHeight = Dimensions.get('window').height;
    return (
      <View style={Styles.root}>
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
          // minHeight was added to center the empty list content after FAB broke the flexGrow
          contentContainerStyle={[
            Styles.listEmptyContentContainer,
            { minHeight: screenHeight - 60 },
          ]}
        />

        <AddItemFABGroup
          open={this.isFABOpen}
          onPress={this.openFAB}
          onClosePressed={this.closeFAB}
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
    switch (section.title) {
      case SectionTitles.Groups.toString():
        return (
          <GroupCard
            group={item as IGroup}
            onLongPress={(group: IGroup) => {
              this.setModalDataGroup(group);
              this.openModal();
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
          />
        );
    }
  };

  private renderSectionHeader = ({
    section,
  }: {
    section: IDisplayItemSection;
  }) => <Text style={Styles.sectionHeaderText}>{section.title}</Text>;

  @action
  private openModal = () => {
    this.isModalVisible = true;
    console.log('modalVisible: ' + this.isModalVisible);
  };

  @action
  private onModalClosePressed = () => {
    this.isModalVisible = false;
    this.clearModalData();
    console.log('modal close pressed');
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
  }

  @action
  private setModalDataReading(reading: IReading) {
    this.modalData.name = reading.name;
    this.modalData.progressValue = {
      completed: reading.pagesComplete,
      total: reading.pagesTotal,
    };
  }

  @action
  private openFAB = () => {
    console.log('Open FAB');
    this.isFABOpen = true;
  };

  @action
  private closeFAB = () => {
    console.log('Close FAB');
    this.isFABOpen = false;
  };
}

// Known issues with bold font on certain devices, changed font family
// to fix the problem
const Styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    backgroundColor: Colors.primaryGrey,
  },
  sectionHeaderText: {
    fontSize: 32,
    color: 'white',
    marginLeft: 20,
    fontWeight: 'bold',
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
