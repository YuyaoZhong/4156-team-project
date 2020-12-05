const mockTaskArray = [
    {
        id: -1,
        name: "Test Task 1",
        status: 0,
        taskListId: 0,
        userId: "0"
    },
    {
        id: -2,
        name: "Test Task 2",
        status: 0,
        taskListId: 0,
        userId: "0"
    },

    {
        id: -3,
        name: "Test Task 3",
        status: 0,
        taskListId: 0,
        userId: "0"
    },
]



const mockTaskListArray = [
   {
    id: -1,
    name: "Test TaskList 1",
    userId: "0"
   },

   {
    id: -2,
    name: "Test TaskList 2",
    userId: "0"
   }

]


const mockTimerArray = [
    {  
            breakTime: 5,
            description: "",
            duration: 25,
            id:-1,
            isCreator: true,
            round: 1,
            startTime: "2021-12-21T20:50:00.000Z",
            timerToUserId: "0",
            title: "test timer 1",
            userId: "0",
            zoomLink: "None"
    },
    {  
        breakTime: 5,
        description: "",
        duration: 25,
        id: -2,
        isCreator: false,
        round: 1,
        startTime: "2020-12-03T20:50:00.000Z",
        timerToUserId: "0",
        title: "test shared timer",
        userId: "-1",
        zoomLink: "None"
    },
    {  
        breakTime: 5,
        description: "",
        duration: 25,
        id: -3,
        isCreator: false,
        round: 1,
        startTime: "2022-12-03T20:50:00.000Z",
        timerToUserId: "0",
        title: "test shared timer",
        userId: "-1",
        zoomLink: "None"
    },
    {  
        breakTime: 5,
        description: "",
        duration: 25,
        id: -4,
        isCreator: false,
        round: 1,
        startTime: "2023-12-03T20:50:00.000Z",
        timerToUserId: "0",
        title: "test shared timer",
        userId: "-1",
        zoomLink: "None"
    },
    {  
        breakTime: 5,
        description: "",
        duration: 25,
        id: -5,
        isCreator: false,
        round: 1,
        startTime: "2024-12-03T20:50:00.000Z",
        timerToUserId: "0",
        title: "test shared timer",
        userId: "-1",
        zoomLink: "None"
    },
    {  
        breakTime: 5,
        description: "",
        duration: 25,
        id: -6,
        isCreator: false,
        round: 1,
        startTime: "2025-12-03T20:50:00.000Z",
        timerToUserId: "0",
        title: "test shared timer",
        userId: "-1",
        zoomLink: "None"
    }

]

const mockEditTimer =  {  
    breakTime: 5,
    description: "",
    duration: 25,
    id: -2,
    isCreator: false,
    round: 1,
    startTime: new Date(new Date().getTime() + 60 * 60000).toISOString(),
    timerToUserId: "0",
    title: "test shared timer",
    userId: "-1",
    zoomLink: "None"
};

const mockRelatedTasksForTimer = [
        {
            id: -1,
            relId: -1,
            name: "Test Task 1",
            status: 0,
            taskListId: 0,
            userId: "0"
        },
        {
            id: -2,
            relId: -2,
            name: "Test Task 2",
            status: 0,
            taskListId: 0,
            userId: "0"
        },
        
]

const genStr = (size) => {
    let res  = "";
    for(var i = 0; i < size ; i++){
       res  += "a";
    }
    return res;
}

export {
    mockTaskArray,
    mockTaskListArray,
    mockTimerArray,
    mockEditTimer,
    mockRelatedTasksForTimer,
    genStr,
}