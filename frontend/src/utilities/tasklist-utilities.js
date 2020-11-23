const defaultTaskList = {"id": 0, "name": "Default"};
const matchedTaskLists = (tasks, tasklists) => {
    const newTaskLists = tasklists.slice(0);
    newTaskLists.unshift(defaultTaskList);
    const matchedTaskLists = newTaskLists.reduce((res, item)=>{
        if (String(item.id) === '0') {
            const relatedTasks = tasks && tasks.length > 0 ? 
            tasks.filter(task=>(!task.taskListId || task.taskListId === 0 || parseInt(String(task.taskListId)) <= 0)) 
            : [];
            res.push({...item, "tasks": relatedTasks});
        } else {
            const relatedTasks = tasks && tasks.length > 0 ? 
            tasks.filter(task=>(task.taskListId && String(task.taskListId) === String(item.id)))
            : [];
            res.push({...item, "tasks": relatedTasks});
        }
        return res;
    }, [])    

  return matchedTaskLists;
}

export {
    matchedTaskLists,
};