Worker information
0.15s0.01s0.00s0.01s
system_info
Build system information
0.01s0.01s0.43s0.21s0.05s0.00s0.04s0.00s0.01s0.01s0.01s0.01s0.01s0.00s0.00s0.02s0.00s0.01s0.33s0.00s0.00s0.00s0.01s0.00s0.10s0.01s0.80s0.00s0.00s6.04s0.00s2.67s0.00s2.60s
docker_mtu_and_registry_mirrors
resolvconf
git.checkout
0.73s$ git clone --depth=50 --branch=travis https://github.com/YuyaoZhong/4156-team-project.git YuyaoZhong/4156-team-project
0.01s
nvm.install
2.71s$ nvm install 12.13
cache.1
Setting up build cache
cache.npm
$ node --version
v12.13.1
$ npm --version
6.12.1
$ nvm --version
0.37.0
install.1
0.00s$ cd frontend/
install.2
30.28s$ npm install package.json
15.29s$ npm run test -- --coverage --watchAll=false
> time-manager@0.1.0 test /home/travis/build/YuyaoZhong/4156-team-project/frontend
> react-scripts test "--coverage" "--watchAll=false"
 PASS  src/components/timerpage/__tests__/timer-form-edit.test.js
 PASS  src/utilities/__tests__/timer-utilities.test.js
 PASS  src/components/timerpage/__tests__/timer-form-create.test.js
 PASS  src/components/taskList/__tests__/task-list.test.js
 PASS  src/components/taskList/__tests__/tasklist-card-test.test.js
 PASS  src/components/taskList/__tests__/task-div.test.js
 PASS  src/components/taskList/__tests__/new-tasklist-card.test.js
 PASS  src/components/timerpage/__tests__/timer-table.test.js
 PASS  src/components/taskList/__tests__/edit-task-div.test.js
 PASS  src/components/navbar/__tests__/navbar.test.js
 PASS  src/components/timers/__tests__/share-button.test.js
 PASS  src/context/__tests__/data-context.test.js
  ● Console
    console.log
      [
        {
          code: 200,
          message: 'success',
          data: [ [Object], [Object], [Object], [Object], [Object], [Object] ]
        },
        {
          code: 200,
          message: 'success',
          data: [ [Object], [Object], [Object] ]
        },
        { code: 200, message: 'success', data: [ [Object], [Object] ] }
      ]
      at src/context/data-context.js:48:29
    console.log
      {
        breakTime: 5,
        description: '',
        duration: 25,
        id: -1,
        isCreator: true,
        round: 1,
        startTime: '2021-12-21T20:50:00.000Z',
        timerToUserId: '0',
        title: 'test timer 1',
        userId: '0',
        zoomLink: 'None'
      }
      at checkTImerRunning (src/context/data-context.js:82:21)
    console.log
      <DataContextProvider>
        <div />
      </DataContextProvider>
      at Object.<anonymous> (src/context/__tests__/data-context.test.js:60:17)
    console.log
      {
        children: {
          '$$typeof': Symbol(react.element),
          type: 'div',
          key: null,
          ref: null,
          props: {},
          _owner: null,
          _store: {}
        }
      }
      at Object.<anonymous> (src/context/__tests__/data-context.test.js:61:17)
 PASS  src/components/timers/__tests__/timer-message.test.js
 PASS  src/utilities/__tests__/timer-form-utilities.test.js
 PASS  src/components/timerpage/__tests__/timer-board.test.js
 PASS  src/utilities/__tests__/utilities.test.js
 PASS  src/components/timerpage/__tests__/time-line.test.js
 PASS  src/components/timerpage/__tests__/display-attached-tasks.test.js
 PASS  src/components/timerpage/__tests__/attach-list.test.js
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   65.57 |    58.25 |   58.56 |   66.42 |                   
 src               |       0 |        0 |       0 |       0 |                   
  App.js           |       0 |      100 |       0 |       0 | 19                
  index.js         |       0 |      100 |     100 |       0 | 9-17              
  ...tWebVitals.js |       0 |        0 |       0 |       0 | 1-8               
 src/components    |       0 |        0 |       0 |       0 |                   
  homepage.js      |       0 |        0 |       0 |       0 | 16-29             
 ...ponents/navbar |     100 |      100 |     100 |     100 |                   
  navbar.js        |     100 |      100 |     100 |     100 |                   
 ...mponents/table |   80.95 |    33.33 |   72.73 |      85 |                   
  ...eact-table.js |   80.95 |    33.33 |   72.73 |      85 | 67-72,76          
 ...nents/taskList |     100 |      100 |     100 |     100 |                   
  edit-task-div.js |     100 |      100 |     100 |     100 |                   
  ...klist-card.js |     100 |      100 |     100 |     100 |                   
  task-div.js      |     100 |      100 |     100 |     100 |                   
  task-list.js     |     100 |      100 |     100 |     100 |                   
  tasklist-card.js |     100 |      100 |     100 |     100 |                   
 ...ents/timerpage |   98.28 |    85.34 |   97.96 |    98.8 |                   
  attach-list.js   |     100 |      100 |     100 |     100 |                   
  ...ched-tasks.js |     100 |      100 |     100 |     100 |                   
  time-line.js     |     100 |      100 |     100 |     100 |                   
  timer-board.js   |     100 |      100 |     100 |     100 |                   
  timer-form.js    |   97.98 |    77.63 |     100 |   97.87 | 107,121           
  timers-table.js  |    97.3 |      100 |   91.67 |     100 |                   
 ...ponents/timers |   19.35 |    23.26 |   17.65 |   20.51 |                   
  share-button.js  |     100 |      100 |     100 |     100 |                   
  ...etail-info.js |     100 |    48.28 |     100 |     100 | 9-50              
  timer-info.js    |       0 |        0 |       0 |       0 | 19-191            
  timer-message.js |     100 |      100 |     100 |     100 |                   
  timer-running.js |       0 |        0 |       0 |       0 | 10-120            
 ...omponents/zoom |       0 |        0 |       0 |       0 |                   
  zoom-button.js   |       0 |        0 |       0 |       0 | 5-8               
  zoom-page.js     |       0 |        0 |       0 |       0 | 7-40              
 src/constants     |     100 |      100 |     100 |     100 |                   
  constants.js     |     100 |      100 |     100 |     100 |                   
 src/context       |   38.14 |     9.38 |   30.19 |    37.5 |                   
  data-context.js  |   37.23 |     9.38 |   29.41 |   36.84 | ...69-287,295-296 
  ...in-context.js |   66.67 |      100 |      50 |      60 | 9-13              
 src/routes        |       0 |        0 |       0 |       0 |                   
  PrivateRoute.js  |       0 |        0 |       0 |       0 | 5-12              
  PublicRoute.js   |       0 |        0 |       0 |       0 | 5-11              
 src/utilities     |   88.73 |    83.21 |   74.29 |   90.64 |                   
  apiMethods.js    |   33.33 |      100 |       0 |   33.33 | 2-9,13-16         
  mockData.js      |     100 |      100 |     100 |     100 |                   
  ...-utilities.js |     100 |    73.33 |     100 |     100 | 8-13              
  ...-utilities.js |   81.82 |    77.38 |      90 |   82.56 | ...11,114,126-127 
  ...-utilities.js |     100 |      100 |     100 |     100 |                   
  utilities.js     |   88.89 |      100 |      60 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------
Test Suites: 19 passed, 19 total
Tests:       85 passed, 85 total
Snapshots:   2 passed, 2 total
Time:        14.585 s
Ran all test suites.
The command "npm run test -- --coverage --watchAll=false" exited with 0.
cache.2
store build cache
Done. Your build exited with 0.
