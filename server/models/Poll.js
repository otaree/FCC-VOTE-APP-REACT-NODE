const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        minlength: 1,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Number,
        default: new Date().getTime()
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    voters: [
        {
            voter: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        }
    ],
    options: [
        {
            votes: {
                type: Number,
                default: 0
            },
            value: {
                type: String,
                required: true,
                minlength: 1,
                trim: true
            }
        }
    ]
});

// PollSchema.statics.casteVote = function (poll_id, option_id, user_id) {
//     const Poll = this;

//     return new Promise((resolve, reject) => {
//         Poll.findOne({ _id: poll_id, "options._id": option_id })
//             .then(poll => {
//                 if (poll) {
//                     return reject("User already voted");
//                 }

//             })
//     });
// } 

const Poll = mongoose.model('Poll', PollSchema);

module.exports = { Poll };