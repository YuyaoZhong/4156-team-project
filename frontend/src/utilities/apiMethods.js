const upsertData = (route, data, method) => {
    return fetch(route, {
        method: method,
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(r=>r.json())
};

const deleteData = (route) => {
    return fetch(route, {
        method: "DELETE",
        mode: 'cors'
    }).then(r=>r.json())
}

export {
    upsertData,
    deleteData,
};


