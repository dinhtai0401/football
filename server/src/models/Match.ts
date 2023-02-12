import mongoose, { Schema } from 'mongoose';

export interface IMatch extends mongoose.Document {
    homeTeamId: Schema.Types.ObjectId;
    homeTeamName: string
    awayTeamId: Schema.Types.ObjectId;
    awayTeamName: string
    homeTeamGoal: number;
    awayTeamGoal: number;
}
const MatchSchema: Schema = new Schema({
    homeTeamId: { type: Schema.Types.ObjectId, required: true, ref: 'Team' },
    awayTeamId: { type: Schema.Types.ObjectId, required: true, ref: 'Team' },
    homeTeamName: { type: String },
    awayTeamName: { type: String },
    homeTeamGoal: { type: Number, default: 0 },
    awayTeamGoal: { type: Number, default: 0 }
});

export default mongoose.model('Match', MatchSchema);
