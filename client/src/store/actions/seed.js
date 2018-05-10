export const polls = [
    {
        _id: "1",
        question: "Yes or No?",
        createdAt: 1000,
        author: '123abc',
        voters: ["123abc"],
        options: [{
            votes: 1,
            value: 'Yes',
            _id: "101"
        }, {
            votes: 0,
            value: 'No',
            _id: "102"
        }]
    },
    {
        _id: "2",
        question: "2017 or 2018?",
        createdAt: 2000,
        author: '124abc',
        voters: ["124abc"],
        options: [{
            votes: 1,
            value: '2018',
            _id: "201"
        }, {
            votes: 0,
            value: '2017',
            _id: "202"
        }]
    }
];