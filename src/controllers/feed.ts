import { Request, Response } from 'express';

export const getPosts = (req: Request, res: Response) => {
    res.status(200).json({
        posts: [
            {
                title: 'Hello',
                content:
                    'Lorem dsjafkjfl lkfjdslkf lsdkfjqpwoiq dfpiqopweidlkfsds',
            },
        ],
    });
};
