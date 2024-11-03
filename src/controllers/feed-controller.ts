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

export const createPost = (req: Request, res: Response) => {
    const title = req.body.title;
    const content = req.body.content;
    // Create a post in DB
    res.status(201).json({
        message: 'Post created successfully',
        post: {
            id: new Date().toISOString(),
            title,
            content,
        },
    });
};
