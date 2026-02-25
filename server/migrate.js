require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Models = require('./models/DataModels');

async function migrateData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas for Data Migration');

    const DATA_DIR = path.join(__dirname, '..', 'client', 'public', 'data');
    console.log(`Reading JSON files from: ${DATA_DIR}`);

    const types = ['projects', 'blog', 'certifications', 'education', 'skills', 'profile'];

    for (const type of types) {
      const filePath = path.join(DATA_DIR, `${type}.json`);
      if (fs.existsSync(filePath)) {
        console.log(`Found ${type}.json, migrating...`);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);

        if (type === 'profile' || type === 'skills') {
          // Singleton
          const Model = type === 'profile' ? Models.Profile : Models.Skill;
          await Model.findOneAndUpdate(
            { id: 'singleton' },
            { ...data, id: 'singleton' },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
          console.log(`Migrated ${type} (Singleton)`);
        } else {
          // Arrays
          let Model;
          switch(type) {
            case 'projects': Model = Models.Project; break;
            case 'blog': Model = Models.Blog; break;
            case 'certifications': Model = Models.Certification; break;
            case 'education': Model = Models.Education; break;
          }

          if (Array.isArray(data) && data.length > 0) {
            // Delete existing to avoid duplicates during repeated testing
            await Model.deleteMany({});
             
            for (const item of data) {
               // Ensure time exists
               if (!item.time) item.time = Date.now();
               // Ensure id exists
               if (!item.id) item.id = `${type.slice(0, -1)}-${Date.now()}-${Math.random()}`;

               await Model.create(item);
            }
            console.log(`Migrated ${data.length} items for ${type}`);
          } else {
            console.log(`${type}.json is empty or not an array. Skipping.`);
          }
        }
      } else {
        console.log(`File not found: ${type}.json. Skipping.`);
      }
    }

    console.log('--- Migration Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateData();
