"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeamsValidation = exports.createTeamValidation = void 0;
const zod_1 = require("zod");
exports.createTeamValidation = zod_1.z.object({
    body: zod_1.z.object({
        teamName: zod_1.z.string()
    })
});
exports.createTeamsValidation = zod_1.z.object({
    body: zod_1.z.object({
        teams: zod_1.z.array(zod_1.z.string())
    })
});
