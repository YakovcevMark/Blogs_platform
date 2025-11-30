import {setupApp} from "../src/setup-app";
import express from "express";
import request from 'supertest'
import {HTTP_STATUS_CODES} from "../src/core/enums/http-status-codes";
import {BlogInputModel} from "../src/models/blogs/types/blog.input.model";
import {RoutePaths} from "../src/models/paths";
import {BlogViewModel} from "../src/models/blogs/types/blog.view.model";
import {CommentInputModel} from "../src/models/comments/types/comment.input.model";
import {UserInputModel} from "../src/models/users/types/user.input.model";
import {UserViewModel} from "../src/models/users/types/user.view.model";
import {CommentViewModel} from "../src/models/comments/types/comment.view.model";
import {PostInputModel} from "../src/models/posts/types/post.input.model";
import {PostViewModel} from "../src/models/posts/types/post.view.model";

const auth = {
    token: `Basic ${btoa('admin:qwerty')}`,
    headerName: 'Authorization'
}

const blogCreate: BlogInputModel = {
    name: "blog Name",
    description: "blog description",
    websiteUrl: "https://google.com",
};

const postCreate: PostInputModel = {
    content:'awd1231',
    blogId:'123',
    shortDescription:'123',
    title:'awdh',
};

const commentCreate: CommentInputModel = {
    content: 'awd new mawd pgmt drignm sezlwkfm bnt;fdbo s;eklmf lrkbjn dlrtbi slekfmn slrkbm'
};

const userCreate: UserInputModel = {
    password: 'passtrhd',
    email: 'abra@gmail.com',
    login: 'log'
};


describe(RoutePaths.comments, () => {
    const app = express();
    let createdComment: CommentViewModel | null = null;
    let createdUser: UserViewModel | null = null;
    let createdBlog: BlogViewModel | null = null;
    let createdPost: PostViewModel | null = null;
    let sessionToken: string | null = null;

    // const getAll = async () => await request(app).get(RoutePaths.blogs)

    beforeAll(async () => {
        await setupApp(app);
        await request(app).delete("/testing/all-data").expect(HTTP_STATUS_CODES.NO_CONTENT_204)
    });

    it('creating user', async () => {
        const resp = await request(app)
            .post(RoutePaths.users)
            .set(auth.headerName, auth.token)
            .send(userCreate)
        expect(resp.status).toBe(HTTP_STATUS_CODES.CREATED_201)
        expect(resp.body.email).toBe(userCreate.email)
        expect(resp.body.login).toBe(userCreate.login)
        createdUser = resp.body;
    })

    it('login', async () => {
        const resp = await request(app)
            .post(`${RoutePaths.auth}login`)
            .set(auth.headerName, auth.token)
            .send({
                loginOrEmail:createdUser!.login,
                password:userCreate.password,
            })
        expect(resp.status).toBe(HTTP_STATUS_CODES.OK_200)
        sessionToken = resp.body.accessToken;
    })

    it('create blog', async () => {
        const resp = await request(app)
            .post(RoutePaths.blogs)
            .set(auth.headerName, auth.token)
            .send(blogCreate)
        expect(resp.status).toBe(HTTP_STATUS_CODES.CREATED_201)
        expect(resp.body.name).toBe(blogCreate.name)
        expect(resp.body.description).toBe(blogCreate.description)
        expect(resp.body.websiteUrl).toBe(blogCreate.websiteUrl)
        createdBlog = resp.body;
    })

    it('create post', async () => {
        const resp = await request(app)
            .post(RoutePaths.posts)
            .set(auth.headerName, auth.token)
            .send({
                ...postCreate,
                blogId: createdBlog!.id
            })
        expect(resp.status).toBe(HTTP_STATUS_CODES.CREATED_201)
        expect(resp.body.blogId).toBe(createdBlog!.id)
        expect(resp.body.title).toBe(postCreate.title)
        expect(resp.body.shortDescription).toBe(postCreate.shortDescription)
        expect(resp.body.content).toBe(postCreate.content)
        createdPost = resp.body;
    })

    it('сreate comment', async () => {
        const resp = await request(app)
            .post(`${RoutePaths.posts}${createdPost!.id}/comments`)
            .set(auth.headerName, `B ${sessionToken}` as string)
            .send({
                ...commentCreate,
                postId: createdPost!.id
            })
        expect(resp.status).toBe(HTTP_STATUS_CODES.CREATED_201)
        expect(resp.body.content).toBe(commentCreate.content)
        expect(resp.body.commentatorInfo.userId).toBe(createdUser!.id)
        expect(resp.body.commentatorInfo.userLogin).toBe(createdUser!.login)
        createdComment = resp.body;
    })

    it('update comment with incorrect auth header', async () => {
        const resp = await request(app)
            .put(`${RoutePaths.comments}${createdComment!.id}`)
            // .set(auth.headerName, `B ${sessionToken}` as string)
            .send({
               content:'awdbvghnsdzrgdrg'
            })
        expect(resp.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401)
    })

    it('update comment with incorrect id', async () => {
        const resp = await request(app)
            .put(`${RoutePaths.comments}692c592e02875c45c2028732`)
            .set(auth.headerName, `B ${sessionToken}` as string)
            .send({
               content:'awdbvghnsdzrgdrgrgftghdfxthsrgxdtfhncgyjfgyjcfgyjcgyn'
            })
        console.log(resp.body)
        expect(resp.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404)
    })

    it('update comment with small content', async () => {
        const resp = await request(app)
            .put(`${RoutePaths.comments}${createdComment!.id}`)
            .set(auth.headerName, `B ${sessionToken}` as string)
            .send({
               content:'short'
            })
        expect(resp.status).toBe(HTTP_STATUS_CODES.CLIENT_ERROR_400)
    })


})

