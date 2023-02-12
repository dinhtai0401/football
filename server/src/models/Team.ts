import mongoose, { Schema } from 'mongoose';

export interface ITeam extends mongoose.Document {
    teamName: string;
}

const Team: Schema = new Schema({
    teamName: { type: String, required: true, unique: true }
});

export default mongoose.model('Team', Team);
