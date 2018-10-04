const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const viewSchema = new Schema({
    videoId: {
        type: String,
        required: true
    },
    watchtime: {
        type: Number,
        default: 0
    }
});

const categorySchema = new Schema({
    name: {
        type: String,
        maxlength: 255,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    }
});

const parentCategorySchema = new Schema({
    name: {
        type: String,
        maxlength: 255,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    },
    subcategories: {
        type: [categorySchema]
    }
});

const userSchema = new Schema({
    username: { // between 5 and 50 characters
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true,
        unique: true
    },
    email: { // a unique email
        type: String,
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, //email regex
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 50,
        required: true
    },
    confirmed: {
        type: Boolean
    },
    role: {
        type: String,
        enum: ['admin', 'consultant', 'user']
    },
    history: {
        type: [viewSchema]
    },
    likes: {
        type: [String]
    }
});

const videoSchema = new Schema({
    url: { // where the video resides
        type: String,
        match: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        required: true,
        unique: true
    },
    title: { // title of the video
        type: String,
        minlength: 3,
        maxlength: 300,
        default: 'No Title'
    },
    thumbnail: { // url of the thumbnail for this video
        type: String,
        match: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    },
    categories: {
        type: [parentCategorySchema]
    },
    tags: {
        type: [String]
    },
    watchtime: { // total number of seconds this video has been watched
        type: Number,
        default: 0
    },
    restricted: { // who can access the video
        type: String,
        enum: ['admin', 'consultant', 'user', 'all']
    }
});

const User = mongoose.model('User', userSchema);
const Category = mongoose.model('Category', parentCategorySchema);
const Video = mongoose.model('Video', videoSchema);