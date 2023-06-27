import { useCookies } from 'react-cookie';
import './css/Home.css'

import { AiOutlineHeart } from 'react-icons/ai';
import { BiComment } from 'react-icons/bi';
import { IoMdContact } from 'react-icons/io';
import { useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPosts, getStatus, postPost, putPost } from '../api/post';
import { postRT } from '../api/login';

function Home() {
    const commentRef = useRef(null);

    const [, , removeCookie] = useCookies(['jwt', 'jwtRT'])
    const { token, rt, dispatch } = useContext(AppContext)
    const navigate = useNavigate()
    const queryClient = useQueryClient();
    const [, setCookie] = useCookies(['jwt'])

    function clearCommentInputField() {
        if (commentRef.current.value != null) {
            commentRef.current.value = ''
        }
    }

    const status = useQuery({
        queryKey: ["post", "status"],
        queryFn: () => getStatus(token),
    })

    const commentsMutation = useMutation({
        mutationFn: getPosts,
        onSuccess: data => {
            queryClient.setQueryData(["post"], data)
            queryClient.invalidateQueries(["post"], { exact: true })
            status.refetch()
        },
        onError: error => {
            alert(error.response.data.message)
        }
    })

    const postMutation = useMutation({
        mutationFn: postPost,
        onSuccess: data => {
            queryClient.setQueryData(["post"], data)
            queryClient.invalidateQueries(["post"], { exact: true })
            status.refetch()

            clearCommentInputField()
        },
        onError: error => {
            alert(error.response.data.message)
        }
    })

    const updateMutation = useMutation({
        mutationFn: putPost,
        onSuccess: data => {
            queryClient.setQueryData(["post"], data)
            queryClient.invalidateQueries(["post"], { exact: true })
            status.refetch()

            clearCommentInputField()
        },
        onError: error => {
            alert(error.response.data.message)
        }
    })

    const refreshTokenMutation = useMutation({
        mutationFn: postRT,
        onSuccess: data => {
            queryClient.setQueryData(["post", "rt"], data)
            queryClient.invalidateQueries(["post", "rt"], { exact: true })

            const token = {
                token: data.at,
            }

            dispatch({
                type: 'ADD_TOKEN',
                payload: token
            })

            setCookie('jwt', data.at)
            status.refetch()
        },
        onError: error => {
            alert(error.response.data.message)
        }
    })

    if ((status.error != null) && (status.error.response.status) === 403) {
        const data = {
            rt: rt
        }
        refreshTokenMutation.mutate(data)
    }

    function handlePostUpdate() {
        const data = {
            data: {
                like: !liked(),
                status: 'add'
            },
            header: token
        }
        postMutation.mutate(data)
    }

    function handleUpdateUpdate() {
        const data = {
            data: {
                like: !liked(),
                status: 'update'
            },
            header: token
        }
        updateMutation.mutate(data)
    }

    function fetchCommentSection() {
        commentsMutation.mutate(token)
    }

    function handleCommentPost() {
        const data = {
            data: {
                comment: commentRef.current.value,
                status: 'add'
            },
            header: token
        }

        postMutation.mutate(data)
        fetchCommentSection()
        fetchCommentSection()
    }

    function handleCommentUpdate() {
        const data = {
            data: {
                comment: commentRef.current.value,
                status: 'update'
            },
            header: token
        }

        updateMutation.mutate(data)
        fetchCommentSection()
        fetchCommentSection()
    }

    function handleLogout() {
        removeCookie('jwt');
        removeCookie('jwtRT');

        const token = {
            token: null,
            rt: null
        }

        dispatch({
            type: 'REMOVE_TOKEN',
            payload: token
        })

        queryClient.clear()
        navigate('/account')
    }

    function liked() {
        if (!status.isSuccess) {
            return false
        }

        if (status.data.status === null) {
            return false
        } else {
        }

        if (status.data.status.like != null) {
            return status.data.status.like
        }

        return false;
    }

    function nullState() {
        if (!status.isSuccess) {
            return false;
        }

        if (status.data === null) {
            return false;
        }

        if (status.data.status === null) {
            return true;
        }

        return false;
    }

    function updateLike() {
        if (nullState()) {
            return handlePostUpdate()
        }
        return handleUpdateUpdate()
    }

    function updateComment(e) {
        e.preventDefault()
        if (nullState()) {
            return handleCommentPost()
        }
        return handleCommentUpdate()
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-dark fixed-top p-3 text-white">
                <div className="container-fluid">
                    <a href='/' className="navbar-brand"><span className='text-light fw-bold fs-4'>NATURAL</span></a>
                    <div className='d-flex'>
                        <span className='align-self-center me-4 fw-medium'><IoMdContact /> {status.isSuccess ? status.data.username : ''}</span>
                        <button className='btn btn-outline-light border-2 ps-3 pe-3 fw-medium' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>
            <div className="d-flex align-items-center justify-content-end" style={{ height: '100vh', marginTop: '60px' }}>
                <div className="container postCard">
                    <div className="card">
                        <img className="card-img-top"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Eopsaltria_australis_-_Mogo_Campground.jpg/640px-Eopsaltria_australis_-_Mogo_Campground.jpg"
                            style={{}} alt="Bird" />
                        <div className="card-body">
                            <div className='mb-2'>
                                <span className='small fw-medium'>
                                    43 views
                                </span>
                            </div>
                            <h5 className="card-title">
                                Be close to Nature
                            </h5>
                            <p className='card-subtitle'>
                                Being close to nature makes your heart at calm.
                            </p>
                        </div>
                        <div className='card-footer  border-0'>
                            <div className='row card-body'>

                                <button className={liked() ? 'col btn btn-dark me-3' : 'col btn btn-outline-dark me-3'} disabled={status.isLoading} type='button' onClick={updateLike}><AiOutlineHeart /> {liked() ? 'Liked' : 'Like'}</button>
                                <button className='col btn btn-outline-dark' type='button' data-bs-toggle="collapse" data-bs-target="#collapseComment" aria-expanded="false" aria-controls="collapseComment" disabled={commentsMutation.isLoading} onClick={fetchCommentSection}><BiComment /> Comments</button>
                            </div>

                            <div className="collapse" id="collapseComment">
                                <div className='card-body'>
                                    <div className="overflow-auto postComment">
                                        {commentsMutation.isLoading ? <span className='fw-medium'>Loading...</span> :
                                            commentsMutation.isError ? <span className='fw-medium'>Error occurred, please refresh the page.</span> :
                                                commentsMutation.isSuccess ? <ul className='p-0' style={{ listStyleType: 'none' }}>
                                                    {commentsMutation.data.posts.length > 0 ? commentsMutation.data.posts.map((userPost) => (
                                                        userPost.comments.length > 0 ? userPost.comments.map((comment) => (
                                                            <li className='mb-3'>
                                                                <IoMdContact /> <span className='fw-medium'>{userPost.username} - <span className='small text-secondary'>{comment.comment}</span></span>
                                                            </li>
                                                        )) : 'You don\'t have any comments here yet'
                                                    )) : 'No comments yet'}
                                                </ul> : 'Loading...'}
                                        {/* <div className='container mb-3'>
                                            <IoMdContact /> <span className='fw-medium'>user - <span className='small text-secondary'>I agree, I too am very happy to being close to nature</span></span>
                                        </div>
                                        <div className='container'>
                                            <IoMdContact /> <span className='fw-medium'>kiyoko - <span className='small text-secondary'>I remember when I was at hometown of mine back 5 years ago, I didn't realise it back then but now Since I'm at the city living for years. I miss it, It is small but clean and great village.</span></span>
                                        </div> */}
                                    </div>
                                    <div className='container mt-4'>
                                        <form onSubmit={updateComment}>
                                            <input type='text' id='addCommentInput' className='form-control' placeholder='Got a comment?' ref={commentRef} style={{
                                                backgroundColor: '#f6f5f4',
                                                borderColor: '#000'
                                            }} />
                                            <div className='d-grid mt-3'>
                                                <button type='submit' className='btn btn-primary'>Comment</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;