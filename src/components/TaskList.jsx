import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';

import groupSvg from '../assets/Group.svg';
import completedSvg from '../assets/Completed.svg';
import incompleteSvg from '../assets/Incomplete.svg';
import lockedSvg from '../assets/Locked.svg';

import './TaskList.css';

const paperStyle = {
  textAlign: 'left',
  display: 'inline-block',
};

class TaskList extends Component {
  state = {
    visibleGroups: [],
  };

  /**
   * @function toggleGroupVisibility
   * @param {string} group - Name of group
   * @description - toggle the visibility of the group task list
   */
  toggleGroupVisibility = (group) => {
    const { visibleGroups } = this.state;
    if (!visibleGroups.includes(group)) {
      visibleGroups.push(group);
    } else {
      visibleGroups.splice(visibleGroups.indexOf(group), 1);
    }
    this.setState({ visibleGroups });
  }

  /**
   * @function toggleAllTasksVisible
   * @description - toggle visibility of all tasks across groups
   */
  toggleAllTasksVisible = () => {
    const { tasks } = this.props;
    const groups = Object.keys(tasks);
    const { visibleGroups } = this.state;

    for (let i = 0; i < groups.length; i += 1) {
      const group = groups[i];
      if (!visibleGroups.includes(group)) {
        visibleGroups.push(group);
      }
    }
    this.setState({ visibleGroups });
  }

  /**
   * @function getTaskCompletionRatio
   * @param {string} group - Name of group
   * @returns {string} - text representing task completion ratio
   */
  getTaskCompletionRatio = (group) => {
    const tasks = this.props.tasks[group];
    if (!tasks) {
      return `0 of 0 TASKS COMPLETE`;
    }

    let completed = 0;
    for (let i = 0; i < tasks.length; i += 1) {
      const task = tasks[i];
      if (task.completedAt) {
        completed += 1;
      }
    }
    return `${completed} of ${tasks.length} TASKS COMPLETE`;
  }

  /**
   * @function renderTask
   * @returns {Component} - task item with icon, css classes according to completion status
   * @description - potentially refactorable into a seperate component...
   */
  renderTask = (task, group) => {
    const tasks = this.props.tasks[group];
    if (!task || !tasks) return null;

    const { completedAt } = task;
    let icon, taskClass, clickHandler;
    if (completedAt) {
      icon = completedSvg;
      taskClass = "task-item completed";
    } else {
      const { dependencyIds } = task;
      const dependencies = tasks.filter(task => dependencyIds.includes(task.id));
      const incompleteDependencies = dependencies.filter(task => !task.completedAt);
      icon = incompleteDependencies.length > 0 ? lockedSvg : incompleteSvg;
      taskClass = "task-item " + (incompleteDependencies.length > 0 ? "locked" : "incomplete");
    }

    return (
      <div className={taskClass} >
        <div className="frame" onClick={() => this.props.toggleCompleted(task, group)}>
          <img src={icon} />
        </div>
        <div className="task">
          <p>{task.task}</p>
        </div>
      </div>
    );
  }

  render() {
    const { visibleGroups } = this.state;
    const { tasks } = this.props;
    const groups = Object.keys(tasks);
    return (
      <div>
        <a className="toggler" onClick={this.toggleAllTasksVisible}>ALL GROUPS</a>
        <Paper className="task-list-component" style={paperStyle} zDepth={2}>
          <div>
            <div className="task-list-header">Things To Do</div>
          </div>
          <div>
            {
              groups.map(group => (
                <div>
                  <div className="group-item" key={`_${group}`}>
                    <div className="frame" onClick={() => this.toggleGroupVisibility(group)}>
                      <img src={groupSvg} alt="group" />
                    </div>
                    <div className="group-heading" >
                      <p>{group.toUpperCase()}</p>
                      <p>{this.getTaskCompletionRatio(group)}</p>
                    </div>
                  </div>
                  {visibleGroups.includes(group) &&
                    <div className="task-list">
                      {tasks[group].map(task => this.renderTask(task, group))}
                    </div> 
                  }
                </div>
              ))
            }
          </div>
        </Paper>
      </div>
    );
  }
}

TaskList.propTypes = {
  tasks: PropTypes.objectOf(PropTypes.array)
};

export default TaskList;
