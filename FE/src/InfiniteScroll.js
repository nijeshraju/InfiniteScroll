import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { Machine, assign } from 'xstate';
import axios from 'axios';
import ArticleList from './ArticleList';

const apiUrl = 'http://localhost:4001/api/photo-gallery-feed-page/page/';

const fetchArticles = (page) => {
    return axios.get(apiUrl + page);
};

const articleMachine = Machine({
    id: 'article',
    initial: 'loading',
    context: {
        articles: [],
        page: 1,
    },
    states: {
        loading: {
            invoke: {
                src: 'loadArticles',
                onDone: {
                    target: 'loaded',
                    actions: 'setArticles',
                },
                onError: 'error',
            },
        },
        loaded: {
            on: {
                LOAD_MORE: {
                    target: 'loading',
                    actions: 'incrementPage',
                },
            },
        },
        error: {
            on: {
                RETRY: 'loading',
            },
        },
    },
});

const InfiniteScroll = () => {

    const [state, send] = useMachine(articleMachine, {
        actions: {
            setArticles: assign({
                articles: (context, event) => context.articles.concat(event.data.nodes),
            }),
            incrementPage: assign({
                page: (context) => context.page + 1,
            }),
        },
        services: {
            loadArticles: async (context) => {
                const response = await fetchArticles(context.page);
                return response.data;
            },
        },
    });

    useEffect(() => {
        if (state.matches('loaded')) {
            const handleScroll = () => {
                if (
                    window.innerHeight + window.scrollY >= document.body.offsetHeight &&
                    !state.context.articles.includes(null)
                ) {
                    send('LOAD_MORE');
                }
            };

            window.addEventListener('scroll', handleScroll);

            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [state, send]);

    return (
        <div>
            <h1>Infinite Scroll Listing</h1>
            <ArticleList articles={state?.context?.articles} />
            {state.matches('loading') && <p>Loading...</p>}
            {state.matches('error') && (
                <button onClick={() => send('RETRY')}>Retry</button>
            )}
        </div>
    );
};

export default InfiniteScroll;
