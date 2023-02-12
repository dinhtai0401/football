import mongoose, { Schema } from 'mongoose';

export interface IStanding extends mongoose.Document {
    teamId: Schema.Types.ObjectId;
    teamName: string
    playedMatch: number;
    wins: number;
    ties: number;
    loses: number;
    goals: number;
    goalsAgainst: number;
    points: number;
}

const StandingSchema: Schema = new Schema({
    teamId: { type: Schema.Types.ObjectId, required: true, ref: 'Team' },
    teamName: { type: String },
    playedMatch: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    ties: { type: Number, default: 0 },
    loses: { type: Number, default: 0 },
    goals: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    points: { type: Number, default: 0 }
});

export default mongoose.model('Standing', StandingSchema);
