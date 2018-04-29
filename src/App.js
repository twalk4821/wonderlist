import React, { Component } from 'react';
import TaskList from './components/TaskList';
import logo from './logo.svg';
import exampleData from './data/example';
import './App.css';

class App extends Component {
  state = {
    tasks: {},
  };

  componentWillMount() {
    this.processTaskData(exampleData);
  }

  /**
   * @function processTaskData
   * @param {[]} tasks - array of tasks
   * @description - create tasks object, organizing tasks by group
   */
  processTaskData(tasks) {
    if (!Array.isArray(tasks)) {
      throw new Error('Tasks must be an array.');
    }

    const processed = {};
    for (let i = 0; i < tasks.length; i += 1) {
      const task = tasks[i];
      const { group } = task;
      if (!(group in processed)) {
        processed[group] = [task];
      } else {
        processed[group].push(task);
      }

    }

    this.setState({ tasks: processed });
  }

    /**
   * @function toggleCompleted
   * @param {Object} - Task to toggle
   * @description - Toggle completion status on a task. If null, set completedAt to now, otherwise set to null
   * @returns {boolean} - Whether the task was toggled successfully or not
   */
  toggleCompleted = (task) => {
    if (!task) {
      return false;
    }
  
    const now = new Date();
    task.completedAt = task.completedAt ? null : now;
  
    const { tasks } = this.state;
    const groups = Object.keys(tasks);
    let found = false;
    for (let i = 0; i < groups.length; i += 1) {
      const tasksForGroup = tasks[groups[i]];
      for (let j = 0; j < tasksForGroup.length; j += 1) {
        if (tasksForGroup[j].id === task.id) {
          tasksForGroup[j] = task;
          found = true;
        }
      }
    }

    if (found) {
      this.setState({ tasks });
    }
    return found;
  }

  render() {
    const { tasks } = this.state;

    return (
      <div className="App">
        <h1 className="title">Wonderlist</h1>
        <TaskList tasks={tasks} toggleCompleted={this.toggleCompleted}/>
      </div>
    );
  }
}

export default App;
