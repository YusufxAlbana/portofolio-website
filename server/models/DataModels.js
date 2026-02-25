const mongoose = require('mongoose');

// Because the data types vary and the user relies on a dynamic JSON structure,
// we will use a flexible schema for most collections, or specific ones where needed.

// Projects, Blog, Certifications, Education can share a flexible schema
const ItemSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    time: { type: Number, default: Date.now },
    // Use mongoose.Schema.Types.Mixed for flexibility to match the old JSON structure
}, { strict: false });

const Project = mongoose.model('Project', ItemSchema);
const Blog = mongoose.model('Blog', ItemSchema);
const Certification = mongoose.model('Certification', ItemSchema);
const Education = mongoose.model('Education', ItemSchema);
const Message = mongoose.model('Message', ItemSchema);

// Profile and Skills are Singletons (only one document exists)
const SingletonSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, default: 'singleton' }
}, { strict: false });

const Profile = mongoose.model('Profile', SingletonSchema);
const Skill = mongoose.model('Skill', SingletonSchema);

module.exports = {
    Project,
    Blog,
    Certification,
    Education,
    Message,
    Profile,
    Skill
};
