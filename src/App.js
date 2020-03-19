import React from 'react';

import { addTask, getTasks, updateTask } from "./api"

import './App.css';

function InvalidFilterException(message) {
  return {
    name: 'InvalidFilterException',
    message
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
      filter: 'pending'
    }
    this.setFilter = this.setFilter.bind(this);
    this.addTask = this.addTask.bind(this);
    this.toggleDone = this.toggleDone.bind(this);
  }

  componentWillMount = async () => {
    try {
      const response = await getTasks();
      this.setState({tasks: response.data})
    }
    catch (e) {
      console.log('Error grabbing tasks', e.message)
    }
  }

  setFilter(filter) {
    this.setState({filter})
  }

  getFilteredTasks() {
    const { tasks, filter } = this.state;
    return tasks.filter(task => {
      switch (filter) {
        case 'all':
          return true;
        case 'complete':
          return task.done ? true : false;
        case 'pending':
          return task.done ? false : true;
        default:
          throw InvalidFilterException(`Invalid filter: ${filter}`);
      }
    })
  }

  addTask = async () => {
    const { tasks, newTaskDescription } = this.state;
    if (newTaskDescription) {
      try {
        const response = await addTask(newTaskDescription)
        if (response.status === 201){
          this.setState({
            tasks: tasks.concat(response.data),
            newTaskDescription: ""
          })
        }
      }
      catch (e) {
        console.log('Error adding task', e.message)
      }
    }
  }

  toggleDone = async taskId => {
    const { tasks } = this.state;
    const task = tasks.find(t => t.id === taskId)
    task.id = taskId
    task.done = task.done ? false : true;
    try {
      const response = await updateTask(task)
      console.log('toggleDone', response)
      if (response.status === 200) {
        this.setState({
          tasks: this.state.tasks.map(task => {
            if (task.id === taskId) {
              return response.data
            }
            return task
          })
        })
      }
    }
    catch (e) {
      console.log('Error updating task', e.message)
    }
  }

  render() {
    return (
      <div className="App">
        <div>
          <div className="filters">
            <button onClick={() => this.setFilter('all')}>All</button>
            <button onClick={() => this.setFilter('pending')}>Pending</button>
            <button onClick={() => this.setFilter('complete')}>Complete</button>
          </div>
          <div className="add-task">
            <input type="text" onChange={(event) => this.setState({newTaskDescription: event.target.value})} value={this.state.newTaskDescription}/>
            <button onClick={this.addTask}>Add</button>
          </div>
          <ul className="tasklist">
            {this.getFilteredTasks().map(task => <li onClick={() => this.toggleDone(task.id)} className={task.done && "completed"}>{task.description}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
