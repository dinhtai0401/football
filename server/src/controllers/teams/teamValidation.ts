import { z } from 'zod';

export const createTeamValidation = z.object({
    body: z.object({
        teamName: z.string()
    })
});

export const createTeamsValidation = z.object({
    body: z.object({
        teams: z.array(z.string())
    })
});
