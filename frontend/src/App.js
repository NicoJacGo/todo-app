import React, { Component } from "react";
import Modal from "./components/Modal";
import HistoryModal from "./components/HistoryModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyModal: false,
      viewCompleted: false,
      todoList: [],
      modal: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("/api/todos/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/todos/", item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
      .delete(`/api/todos/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
  
    const todoList = this.reorder(
      this.state.todoList,
      result.source.index,
      result.destination.index
    );
  
    this.setState({ todoList });
  };

  fetchChangeHistory = (itemId) => {
    axios
      .get(`/api/todos/${itemId}/changes/`)
      .then((res) => {
        this.setState({ itemChanges: res.data, historyModal: true });
      })
      .catch((err) => console.log(err));
  };
  
  toggleHistoryModal = () => {
    this.setState({ historyModal: !this.state.historyModal });
  };

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };
  
  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
        >
          Complete
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.completed === viewCompleted
    );
  
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <ul className="list-group list-group-flush border-top-0">
                {newItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                    {(provided) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span
                          className={`todo-title mr-2 ${
                            this.state.viewCompleted ? "completed-todo" : ""
                          }`}
                          title={item.description}
                        >
                          {item.title}
                        </span>
                        <span>
                          <button
                            className="btn btn-secondary mr-2"
                            onClick={() => this.editItem(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => this.handleDelete(item)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-info mr-2"
                            onClick={() => this.fetchChangeHistory(item.id)}
                          >
                            View History
                          </button>
                        </span>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };
  
  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button className="btn btn-primary" onClick={this.createItem}>
                  Add task
                </button>
              </div>
              {this.renderTabList()}
              {this.renderItems()}
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
        {this.state.historyModal ? (
          <HistoryModal
            itemChanges={this.state.itemChanges}
            toggle={this.toggleHistoryModal}
          />
        ) : null}
      </main>
    );
  }
  
}  

export default App; 